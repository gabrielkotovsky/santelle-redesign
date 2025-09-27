import { useEffect, useState } from 'react';
import { listArticles } from './articles.api';

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

export function useArticles(params?: Parameters<typeof listArticles>[0]) {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    listArticles(params)
      .then(res => { if (alive) setData(res); })
      .catch(e => { if (alive) setError(e); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [JSON.stringify(params)]);

  return { data, loading, error, reload: () => listArticles(params) };
}