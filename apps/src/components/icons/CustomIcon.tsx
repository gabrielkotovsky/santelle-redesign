import React from 'react';
import { IconRegistry, RegisteredIconName } from './IconRegistry';
import { CustomIconProps } from './types';

export const CustomIcon: React.FC<CustomIconProps> = ({
  name,
  size = 24,
  color = '#000000',
  weight = 'outline',
  style,
}) => {
  const IconComponent = IconRegistry[name as RegisteredIconName];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      color={color}
      weight={weight}
    />
  );
}; 