import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { LogoCrossIcon } from './icons/svg/LogoCrossIcon';

export function SplashScreen() {
  return (
    <ImageBackground
      source={require('../../assets/images/background-mobile.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <LogoCrossIcon size={120} color="#721422" />
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

