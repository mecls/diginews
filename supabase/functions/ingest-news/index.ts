// @ts-nocheck
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

type NewsSource = {
  id: string
  name: string
  feed_url: string
  category: string | null
  country: string | null
  language: string | null
  etag: string | null
  last_modified: string | null
  error_count: number
}

function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  return crypto.subtle.digest('SHA-256', data).then((buf) => {
    const bytes = new Uint8Array(buf)
    return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
  })
}

function decodeHtmlEntities(s: string): string {
  // Minimal decoding for common RSS entities.
  return s
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function getTagText(xml: string, tag: string): string | null {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i')
  const m = xml.match(re)
  return m ? m[1].trim() : null
}

function getAttr(xml: string, tag: string, attr: string): string | null {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}="([^"]+)"[^>]*\\/?>`, 'i')
  const m = xml.match(re)
  return m ? m[1].trim() : null
}

function normalizeUrl(url: string): string {
  try {
    const u = new URL(url.trim())
    u.hash = ''
    // Common tracking params to drop. Keep minimal for MVP.
    const drop = new Set([
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_term',
      'utm_content',
      'utm_id',
      'utm_name',
      'utm_reader',
      'utm_referrer',
      'utm_social',
      'utm_social-type',
      'fbclid',
      'gclid',
      'mc_cid',
      'mc_eid',
    ])
    ;[...u.searchParams.keys()].forEach((k) => {
      if (drop.has(k)) u.searchParams.delete(k)
    })
    return u.toString()
  } catch {
    return url.trim()
  }
}

function extractItems(xml: string): string[] {
  // RSS: <item>...</item> | Atom: <entry>...</entry>
  const items: string[] = []
  const rssRe = /<item\b[\s\S]*?<\/item>/gi
  const atomRe = /<entry\b[\s\S]*?<\/entry>/gi

  for (const m of xml.matchAll(rssRe)) items.push(m[0])
  if (items.length > 0) return items
  for (const m of xml.matchAll(atomRe)) items.push(m[0])
  return items
}

function parsePublishedAt(itemXml: string): string | null {
  const candidates = [
    getTagText(itemXml, 'pubDate'),
    getTagText(itemXml, 'published'),
    getTagText(itemXml, 'updated'),
    getTagText(itemXml, 'dc:date'),
  ].filter(Boolean) as string[]

  for (const c of candidates) {
    const d = new Date(c)
    if (!Number.isNaN(d.getTime())) return d.toISOString()
  }
  return null
}

