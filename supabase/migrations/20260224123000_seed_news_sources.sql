-- Seed a small, curated set of worldwide RSS sources for MVP.
-- Safe to run multiple times (feed_url is unique).

insert into public.news_sources (name, site_url, feed_url, category, country, language, is_active, poll_interval_minutes)
values
  -- Global / Wire
  ('Reuters - World', 'https://www.reuters.com', 'https://feeds.reuters.com/reuters/worldNews', 'World', null, 'en', true, 10),
  ('Associated Press - Top News', 'https://apnews.com', 'https://apnews.com/apf-topnews?output=rss', 'World', null, 'en', true, 10),

  -- Tech
  ('The Verge', 'https://www.theverge.com', 'https://www.theverge.com/rss/index.xml', 'Technology', 'US', 'en', true, 10),
  ('Ars Technica', 'https://arstechnica.com', 'https://feeds.arstechnica.com/arstechnica/index', 'Technology', 'US', 'en', true, 10),
  ('Hacker News', 'https://news.ycombinator.com', 'https://news.ycombinator.com/rss', 'Technology', null, 'en', true, 10),

  -- Business
  ('Financial Times - World', 'https://www.ft.com', 'https://www.ft.com/world?format=rss', 'Business', 'GB', 'en', true, 10),
  ('Bloomberg - Markets', 'https://www.bloomberg.com', 'https://www.bloomberg.com/feed/podcast/etf-report.xml', 'Business', 'US', 'en', false, 30),

  -- Science / Health
  ('ScienceDaily - Top Science', 'https://www.sciencedaily.com', 'https://www.sciencedaily.com/rss/top/science.xml', 'Science', 'US', 'en', true, 30),
  ('WHO - News', 'https://www.who.int', 'https://www.who.int/rss-feeds/news-english.xml', 'Health', null, 'en', true, 60),

  -- Sports
  ('BBC Sport', 'https://www.bbc.co.uk/sport', 'https://feeds.bbci.co.uk/sport/rss.xml', 'Sports', 'GB', 'en', true, 15),

  -- Entertainment
  ('Rolling Stone', 'https://www.rollingstone.com', 'https://www.rollingstone.com/feed/', 'Entertainment', 'US', 'en', true, 30),

  -- Europe
  ('DW - Top Stories', 'https://www.dw.com', 'https://rss.dw.com/rdf/rss-en-top', 'World', 'DE', 'en', true, 15),
  ('The Guardian - World', 'https://www.theguardian.com', 'https://www.theguardian.com/world/rss', 'World', 'GB', 'en', true, 10),

  -- LatAm
  ('El País - América', 'https://elpais.com', 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/america/portada', 'World', 'ES', 'es', true, 20),

  -- Asia
  ('Al Jazeera - News', 'https://www.aljazeera.com', 'https://www.aljazeera.com/xml/rss/all.xml', 'World', 'QA', 'en', true, 10)
on conflict (feed_url) do update
set
  name = excluded.name,
  site_url = excluded.site_url,
  category = excluded.category,
  country = excluded.country,
  language = excluded.language,
  is_active = excluded.is_active,
  poll_interval_minutes = excluded.poll_interval_minutes,
  updated_at = now();

