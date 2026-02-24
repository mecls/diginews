import { supabase } from '@/src/lib/supabase'

export type Article = {
  id: string
  title: string
  summary: string | null
  image_url: string | null
  canonical_url: string
  published_at: string | null
  category: string | null
  country: string | null
  language: string | null
  source_id: string
  source_name?: string | null
}

export function sourceNameFromEmbeddedNewsSources(newsSources: unknown): string | null {
  if (!newsSources) return null
  if (Array.isArray(newsSources)) {
    const first = newsSources[0] as any
    return (first?.name as string) ?? null
  }
  return ((newsSources as any)?.name as string) ?? null
}

export async function listArticles(params: {
  category?: string | null
  limit?: number
  offset?: number
}) {
  const limit = params.limit ?? 30
  const offset = params.offset ?? 0

  let q = supabase
    .from('articles')
    .select('id,title,summary,image_url,canonical_url,published_at,category,country,language,source_id, news_sources(name)')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (params.category && params.category !== 'All') {
    q = q.eq('category', params.category)
  }

  return await q
}

export async function listBookmarks(params: { userId: string; limit?: number; offset?: number }) {
  const limit = params.limit ?? 50
  const offset = params.offset ?? 0

  return await supabase
    .from('bookmarks')
    .select('created_at, articles:article_id (id,title,summary,image_url,canonical_url,published_at,category,country,language,source_id, news_sources(name))')
    .eq('user_id', params.userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
}

export async function addBookmark(params: { userId: string; articleId: string }) {
  return await supabase.from('bookmarks').insert({ user_id: params.userId, article_id: params.articleId })
}

export async function removeBookmark(params: { userId: string; articleId: string }) {
  return await supabase.from('bookmarks').delete().eq('user_id', params.userId).eq('article_id', params.articleId)
}

