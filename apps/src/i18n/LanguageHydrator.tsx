import { useEffect } from 'react';
import { useAuthStore } from '@/src/features/auth/auth.store';
import { getOnboardingResponse } from '@/src/features/auth/auth.api';

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
        if (!cancelled && data?.language && (data.language === 'en' || data.language === 'fr')) {
          setSignUpLanguage(data.language as 'en' | 'fr');
        }
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id, setSignUpLanguage]);

  return null;
}
