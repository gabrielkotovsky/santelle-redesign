import { supabase } from '@/src/services/supabase';
import type { AppLang } from '@/src/i18n/translations';
import type { PretestChoice, PretestQuestion, UUID } from '../models';

/** Prefer a view that returns questions + JSON choices in one call:
  * view name suggestion: app_pretest_v1_json
  * If you don't have it yet, this stitches client-side.
  * For French locale, uses prompt_french (app_pretest_questions) and label_french (app_pretest_choices).
  */
export async function fetchPretest(version = 1, locale: AppLang = 'en'): Promise<PretestQuestion[]> {
  const isFrench = locale === 'fr';
  const normalizeChoiceLabel = (label: string) => {
    if (!isFrench) return label;
    return label
      .replace(/br[uû]lures?\s+lors\s+de\s+la\s+miction/gi, 'Brûlures en urinant')
      .replace(/br[uû]lures?\s+lors\s+de\s+la\s+uriner/gi, 'Brûlures en urinant')
      .replace(/douleurs?\s+lors\s+de\s+la\s+miction/gi, 'Douleur en urinant');
  };

  // 1) questions (prompt_french used when locale is 'fr')
  const { data: q, error: qErr } = await supabase
    .from('app_pretest_questions')
    .select('*')
    .eq('active', true)
    .eq('version', version)
    .order('sort_order', { ascending: true });

  if (qErr) throw qErr;
  const ids = (q ?? []).map(r => r.id as UUID);
  if (!ids.length) return [];

  // 2) choices (label_french used when locale is 'fr')
  const { data: c, error: cErr } = await supabase
    .from('app_pretest_choices')
    .select('*')
    .in('question_id', ids)
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (cErr) throw cErr;

  // 3) stitch — use prompt_french / label_french for French
  const byQ: Record<UUID, PretestChoice[]> = {};
  (c ?? []).forEach(ch => {
    const qid = ch.question_id as UUID;
    const raw = ch as any;
    const choice: PretestChoice = {
      ...raw,
      label: normalizeChoiceLabel(isFrench && raw.label_french != null ? raw.label_french : raw.label),
    };
    (byQ[qid] ??= []).push(choice);
  });

  const result = (q ?? []).map(row => {
    const raw = row as any;
    const prompt = isFrench && raw.prompt_french != null ? raw.prompt_french : raw.prompt;
    return {
      ...raw,
      prompt,
      choices: byQ[row.id as UUID] ?? [],
    } as PretestQuestion;
  });

  return result;
}
