import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { FullLogoIcon } from './icons/svg/FullLogoIcon';

export function SplashScreen() {
  return (
    <ImageBackground
      source={require('../../assets/images/background-mobile.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <FullLogoIcon width={280} color="#721422" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

