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

export async function listArticles(opts: ListOpts = {}): Promise<Article[]> {
  const { limit = 20, offset = 0, category, search, locale = 'en' } = opts;

  let q = supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .eq('locale', locale)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) q = q.eq('category', category);
  if (search) q = q.textSearch('content_md', search, { type: 'websearch' });

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data as Article | null;
}