import { Image } from 'expo-image';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

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
                  fontSize: 15,
                  fontFamily: 'Poppins-SemiBold',
                  color: dynamicStyles.contentText.color,
                  marginBottom: -5,
                },
                strong: {
                  fontFamily: 'Poppins-SemiBold',
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    aspectRatio: 4/3,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 15,
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