function parseCanonicalUrl(itemXml: string): string | null {
  // Atom: <link href="..."/>
  const href = getAttr(itemXml, 'link', 'href')
  if (href) return href

  const link = getTagText(itemXml, 'link')
  if (link) return link

  const guid = getTagText(itemXml, 'guid')
  if (guid && /^https?:\/\//i.test(guid)) return guid

  return null
}

function parseImageUrl(itemXml: string): string | null {
  const enclosure = getAttr(itemXml, 'enclosure', 'url')
  if (enclosure) return enclosure
  const media = getAttr(itemXml, 'media:content', 'url')
  if (media) return media
  const thumb = getAttr(itemXml, 'media:thumbnail', 'url')
  if (thumb) return thumb
  return null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { status: 200 })

  const body = await req.json().catch(() => ({} as any))
  const maxSources = Math.max(1, Math.min(Number(body?.max_sources ?? 3), 20))
  const maxItemsPerSource = Math.max(1, Math.min(Number(body?.max_items_per_source ?? 25), 100))
  const fetchTimeoutMs = Math.max(500, Math.min(Number(body?.fetch_timeout_ms ?? 4000), 20000))

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceRoleKey) {
    return Response.json({ error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })

  const expectedSecret = Deno.env.get('INGEST_NEWS_SECRET')
  if (expectedSecret) {
    const providedSecret = req.headers.get('x-ingest-secret')
    if (providedSecret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const { data: sources, error: sourcesError } = await supabase
    .from('news_sources')
    .select('id,name,feed_url,category,country,language,etag,last_modified,error_count')
    .eq('is_active', true)
    .order('last_fetched_at', { ascending: true, nullsFirst: true })
    .order('error_count', { ascending: true })
    .limit(maxSources)

  if (sourcesError) {
    return Response.json({ error: 'Failed to load sources', details: sourcesError.message }, { status: 500 })
  }

  const results: Array<{ source_id: string; inserted_or_updated: number; skipped: number; status: string }> = []

  for (const source of (sources ?? []) as NewsSource[]) {
    const headers: HeadersInit = { 'user-agent': 'diginews-ingester/0.1' }
    if (source.etag) headers['if-none-match'] = source.etag
    if (source.last_modified) headers['if-modified-since'] = source.last_modified

    let res: Response
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort('fetch_timeout'), fetchTimeoutMs)
      res = await fetch(source.feed_url, { headers, signal: controller.signal })
      clearTimeout(timeout)
    } catch (e) {
      await supabase
        .from('news_sources')
        .update({
          error_count: (source.error_count ?? 0) + 1,
          last_fetched_at: new Date().toISOString(),
        })
        .eq('id', source.id)
      results.push({ source_id: source.id, inserted_or_updated: 0, skipped: 0, status: `fetch_error:${String(e)}` })
      continue
    }

    if (res.status === 304) {
      await supabase.from('news_sources').update({ last_fetched_at: new Date().toISOString() }).eq('id', source.id)
      results.push({ source_id: source.id, inserted_or_updated: 0, skipped: 0, status: 'not_modified' })
      continue
    }

    if (!res.ok) {
      await supabase
        .from('news_sources')
        .update({ error_count: (source.error_count ?? 0) + 1, last_fetched_at: new Date().toISOString() })
        .eq('id', source.id)
      results.push({ source_id: source.id, inserted_or_updated: 0, skipped: 0, status: `http_${res.status}` })
      continue
    }

    const etag = res.headers.get('etag')
    const lastModified = res.headers.get('last-modified')

    const xml = await res.text()
    const items = extractItems(xml).slice(0, maxItemsPerSource)

    let upserted = 0
    let skipped = 0

    for (const itemXml of items) {
      const title = decodeHtmlEntities(stripHtml(getTagText(itemXml, 'title') ?? '')).trim()
      if (!title) {
        skipped++
        continue
      }

      const canonicalUrlRaw = parseCanonicalUrl(itemXml)
      if (!canonicalUrlRaw) {
        skipped++
        continue
      }

      const canonicalUrl = normalizeUrl(canonicalUrlRaw)
      const urlHash = await sha256Hex(canonicalUrl)

      const summaryRaw =
        getTagText(itemXml, 'description') ??
        getTagText(itemXml, 'summary') ??
        getTagText(itemXml, 'content')
      const summary = summaryRaw ? decodeHtmlEntities(stripHtml(summaryRaw)).slice(0, 1000) : null

      const imageUrl = parseImageUrl(itemXml)
      const publishedAt = parsePublishedAt(itemXml)
      const author =
        getTagText(itemXml, 'author') ??
        getTagText(itemXml, 'dc:creator') ??
        null

      const { error: upsertError } = await supabase
        .from('articles')
        .upsert(
          {
            source_id: source.id,
            title,
            summary,
            image_url: imageUrl,
            canonical_url: canonicalUrl,
            url_hash: urlHash,
            author: author ? stripHtml(author).slice(0, 200) : null,
            published_at: publishedAt,
            category: source.category,
            country: source.country,
            language: source.language,
            raw: { title, canonicalUrl, publishedAt, imageUrl },
          },
          { onConflict: 'url_hash' },
        )

      if (upsertError) {
        skipped++
        continue
      }
      upserted++
    }

    await supabase
      .from('news_sources')
      .update({
        last_fetched_at: new Date().toISOString(),
        etag: etag ?? source.etag,
        last_modified: lastModified ?? source.last_modified,
        error_count: 0,
      })
      .eq('id', source.id)

    results.push({ source_id: source.id, inserted_or_updated: upserted, skipped, status: 'ok' })
  }

  return Response.json({ ok: true, sources: results })
})

