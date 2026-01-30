import { useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/src/features/auth/auth.store';
import { fetchPretest } from '../api/fetchPretest';
import { submitPretestAnswers, saveIndividualAnswer } from '../api/submitPretest';
import type { PretestAnswer, PretestQuestion, UUID } from '../models';

export function usePretest(version = 1) {
  const locale = useAuthStore((s) => s.signUpLanguage ?? 'en');
  const [questions, setQuestions] = useState<PretestQuestion[]>([]);
  const [answers, setAnswers] = useState<PretestAnswer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const key = `pretest:v${version}:${locale}`;
      
      try {
        // Try to load cached questions first (per locale)
        const cached = await AsyncStorage.getItem(key);
        if (cached && mounted) {
          setQuestions(JSON.parse(cached));
        }

        // Fetch fresh questions (uses prompt_french / label_french when locale is 'fr')
        const fresh = await fetchPretest(version, locale);
        if (mounted) {
          setQuestions(fresh);
          await AsyncStorage.setItem(key, JSON.stringify(fresh));
        }
      } catch (error) {
        // Silently handle error
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [version, locale]);

  const setSingle = (qId: UUID, choiceId: UUID) =>
    setAnswers(prev => {
      const without = prev.filter(a => a.question_id !== qId);
      return [...without, { question_id: qId, type: 'single', choice_id: choiceId }];
    });

  const setMulti = (qId: UUID, choiceIds: UUID[]) =>
    setAnswers(prev => {
      const without = prev.filter(a => a.question_id !== qId);
      return [...without, { question_id: qId, type: 'multi' as const, choice_ids: choiceIds }];
    });

  const toggleMulti = (qId: UUID, choiceId: UUID) =>
    setAnswers(prev => {
      const existing = prev.find(a => a.question_id === qId && a.type === 'multi');
      if (!existing) return [...prev, { question_id: qId, type: 'multi' as const, choice_ids: [choiceId] }];
      if (existing.type === 'multi') {
        const set = new Set(existing.choice_ids);
        set.has(choiceId) ? set.delete(choiceId) : set.add(choiceId);
        return prev.map(a => (a === existing ? { ...existing, choice_ids: Array.from(set) } : a));
      }
      return prev;
    });

  const canSubmit = useMemo(() => {
    const req = questions.filter(q => q.required);
    return req.every(q => answers.some(a => a.question_id === q.id));
  }, [questions, answers]);

  const submit = (test_session_id: UUID) =>
    submitPretestAnswers({ test_session_id, answers });

  const saveAnswer = async (test_session_id: UUID, answer: PretestAnswer) => {
    try {
      await saveIndividualAnswer({ test_session_id, answer, version });
    } catch (error) {
      throw error;
    }
  };

  return { questions, answers, loading, canSubmit, setSingle, setMulti, toggleMulti, submit, saveAnswer };
}
