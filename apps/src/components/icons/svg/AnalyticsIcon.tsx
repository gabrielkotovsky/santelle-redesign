import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconWeight } from '../types';

interface AnalyticsIconProps {
  size?: number;
  color?: string;
  weight?: IconWeight;
}

export const AnalyticsIcon: React.FC<AnalyticsIconProps> = ({ 
  size = 24, 
  color = '#000000', 
  weight = 'outline' 
}) => {
  const strokeWidth = weight === 'filled' ? 0 : 4;
  const fill = weight === 'filled' ? color : 'none';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 20V10"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18 20V4"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6 20V16"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 