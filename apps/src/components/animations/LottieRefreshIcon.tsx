import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface LottieRefreshIconProps {
  size?: number;
  isRefreshing?: boolean;
}

export const LottieRefreshIcon: React.FC<LottieRefreshIconProps> = ({
  size = 40,
  isRefreshing = false,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <LottieView
        source={require('@/assets/animations/Loading.json')}
        style={[styles.animation, { width: size, height: size }]}
        autoPlay={isRefreshing}
        loop={isRefreshing}
        speed={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    backgroundColor: 'transparent',
  },
}); 