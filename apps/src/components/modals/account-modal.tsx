import React from 'react';
import { 
  Modal, 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  Alert,
  ScrollView 
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../theme/colors';
import { LogoCrossIcon } from '../icons/svg/LogoCrossIcon';
import { UserIcon } from '../icons/svg/UserIcon';
import { MailIcon } from '../icons/svg/MailIcon';
import { ShrinkableTouchable } from '../animations/ShrinkableTouchable';
import { useAuth } from '../../features/auth/auth.store';

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AccountModal({ visible, onClose }: AccountModalProps) {
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      Alert.alert(
        'Sign Out',
        'Are you sure you want to sign out?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign Out',
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                onClose();
                // Navigate to auth landing page
                router.replace('/(auth)/landing');
              } catch (error: any) {
                Alert.alert('Error', 'Failed to sign out. Please try again.');
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
              <Text style={styles.headerTitle}>Account</Text>
              <Pressable
                style={styles.closeButton}
                onPress={handleClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* User Info Section */}
              <View style={styles.section}>
                <View style={styles.userInfoCard}>
                  <View style={styles.userIconContainer}>
                    <UserIcon size={32} color={Colors.light.rush} />
                  </View>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>
                      {user?.user_metadata?.full_name || user?.email || 'User'}
                    </Text>
                    <View style={styles.emailContainer}>
                      <MailIcon size={16} color={Colors.light.rush} />
                      <Text style={styles.userEmail}>
                        {user?.email || 'No email'}
                      </Text>
                    </View>
                    <Text style={styles.memberSince}>
                      Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Account Actions Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                
                <ShrinkableTouchable
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Coming Soon', 'Profile editing will be available soon!');
                  }}
                >
                  <Text style={styles.actionButtonText}>Edit Profile</Text>
                  <Text style={styles.actionButtonArrow}>›</Text>
                </ShrinkableTouchable>

                <ShrinkableTouchable
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Coming Soon', 'Notification settings will be available soon!');
                  }}
                >
                  <Text style={styles.actionButtonText}>Notifications</Text>
                  <Text style={styles.actionButtonArrow}>›</Text>
                </ShrinkableTouchable>

                <ShrinkableTouchable
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Coming Soon', 'Privacy settings will be available soon!');
                  }}
                >
                  <Text style={styles.actionButtonText}>Privacy & Security</Text>
                  <Text style={styles.actionButtonArrow}>›</Text>
                </ShrinkableTouchable>
              </View>

              {/* Support Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                
                <ShrinkableTouchable
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Coming Soon', 'Help center will be available soon!');
                  }}
                >
                  <Text style={styles.actionButtonText}>Help Center</Text>
                  <Text style={styles.actionButtonArrow}>›</Text>
                </ShrinkableTouchable>

                <ShrinkableTouchable
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Coming Soon', 'Contact support will be available soon!');
                  }}
                >
                  <Text style={styles.actionButtonText}>Contact Support</Text>
                  <Text style={styles.actionButtonArrow}>›</Text>
                </ShrinkableTouchable>
              </View>

              {/* App Info Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                
                <ShrinkableTouchable
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Coming Soon', 'Terms of service will be available soon!');
                  }}
                >
                  <Text style={styles.actionButtonText}>Terms of Service</Text>
                  <Text style={styles.actionButtonArrow}>›</Text>
                </ShrinkableTouchable>

                <ShrinkableTouchable
                  style={styles.actionButton}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    Alert.alert('Coming Soon', 'Privacy policy will be available soon!');
                  }}
                >
                  <Text style={styles.actionButtonText}>Privacy Policy</Text>
                  <Text style={styles.actionButtonArrow}>›</Text>
                </ShrinkableTouchable>

                <View style={styles.versionInfo}>
                  <Text style={styles.versionText}>Version 1.0.0</Text>
                </View>
              </View>

              {/* Sign Out Button */}
              <View style={styles.signOutSection}>
                <ShrinkableTouchable
                  style={[styles.signOutButton, loading && styles.signOutButtonDisabled]}
                  onPress={handleSignOut}
                  disabled={loading}
                >
                  <Text style={[styles.signOutButtonText, loading && styles.signOutButtonTextDisabled]}>
                    {loading ? 'Signing Out...' : 'Sign Out'}
                  </Text>
                </ShrinkableTouchable>
              </View>
            </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    marginBottom: 12,
  },
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(114, 20, 34, 0.05)',
    borderRadius: 12,
    padding: 16,
  },
  userIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(114, 20, 34, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: Colors.light.rush,
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    marginLeft: 6,
    opacity: 0.8,
  },
  memberSince: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    opacity: 0.6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(114, 20, 34, 0.1)',
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
  },
  actionButtonArrow: {
    fontSize: 18,
    color: Colors.light.rush,
    opacity: 0.5,
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: Colors.light.rush,
    opacity: 0.5,
  },
  signOutSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(114, 20, 34, 0.1)',
  },
  signOutButton: {
    backgroundColor: Colors.light.rush,
    borderRadius: 12,
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
