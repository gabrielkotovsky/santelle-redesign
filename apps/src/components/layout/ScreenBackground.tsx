import { PropsWithChildren } from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export function ScreenBackground({ children }: PropsWithChildren) {
  return (
    <ImageBackground
      source={require('../../../assets/images/background-mobile.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <BlurView intensity={50} tint="light" style={styles.blurOverlay}>
        {children}
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  blurOverlay: {
    flex: 1,
  },
});
