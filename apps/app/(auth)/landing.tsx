import React from 'react';
import { Alert, Platform, StyleSheet, Text, View, Linking } from 'react-native';
import { router } from 'expo-router';
import AppleSignInButton from '@/src/components/buttons/AppleSignInButton';
import EmailSignInButton from '@/src/components/buttons/EmailSignInButton';
import GoogleSignInButton from '@/src/components/buttons/GoogleSignInButton';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { LanguageDropdown } from '@/src/components/inputs/LanguageDropdown';
import { useAuthStore } from '@/src/features/auth/auth.store';
import { useAuthOnboardingTranslations } from '@/src/features/auth/useAuthOnboardingTranslations';
import {
  getUserNavigationRoute,
  getUser,
  getQuestionnaireEntry,
  createQuestionnaireEntry,
  saveSignUpLanguageToOnboarding,
} from '@/src/features/auth/auth.api';

const TERMS_URL_EN = 'https://santellehealth.com/terms-and-conditions';
const PRIVACY_URL_EN = 'https://santellehealth.com/privacy-policy';
const TERMS_URL_FR = 'https://santellehealth.com/conditions-g%C3%A9n%C3%A9rales';
const PRIVACY_URL_FR = 'https://santellehealth.com/politique-de-confidentialit%C3%A9';

export default function Landing() {
  const signUpLanguage = useAuthStore((s) => s.signUpLanguage);
  const setSignUpLanguage = useAuthStore((s) => s.setSignUpLanguage);
  const appleSignInLoading = useAuthStore((s) => s.appleSignInLoading);
  const googleSignInLoading = useAuthStore((s) => s.googleSignInLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { t, lang } = useAuthOnboardingTranslations();
  const isAuthBusy = appleSignInLoading || googleSignInLoading;
  const [routingAfterAuth, setRoutingAfterAuth] = React.useState(false);

  const termsUrl = lang === 'fr' ? TERMS_URL_FR : TERMS_URL_EN;
  const privacyUrl = lang === 'fr' ? PRIVACY_URL_FR : PRIVACY_URL_EN;

  const handleAuthSuccess = async () => {
    if (routingAfterAuth) return;
    setRoutingAfterAuth(true);
    try {
      const currentUser = await getUser();
      if (currentUser) {
        const questionnaireEntry = await getQuestionnaireEntry(currentUser.id);
        if (!questionnaireEntry) {
          await createQuestionnaireEntry(currentUser.id);
        }
        const storedLanguage = useAuthStore.getState().signUpLanguage;
        await saveSignUpLanguageToOnboarding(currentUser.id, storedLanguage);
      }
    } catch {
      // Continue navigating even if hydration fails; route resolver handles fallbacks.
    }
    const navigationRoute = await getUserNavigationRoute();
    router.replace(navigationRoute as any);
  };

  React.useEffect(() => {
    if (isAuthenticated && !routingAfterAuth) {
      void handleAuthSuccess();
    }
  }, [isAuthenticated, routingAfterAuth]);

  return (
    <ScreenBackground>
        <View style={styles.headerSection}>
            <View style={{ marginTop: 0 }}>
            <LogoCrossIcon 
                size={60}
                color="#721422"
            />
            </View>
            <Text style={styles.title}>{t.welcomeTitle}</Text>
            <Text style={styles.subtitle}></Text>
            <EmailSignInButton
              label={t.continueWithEmail}
              disabled={isAuthBusy}
              onPress={() => {
                router.push('/(auth)/email');
              }}
            />
            <GoogleSignInButton
              label={t.continueWithGoogle}
              loadingLabel={t.signingIn}
              disabled={isAuthBusy}
              onSuccess={handleAuthSuccess}
              onError={(err) => {
                const msg = err?.message || err?.code || '';
                Alert.alert(t.error, t.googleSignInFailed + (msg ? `\n\n${msg}` : ''));
              }}
            />
            {Platform.OS === 'ios' && (
              <AppleSignInButton
                label={t.continueWithApple}
                loadingLabel={t.signingIn}
                disabled={isAuthBusy}
                onSuccess={handleAuthSuccess}
                onError={(err) => {
                  const msg = err?.message || err?.code || '';
                  Alert.alert(t.error, t.appleSignInFailed + (msg ? `\n\n${msg}` : ''));
                }}
              />
            )}
      
        </View>

        <View style={styles.languageToggleSection}>
          <LanguageDropdown value={signUpLanguage} onChange={setSignUpLanguage} />
        </View>

        <View style={styles.disclaimerSection}>
          <Text style={styles.disclaimerText}>
            {t.disclaimerBySigning}
            <Text style={styles.disclaimerLink} onPress={() => Linking.openURL(termsUrl)}>
              {t.termsAndConditions}
            </Text>
            {t.and}
            <Text style={styles.disclaimerLink} onPress={() => Linking.openURL(privacyUrl)}>
              {t.privacyPolicy}
            </Text>
            .
          </Text>
        </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Chunko-Bold',
    marginTop: 10,
    color: '#721422',
  },
  subtitle: {
    fontSize: 16,
    color: '#000000',
  },
  languageToggleSection: {
    paddingHorizontal: 40,
    paddingBottom: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  disclaimerSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    alignItems: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    textAlign: 'center',
    lineHeight: 18,
  },
  disclaimerLink: {
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-SemiBold',
  },
});
