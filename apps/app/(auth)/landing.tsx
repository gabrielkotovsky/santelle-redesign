import React from 'react';
import { Alert, Platform, StyleSheet, Text, View, Linking, Pressable } from 'react-native';
import { router } from 'expo-router';
import AppleSignInButton from '@/src/components/buttons/AppleSignInButton';
import EmailSignInButton from '@/src/components/buttons/EmailSignInButton';
import { ScreenBackground } from '@/src/components/layout/ScreenBackground';
import { LogoCrossIcon } from '@/src/components/icons/svg/LogoCrossIcon';
import { useAuthStore } from '@/src/features/auth/auth.store';
import { useAuthOnboardingTranslations } from '@/src/features/auth/useAuthOnboardingTranslations';
import { 
  getUserNavigationRoute,
  getUser,
  getQuestionnaireEntry,
  createQuestionnaireEntry,
  saveSignUpLanguageToOnboarding
} from '@/src/features/auth/auth.api';

const TERMS_URL_EN = 'https://santellehealth.com/terms-and-conditions';
const PRIVACY_URL_EN = 'https://santellehealth.com/privacy-policy';
const TERMS_URL_FR = 'https://santellehealth.com/conditions-g%C3%A9n%C3%A9rales';
const PRIVACY_URL_FR = 'https://santellehealth.com/politique-de-confidentialit%C3%A9';

export default function Landing() {
  const signUpLanguage = useAuthStore((s) => s.signUpLanguage);
  const setSignUpLanguage = useAuthStore((s) => s.setSignUpLanguage);
  const { t, lang } = useAuthOnboardingTranslations();

  const termsUrl = lang === 'fr' ? TERMS_URL_FR : TERMS_URL_EN;
  const privacyUrl = lang === 'fr' ? PRIVACY_URL_FR : PRIVACY_URL_EN;

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
              onPress={() => {
                router.push('/(auth)/email');
              }}
            />
            {Platform.OS === 'ios' && (
              <AppleSignInButton
                label={t.continueWithApple}
                loadingLabel={t.signingIn}
                onSuccess={async () => {
                  setTimeout(async () => {
                    let currentUser = null;
                    try {
                      currentUser = await getUser();
                      if (currentUser) {
                        const questionnaireEntry = await getQuestionnaireEntry(currentUser.id);
                        if (!questionnaireEntry) {
                          await createQuestionnaireEntry(currentUser.id);
                        }
                        const storedLanguage = useAuthStore.getState().signUpLanguage;
                        await saveSignUpLanguageToOnboarding(currentUser.id, storedLanguage);
                      }
                    } catch (error) {
                      // Handle error but continue
                    }
                    const navigationRoute = await getUserNavigationRoute();
                    router.replace(navigationRoute as any);
                  }, 100);
                }}
                onError={() => {
                  Alert.alert(t.error, t.appleSignInFailed);
                }}
              />
            )}
      
        </View>

        <View style={styles.languageToggleSection}>
          <View style={styles.languageToggleGlass}>
            <Pressable
              style={[styles.languageOption, signUpLanguage === 'en' && styles.languageOptionActive]}
              onPress={() => setSignUpLanguage('en')}
            >
              <Text style={[styles.languageOptionText, signUpLanguage === 'en' && styles.languageOptionTextActive]}>
                English
              </Text>
            </Pressable>
            <Pressable
              style={[styles.languageOption, signUpLanguage === 'fr' && styles.languageOptionActive]}
              onPress={() => setSignUpLanguage('fr')}
            >
              <Text style={[styles.languageOptionText, signUpLanguage === 'fr' && styles.languageOptionTextActive]}>
                Français
              </Text>
            </Pressable>
          </View>
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
  languageToggleGlass: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderWidth: 1.5,
    borderColor: 'rgba(114, 20, 34, 0.25)',
    minHeight: 52,
  },
  languageOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageOptionActive: {
    backgroundColor: 'rgba(114, 20, 34, 0.18)',
  },
  languageOptionText: {
    fontSize: 15,
    fontFamily: 'Poppins-Medium',
    color: '#721422',
  },
  languageOptionTextActive: {
    color: '#721422',
    fontFamily: 'Poppins-SemiBold',
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