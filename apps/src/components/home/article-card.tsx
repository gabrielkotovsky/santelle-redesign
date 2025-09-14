import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withDelay 
} from 'react-native-reanimated';

interface ArticleCardProps {
  title: string;
  description: string;
  image?: string | number; // Optional image URL (string) or local image (number from require())
  onPress?: () => void;
  delay?: number; // Animation delay in milliseconds
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ 
  title, 
  description, 
  image,
  onPress,
  delay = 0
}) => {
  // Animation values
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, { duration: 600 });
      translateY.value = withTiming(0, { duration: 600 });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress}
        activeOpacity={0.8}
      >
      {/* Image Section */}
      <View style={styles.imageSection}>
        {image ? (
          <Image 
            source={typeof image === 'string' ? { uri: image } : image} 
            style={styles.image}
            contentFit="cover"
            placeholder="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            transition={200}
            cachePolicy="memory-disk"
          />
        ) : (
          <View style={styles.imageBackground} />
        )}
      </View>
      
      {/* Text Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, .8)',
    borderRadius: 40,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 1)',
  },
  imageSection: {
    height: 200,
    backgroundColor: '#FD9EAA', // Pastel pink
  },
  imageBackground: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pastel pink
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  contentSection: {
    padding: 20,
  },
  title: {
    fontSize: 19,
    fontFamily: 'Poppins-SemiBold',
    color: '#721422',
    marginBottom: 0,
    lineHeight: 26,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: '#000000',
    lineHeight: 22,
  },
});
