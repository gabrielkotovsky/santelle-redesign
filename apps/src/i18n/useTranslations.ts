import { useMemo } from 'react';
import { useAuthStore } from '@/src/features/auth/auth.store';
import { getAppT, type AppT, type AppLang } from './translations';

/**
 * App-wide translations. Use in any screen/component.
 * Language comes from auth store (signUpLanguage), hydrated from onboarding_responses when user is logged in.
 */
export function useTranslations(): { t: AppT; lang: AppLang } {
  const signUpLanguage = useAuthStore((s) => s.signUpLanguage);
  const contentLanguage: AppLang = signUpLanguage === 'it' ? 'en' : signUpLanguage;

  return useMemo(
    () => ({ t: getAppT(contentLanguage), lang: contentLanguage }),
    [contentLanguage]
  );
}
