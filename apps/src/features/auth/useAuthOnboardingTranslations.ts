/**
 * Returns app-wide translations. Use in any screen; language is driven by signUpLanguage (auth + onboarding).
 * Re-exported from i18n for backward compatibility; auth/onboarding screens use the same t with full key set.
 */
export { useTranslations as useAuthOnboardingTranslations } from '@/src/i18n/useTranslations';
