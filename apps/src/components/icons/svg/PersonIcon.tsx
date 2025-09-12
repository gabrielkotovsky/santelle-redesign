import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { IconWeight } from '../types';

interface PersonIconProps {
  size?: number;
  color?: string;
  weight?: IconWeight;
}

export const PersonIcon: React.FC<PersonIconProps> = ({ 
  size = 24, 
  color = '#000000', 
  weight = 'outline' 
}) => {
  const strokeWidth = weight === 'filled' ? 0 : 2;
  const fill = weight === 'filled' ? color : 'none';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="12"
        cy="8"
        r="5"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
      />
      <Path
        d="M20 21c0-4.4-3.6-8-8-8s-8 3.6-8 8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 