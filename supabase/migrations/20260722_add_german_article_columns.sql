-- Add German localization columns for articles (mirrors French pattern).
-- Run this in the Supabase SQL editor, then load German copy from the app
-- file apps/src/features/articles/german.ts (or a follow-up UPDATE script).

alter table public.articles
  add column if not exists title_german text,
  add column if not exists subtitle_german text,
  add column if not exists content_md_german text;
