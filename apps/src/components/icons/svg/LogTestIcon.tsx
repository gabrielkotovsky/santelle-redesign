import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { IconWeight } from '../types';

interface LogTestIconProps {
  size?: number;
  color?: string;
  weight?: IconWeight;
}

export const LogTestIcon: React.FC<LogTestIconProps> = ({ 
  size = 24, 
  color = '#000000', 
  weight = 'outline' 
}) => {
  const strokeWidth = weight === 'filled' ? 0 : 2;
  const fill = weight === 'filled' ? color : 'none';
  
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12 5v14"
        stroke={color}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 