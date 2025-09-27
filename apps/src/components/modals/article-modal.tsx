import { Image } from 'expo-image';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { XIcon } from '../icons/svg/XIcon';
import { Colors } from '../../theme/colors';

interface ArticleModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
  image?: string | number; // Optional image URL (string) or local image (number from require())
  author?: string;
  publishDate?: string;
  category?: string;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  visible,
  onClose,
  title,
  content,
  image,
}) => {

  const dynamicStyles = StyleSheet.create({
    modalBackground: {
      backgroundColor: "#FFFFFF",
    },
    headerText: {
      color: '#000000',
    },
    contentText: {
      color: '#000000',
    },
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
      >
        <View style={styles.container}>
          {/* Floating Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <View style={styles.closeButtonCircle}>
              <XIcon size={30} color="#000000" />
            </View>
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Article Image */}
            {image && (
              <View style={styles.imageContainer}>
                <Image 
                  source={typeof image === 'string' ? { uri: image } : image} 
                  style={styles.articleImage}
                  contentFit="cover"
                  placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                  transition={200}
                  cachePolicy="memory-disk"
                />
              </View>
            )}

              {/* Title */}
              <Text style={{
                ...styles.title,
                color: dynamicStyles.headerText.color
              }}>
                {title}
              </Text>

              {/* Article Content */}
              <Markdown style={{
                body: {
                  ...styles.content,
                  color: dynamicStyles.contentText.color,
                },
                heading3: {
                  fontSize: 16,
                  fontFamily: 'Poppins-SemiBold',
                  color: dynamicStyles.contentText.color,
                  marginBottom: 0,
                },
                heading2: {
                  fontSize: 20,
                  fontFamily: 'Poppins-SemiBold',
                  color: dynamicStyles.contentText.color,
                  marginBottom: 0,
                },
                heading1: {
                  fontSize: 24,
                  fontFamily: 'Poppins-SemiBold',
                  color: dynamicStyles.contentText.color,
                  marginBottom: 0,
                },
                strong: {
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: 14,
                  color: dynamicStyles.contentText.color,
                },
                em: {
                  fontStyle: 'italic',
                  color: dynamicStyles.contentText.color,
                },
                paragraph: {
                  marginBottom: 20,
                  color: dynamicStyles.contentText.color,
                },
                list_item: {
                  color: dynamicStyles.contentText.color,
                },
                bullet_list: {
                  marginBottom: 10,
                },
                ordered_list: {
                  marginBottom: 10,
                },
              }}>
                {content}
              </Markdown>
          </ScrollView>
        </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
  },
  closeButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginLeft: 0,
  },
  blurOverlay: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
    backgroundColor: 'rgb(255, 255, 255)',
  },
  imageContainer: {
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: 'rgb(76, 47, 126)',
  },
  articleImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.5,
  },
  title: {
    fontSize: 26,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  content: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
    paddingHorizontal: 30,
  },
});
