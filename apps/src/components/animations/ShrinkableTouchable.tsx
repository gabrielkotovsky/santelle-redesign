import React, { useRef } from 'react';
import { Animated, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';

interface ShrinkableTouchableProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scale?: number; // How much to shrink (default 0.95)
  duration?: number; // Animation duration in ms (default 100)
}

export const ShrinkableTouchable: React.FC<ShrinkableTouchableProps> = ({
  children,
  style,
  scale = 0.95,
  duration = 100,
  onPressIn,
  onPressOut,
  ...props
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: any) => {
    Animated.timing(scaleAnim, {
      toValue: scale,
      duration: duration,
      useNativeDriver: true,
    }).start();
    
    if (onPressIn) {
      onPressIn(event);
    }
  };

  const handlePressOut = (event: any) => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: true,
    }).start();
    
    if (onPressOut) {
      onPressOut(event);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1} // Disable default opacity animation
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      {...props}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};
