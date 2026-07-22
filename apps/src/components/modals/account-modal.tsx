import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { LogoCrossIcon } from '../icons/svg/LogoCrossIcon';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';
import { LanguageDropdown } from '../inputs/LanguageDropdown';
import { useAuth } from '../../features/auth/auth.store';
import { useAuthStore, type SignUpLanguage } from '../../features/auth/auth.store';
import { saveSignUpLanguageToOnboarding } from '../../features/auth/auth.api';
import { useTranslations } from '@/src/i18n/useTranslations';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AccountModal({ visible, onClose }: AccountModalProps) {
  const { t } = useTranslations();
  const { user, signOut, loading } = useAuth();
  const signUpLanguage = useAuthStore((s) => s.signUpLanguage);
  const setSignUpLanguage = useAuthStore((s) => s.setSignUpLanguage);

  const handleLanguageSelect = async (newLang: SignUpLanguage) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSignUpLanguage(newLang);
    if (user?.id) {
      try {
        await saveSignUpLanguageToOnboarding(user.id, newLang);
      } catch (error) {
        // Store is already updated; app language works. Supabase update failed silently.
      }
    }
  };

  const handleSignOut = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      Alert.alert(
        t.signOutConfirmTitle,
        t.signOutConfirmMessage,
        [
          {
            text: t.cancel,
            style: 'cancel',
          },
          {
            text: t.signOut,
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                onClose();
                router.replace('/(auth)/landing');
              } catch (error: any) {
                Alert.alert(t.errorTitle, t.signOutFailed);
              }
            },
          },
        ]
      );
    } catch (error) {
      // Handle sign out error silently
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <LogoCrossIcon size={24} color={Colors.light.rush} />
          </View>
          <Text style={styles.headerTitle}>{t.accountTitle}</Text>
          <Pressable
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* Language selector */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.languageLabel}</Text>
            <LanguageDropdown value={signUpLanguage} onChange={handleLanguageSelect} />
          </View>

          {/* Sign Out Button */}
          <View style={styles.signOutSection}>
            <ShrinkableTouchable
              style={StyleSheet.flatten([
                styles.signOutButton,
                loading && styles.signOutButtonDisabled,
              ])}
              onPress={handleSignOut}
              disabled={loading}
            >
              <Text
                style={[
                  styles.signOutButtonText,
                  loading && styles.signOutButtonTextDisabled,
                ].filter(Boolean)}
              >
                {loading ? t.signingOut : t.signOut}
              </Text>
            </ShrinkableTouchable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 235, 206, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(114, 20, 34, 0.1)',
  },
  logoContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Chunko-Bold',
    color: Colors.light.rush,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  closeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: Colors.light.rush,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    marginBottom: 12,
  },
  signOutSection: {
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(114, 20, 34, 0.1)',
  },
  signOutButton: {
    backgroundColor: Colors.light.rush,
    borderRadius: 99,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutButtonDisabled: {
    backgroundColor: 'rgba(114, 20, 34, 0.5)',
  },
  signOutButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFFFFF',
  },
  signOutButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
