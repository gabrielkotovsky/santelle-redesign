import { useEffect } from 'react';
import { useAuthStore, type SignUpLanguage } from '@/src/features/auth/auth.store';
import { getOnboardingResponse } from '@/src/features/auth/auth.api';

const SUPPORTED_LANGUAGES: SignUpLanguage[] = ['en', 'fr', 'de', 'it'];

/**
 * When user is logged in, hydrates signUpLanguage from onboarding_responses.language
 * so the app shows their saved language preference.
 */
export function LanguageHydrator() {
  const user = useAuthStore((s) => s.user);
  const setSignUpLanguage = useAuthStore((s) => s.setSignUpLanguage);

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getOnboardingResponse(user.id);
        if (
          !cancelled &&
          data?.language &&
          SUPPORTED_LANGUAGES.includes(data.language as SignUpLanguage)
        ) {
          setSignUpLanguage(data.language as SignUpLanguage);
        }
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, setSignUpLanguage]);

  return null;
}
