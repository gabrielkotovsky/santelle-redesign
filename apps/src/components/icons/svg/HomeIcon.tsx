import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconWeight } from '../types';

interface HomeIconProps {
  size?: number;
  color?: string;
  weight?: IconWeight;
}

export const HomeIcon: React.FC<HomeIconProps> = ({ 
  size = 24, 
  color = '#000000', 
  weight = 'outline' 
}) => {
  const strokeWidth = weight === 'filled' ? 0 : 2;
  const fill = weight === 'filled' ? color : 'none';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 