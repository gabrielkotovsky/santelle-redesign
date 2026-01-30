import { supabase } from '@/src/services/supabase';

export type Article = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  author: string | null;
  category: string | null;
  tags: string[] | null;
  status: 'draft' | 'published' | 'archived';
  published_at: string | null;        // ISO
  hero_image_url: string | null;
  content_md: string;
  images: unknown[] | null;
  reading_time_minutes: number | null;
  locale: string | null;
  created_at: string;
  updated_at: string;
};

type ListOpts = {
  limit?: number;
  offset?: number;
  category?: string;
  search?: string;
  locale?: string;
};

function mapRowToArticle(row: Record<string, unknown>, useFrench: boolean): Article {
  const r = row as Record<string, unknown> & Article;
  if (useFrench && r.title_french != null) {
    return {
      ...r,
      title: (r.title_french as string) ?? r.title,
      subtitle: (r.subtitle_french != null ? r.subtitle_french : r.subtitle) as string | null,
      content_md: (r.content_md_french as string) ?? r.content_md,
    };
  }
  return r as Article;
}

export async function listArticles(opts: ListOpts = {}): Promise<Article[]> {
  const { limit = 20, offset = 0, category, search, locale = 'en' } = opts;
  const useFrench = locale === 'fr';
  // When displaying French, we still fetch rows by canonical locale ('en'); French text
  // lives in title_french, subtitle_french, content_md_french on those rows.
  const queryLocale = useFrench ? 'en' : locale;

  let q = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .eq('locale', queryLocale)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) q = q.eq('category', category);
  if (search) q = q.textSearch('content_md', search, { type: 'websearch' });

  const { data, error } = await q;
  if (error) throw error;
  const rows = (data ?? []) as Record<string, unknown>[];
  return rows.map((row) => mapRowToArticle(row, useFrench));
}

export async function getArticleBySlug(slug: string, locale: string = 'en'): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapRowToArticle(data as Record<string, unknown>, locale === 'fr');
}