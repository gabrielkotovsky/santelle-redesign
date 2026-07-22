import { supabase } from '@/src/services/supabase';
import { GERMAN_ARTICLES } from './german';
import { ITALIAN_ARTICLES } from './italian';

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

function mapRowToArticle(row: Record<string, unknown>, locale: string): Article {
  const r = row as Record<string, unknown> & Article;
  const slug = String(r.slug ?? '');

  if (locale === 'de') {
    const german = GERMAN_ARTICLES[slug];
    if (german) {
      return {
        ...r,
        title: german.title,
        subtitle: german.subtitle,
        content_md: german.content_md,
      };
    }
    // Optional DB columns once migrated in Supabase.
    if (r.title_german != null) {
      return {
        ...r,
        title: (r.title_german as string) ?? r.title,
        subtitle: (r.subtitle_german != null ? r.subtitle_german : r.subtitle) as string | null,
        content_md: (r.content_md_german as string) ?? r.content_md,
      };
    }
  }

  if (locale === 'fr' && r.title_french != null) {
    return {
      ...r,
      title: (r.title_french as string) ?? r.title,
      subtitle: (r.subtitle_french != null ? r.subtitle_french : r.subtitle) as string | null,
      content_md: (r.content_md_french as string) ?? r.content_md,
    };
  }

  if (locale === 'it') {
    const italian = ITALIAN_ARTICLES[slug];
    if (italian) {
      return {
        ...r,
        title: italian.title,
        subtitle: italian.subtitle,
        content_md: italian.content_md,
      };
    }
    // Optional DB columns once migrated in Supabase.
    if (r.title_italian != null) {
      return {
        ...r,
        title: (r.title_italian as string) ?? r.title,
        subtitle: (r.subtitle_italian != null ? r.subtitle_italian : r.subtitle) as string | null,
        content_md: (r.content_md_italian as string) ?? r.content_md,
      };
    }
  }

  return r as Article;
}

export async function listArticles(opts: ListOpts = {}): Promise<Article[]> {
  const { limit = 20, offset = 0, category, search, locale = 'en' } = opts;
  // Localized fields live on canonical English rows (French DB columns /
  // German + Italian app overlays). Always query locale = 'en' for fr/de/it.
  const queryLocale = locale === 'fr' || locale === 'de' || locale === 'it' ? 'en' : locale;

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
  return rows.map((row) => mapRowToArticle(row, locale));
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
  return mapRowToArticle(data as Record<string, unknown>, locale);
}
