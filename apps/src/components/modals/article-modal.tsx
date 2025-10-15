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
      backgroundColor: "rgba(255,235,206,0.3)",
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
            contentContainerStyle={[styles.scrollContent, dynamicStyles.modalBackground]}
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
              <View style={{ paddingHorizontal: 30, marginRight: 20 }}>
                <Markdown
                  style={{
                    body: {
                      color: dynamicStyles.contentText.color,
                      flexWrap: 'wrap',
                      marginTop: 0,
                    },
                    paragraph: {
                      fontSize: 15,
                      lineHeight: 26,
                      fontFamily: 'Poppins-Regular',
                      color: dynamicStyles.contentText.color,
                      flexWrap: 'wrap',
                      marginTop: 0,
                    },
                    heading1: {
                      fontSize: 24,
                      lineHeight: 32,
                      fontFamily: 'Poppins-SemiBold',
                      color: dynamicStyles.contentText.color,
                      flexWrap: 'wrap',
                    },
                    heading2: {
                      fontSize: 20,
                      lineHeight: 28,
                      fontFamily: 'Poppins-SemiBold',
                      color: dynamicStyles.contentText.color,
                      flexWrap: 'wrap',
                      marginTop: 20,
                      marginBottom: 10,
                    },
                    heading3: {
                      fontSize: 18,
                      lineHeight: 24,
                      fontFamily: 'Poppins-SemiBold',
                      color: dynamicStyles.contentText.color,
                      flexWrap: 'wrap',
                      marginTop: 20,
                      marginBottom: 10,
                    },
                    strong: {
                      fontFamily: 'Poppins-SemiBold',
                      fontSize: 15,
                      color: dynamicStyles.contentText.color,
                      flexWrap: 'wrap',
                    },
                    em: {
                      fontStyle: 'italic',
                      fontSize: 15,
                      color: dynamicStyles.contentText.color,
                      flexWrap: 'wrap',
                    },
                    list_item: {
                      color: dynamicStyles.contentText.color,
                      fontSize: 15,
                      lineHeight: 26,
                      fontFamily: 'Poppins-Regular',
                      flexWrap: 'wrap',
                      flex: 1,
                      marginLeft: 0,
                    },
                    bullet_list: {
                      marginLeft: -5,
                      marginBottom: 10,
                      marginTop: 0,
                    },
                    bullet_list_icon: {
                      fontSize: 30,
                      color: dynamicStyles.contentText.color,
                      marginTop: 7.5,
                      marginRight: 4,
                    },
                    ordered_list: {
                    },
                    ordered_list_icon: {
                      fontSize: 15,
                      color: dynamicStyles.contentText.color,
                    },
                  }}
                >
                  {content}
                </Markdown>
              </View>
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
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  content: {
    fontSize: 15,
    lineHeight: 26,
    fontFamily: 'Poppins-Regular',
    textAlign: 'left',
  },
});
