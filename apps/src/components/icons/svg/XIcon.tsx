import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface XIconProps {
  size?: number;
  color?: string;
}

export function XIcon({ size = 24, color = 'currentColor' }: XIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 6 6 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="m6 6 12 12"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
