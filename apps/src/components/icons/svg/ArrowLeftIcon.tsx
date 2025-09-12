import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface ArrowLeftIconProps {
  size?: number;
  color?: string;
}

export const ArrowLeftIcon: React.FC<ArrowLeftIconProps> = ({ 
  size = 24, 
  color = '#721422' 
}) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="m15 18-6-6 6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
};
