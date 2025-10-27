import { supabase } from '@/src/services/supabase';
import type { PretestChoice, PretestQuestion, UUID } from '../models';

/** Prefer a view that returns questions + JSON choices in one call:
  * view name suggestion: app_pretest_v1_json
  * If you don't have it yet, this stitches client-side.
  */
export async function fetchPretest(version = 1): Promise<PretestQuestion[]> {
  // 1) questions
  const { data: q, error: qErr } = await supabase
    .from('app_pretest_questions')
    .select('*')
    .eq('active', true)
    .eq('version', version)
    .order('sort_order', { ascending: true });

  if (qErr) throw qErr;
  const ids = (q ?? []).map(r => r.id as UUID);
  if (!ids.length) return [];

  // 2) choices
  const { data: c, error: cErr } = await supabase
    .from('app_pretest_choices')
    .select('*')
    .in('question_id', ids)
    .eq('active', true)
    .order('sort_order', { ascending: true });

  if (cErr) throw cErr;

  // 3) stitch
  const byQ: Record<UUID, PretestChoice[]> = {};
  (c ?? []).forEach(ch => {
    const qid = ch.question_id as UUID;
    (byQ[qid] ??= []).push(ch as unknown as PretestChoice);
  });

  const result = (q ?? []).map(row => ({
    ...(row as any),
    choices: byQ[row.id as UUID] ?? [],
  })) as PretestQuestion[];
  
  return result;
}
