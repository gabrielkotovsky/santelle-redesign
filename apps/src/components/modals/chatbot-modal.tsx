// src/components/modals/chatbot-modal.tsx
import { BlurView } from 'expo-blur';
import MaskedView from '@react-native-masked-view/masked-view';
import React, { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { XIcon } from '../icons/svg/XIcon';
import { SLogoIcon } from '../icons/svg/SLogoIcon';

type Props = {
  visible: boolean;
  onClose: () => void;
  log?: {
    id: string;
    ph: number | null;
    h2o2: string | null;
    le: string | null;
    sna: string | null;
    beta_g: string | null;
    nag: string | null;
    created_at?: string;
  } | null;
};

const PRESET_PROMPTS = [
  {
    text: 'What do my results mean?',
    colors: ['#A1E3D8', '#D8C8F1', '#F9F9FF'],
    borderColor: 'rgba(161, 227, 216, 0.75)',
  },
  {
    text: 'What factors can influence my results?',
    colors: ['#FBE5A2', '#F8B6A2', '#D8B9E5'],
    borderColor: 'rgba(216, 185, 229, 0.7)',
  },
  {
    text: 'Holistic tips for comfort',
    colors: ['#A6C48A', '#F3C6B8', '#FFF9EE'],
    borderColor: 'rgba(166, 196, 138, 0.7)',
  },
  {
    text: 'Trend analysis',
    colors: ['#9FD7F9', '#F9D4B4', '#E4E3F5'],
    borderColor: 'rgba(159, 215, 249, 0.7)',
  },
  {
    text: 'I need reassurance',
    colors: ['#C9D8FC', '#F6C9C0', '#FFF5F2'],
    borderColor: 'rgba(201, 216, 252, 0.7)',
  },
];

export default function ChatbotModal({ visible, onClose, log }: Props) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ id: string; text: string; role: 'user' | 'assistant' }>>([]);
  const scrollViewRef = useRef<ScrollView | null>(null);
  const [confirmingClose, setConfirmingClose] = useState(false);

  const handlePromptPress = (prompt: string) => {
    setMessage(prompt);
    requestAnimationFrame(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    });
  };

  const handleSend = () => {
    // No functionality yet - just clear the input
    if (message.trim()) {
      const trimmed = message.trim();
      const newMessage = {
        id: `${Date.now()}`,
        text: trimmed,
        role: 'user' as const,
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
      requestAnimationFrame(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
    }
  };

  const handleClosePress = () => {
    if (!messages.length || confirmingClose) {
      onClose();
      return;
    }

    setConfirmingClose(true);
    Alert.alert(
      'End Chat?',
      'Are you sure you want to end this chat session?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setConfirmingClose(false),
        },
        {
          text: 'End Chat',
          style: 'destructive',
          onPress: () => {
            setConfirmingClose(false);
            setMessages([]);
            setMessage('');
            onClose();
          },
        },
      ],
    );
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      presentationStyle="pageSheet"
      onRequestClose={handleClosePress}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Status bar feathered blur background - iOS only */}
        {Platform.OS === 'ios' && (
          <MaskedView
            style={styles.statusBarBlurBackground}
            maskElement={
              <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)','rgba(255,255,255,0)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.featherMask}
              />
            }
          >
            <BlurView
              tint="light"
              intensity={50}
              style={[styles.statusBarBlurBackground, {
                backgroundColor: 'rgba(255, 255, 255, 0)',
              }]}
            />
          </MaskedView>
        )}

        {/* Bottom feathered blur background - iOS only */}
        {Platform.OS === 'ios' && (
          <MaskedView
            style={styles.bottomBlurBackground}
            maskElement={
              <LinearGradient
                colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.8)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.featherMask}
              />
            }
          >
            <BlurView
              tint="light"
              intensity={50}
              style={[styles.bottomBlurBackground, {
                backgroundColor: 'rgba(255, 255, 255, 0)',
              }]}
            />
          </MaskedView>
        )}

        {/* Header Content */}
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <Text style={styles.titleText}>Chat</Text>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleClosePress} style={styles.cancelButton}>
              <XIcon size={30} color={'#721422'} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Messages Area */}
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.promptButtonsSection}>
            <View style={styles.promptButtonsContainer}>
              {PRESET_PROMPTS.map(({ text, colors, borderColor }) => (
                <TouchableOpacity
                  key={text}
                  onPress={() => handlePromptPress(text)}
                  style={styles.promptButtonTouchable}
                  activeOpacity={0.85}
                >
                  <LinearGradient
                    colors={colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.promptButton, { borderColor }]}
                  >
                    <Text style={styles.promptButtonText}>{text}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}></Text>
            </View>
          ) : (
            messages.map(item => (
              <View
                key={item.id}
                style={[
                  styles.messageBubble,
                  item.role === 'user' ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    item.role === 'user' ? styles.userText : styles.assistantText,
                  ]}
                >
                  {item.text}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Chatbox - Fixed at bottom */}
        <BlurView 
          tint="light"
          intensity={40}
          style={styles.chatbox}
        >
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#999999"
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <SLogoIcon 
              size={20} 
              color={message.trim() ? '#FFFFFF' : '#999999'} 
            />
          </TouchableOpacity>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: 'rgb(240, 240, 240)',
  },
  statusBarBlurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    zIndex: 1000,
  },
  bottomBlurBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1000,
  },
  featherMask: {
    flex: 1,
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 30,
    height: 100,
    zIndex: 1001,
  },
  headerLeft: {
    flex: 1,
  },
  titleText: {
    fontFamily: 'Chunko-Bold',
    color: '#721422',
    fontSize: 25,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  cancelButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -5,
  },
  messagesContainer: {
    padding: 20,
    paddingTop: 100,
    paddingBottom: 120,
    flexGrow: 1,
  },
  promptButtonsSection: {
    marginBottom: 24,
  },
  promptSectionTitle: {
    fontSize: 16,
    fontFamily: 'Chunko-Bold',
    color: '#721422',
    marginBottom: 12,
  },
  promptButtonsContainer: {
    flexDirection: 'column',
  },
  promptButtonTouchable: {
    width: '100%',
    marginBottom: 12,
  },
  promptButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
    shadowColor: '#721422',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(114, 20, 34, 0.15)',
  },
  promptButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#721422',
    lineHeight: 18,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#999999',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(253, 158, 171, 0.2)',
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderTopLeftRadius: 4,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  userText: {
    color: 'rgb(126, 77, 84)',
  },
  assistantText: {
    color: '#1F2933',
  },
  chatbox: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: Platform.OS === 'ios' ? 30 : 10,
    zIndex: 1002,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 27,
    borderWidth: .5,
    borderColor: 'rgba(255, 255, 255, 1)',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 50,
    maxHeight: 120,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    marginLeft: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#721422',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#721422',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  sendButtonDisabled: {
    backgroundColor: '#E9ECEF',
  },
});

