import MaskedView from '@react-native-masked-view/masked-view';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, usePathname } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CustomIcon } from './icons';
import { Colors } from '../theme/colors';
import { useColorScheme } from 'react-native';

interface NavItem {
  name: string;
  path: string;
  icon: string;
  weight?: 'outline' | 'filled';
}

const navItems: NavItem[] = [
  {
    name: 'Home',
    path: '/(tabs)/home',
    icon: 'home',
    weight: 'filled',
  },
  {
    name: 'Tests',
    path: '/(tabs)/tests',
    icon: 's-logo',
  },
  {
    name: 'Education',
    path: '/(tabs)/education',
    icon: 'history',
  },
  {
    name: 'Insights',
    path: '/(tabs)/insights',
    icon: 'analytics',
  },
];

interface CustomDockNavbarProps {
  state?: any;
  descriptors?: any;
  navigation?: any;
  insets?: any;
}

export function CustomDockNavbar(props: CustomDockNavbarProps) {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const activeColor = Colors.light.rush;
  const inactiveColor = '#B08A9A';
  
  // Animation setup
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  // Calculate icon positions dynamically
  const iconPositions = React.useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    const containerWidth = screenWidth - 32; // Screen width minus left/right margins (16px each)
    const padding = 40; // Total horizontal padding (20px on each side)
    const availableWidth = containerWidth - padding;
    const iconSpacing = availableWidth / 4; // 4 icons with space-around
    
    // Calculate center positions for each icon
    const positions = [-1.5, -0.5, 0.5, 1.5].map(index => {
      const iconCenter = index*iconSpacing;
      const indicatorCenter = iconCenter; // 80 is indicator width, center it on icon
      
      return indicatorCenter;
    });
    
    return positions;
  }, []);

  const handleNavigation = (path: string, index: number) => {
    // Trigger haptic feedback when switching tabs
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate to new position
    Animated.spring(slideAnim, {
      toValue: index,
      useNativeDriver: false,
      tension: 150,
      friction: 100,
    }).start();
    
    setActiveIndex(index);
    router.replace(path as any);
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    blurBackground: {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  });

  return (
    <>
      {/* Extended feathered blur background below navbar */}
      <MaskedView
        style={styles.extendedBlurBackground}
        maskElement={
          <LinearGradient
            colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.featherMask}
          />
        }
      >
        <BlurView
          tint="light"
          intensity={15}
          style={[styles.extendedBlurBackground, {
            backgroundColor: 'rgba(255, 255, 255, 0)',
          }]}
        />
      </MaskedView>
      
      {/* Status bar feathered blur background - iOS only */}
      {Platform.OS === 'ios' && (
        <MaskedView
          style={styles.statusBarBlurBackground}
          maskElement={
            <LinearGradient
              colors={['rgba(255,255,255,1)', 'rgba(255,255,255,1)', 'rgba(255,255,255,.8)', 'rgba(255,255,255,0)']}
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
      
      <View style={[styles.container, dynamicStyles.container]}>
        <BlurView
          tint="light"
          intensity={30}
          style={[styles.blurBackground, dynamicStyles.blurBackground]}
        />
        <View style={styles.navContent}>
        {/* Animated indicator */}
        <Animated.View
          style={[
            styles.animatedIndicator,
            {
              transform: [{
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1, 2, 3],
                  outputRange: iconPositions, // Use calculated positions
                })
              }],
              backgroundColor: colorScheme === 'dark' 
                ? 'rgba(255, 255, 255, 0.15)' 
                : 'rgba(255, 255, 255, 0.4)',
              borderWidth: colorScheme === 'light' ? 1 : 0,
              borderColor: colorScheme === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
            }
          ]}
        />
        {navItems.map((item, index) => {
          // Simplified active state detection
          let isActive = false;
          if (item.path === '/(tabs)') {
            // Home tab - active for root tabs or index
            isActive = pathname === '/';
          } else {
            // Other tabs - check if pathname includes the tab name
            isActive = pathname.includes(item.path.split('/').pop() || '');
          }
          
          // Update active index when pathname changes
          if (isActive && activeIndex !== index) {
            setActiveIndex(index);
            Animated.spring(slideAnim, {
              toValue: index,
              useNativeDriver: false,
              tension: 150,
              friction: 100,
            }).start();
          }
          
          const color = isActive ? activeColor : inactiveColor;
          
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={() => handleNavigation(item.path, index)}
              activeOpacity={0.8}
            >
              <CustomIcon
                name={item.icon as any}
                size={24}
                color={color}
                weight={item.weight}
              />
              <Text style={[styles.navItemText, { color }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    height: 60,
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
  },
  navContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navItemText: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    marginTop: 4,
    textAlign: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    minWidth: 40,
    minHeight: 40,
  },
  activeIconContainer: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  animatedIndicator: {
    position: 'absolute',
    top: 5,
    width: 90,
    height: 50,
    borderRadius: 999,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 1,
  },
  extendedBlurBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  featherMask: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  statusBarBlurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
  },
});
