import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconWeight } from '../types';

interface HistoryIconProps {
  size?: number;
  color?: string;
  weight?: IconWeight;
}

export const HistoryIcon: React.FC<HistoryIconProps> = ({ 
  size = 24, 
  color = '#000000', 
  weight = 'outline' 
}) => {
  const strokeWidth = weight === 'filled' ? 0 : 3;
  const fill = weight === 'filled' ? color : 'none';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 12h8"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 18h8"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13 6h8"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 12h1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 18h1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M3 6h1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 12h1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 18h1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8 6h1"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 