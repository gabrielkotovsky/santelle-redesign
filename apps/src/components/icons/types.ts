export interface IconProps {
  size?: number;
  color?: string;
}

export interface CustomIconProps extends IconProps {
  name: IconName;
  weight?: IconWeight;
  style?: any;
}

export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'outline' | 'filled';

export type IconName = 
  | 'analytics'
  | 'apple'
  | 'arrow-left'
  | 'google'
  | 'history'
  | 'house'
  | 'logo-cross'
  | 'logs'
  | 'mail'
  | 's-logo'
  | 'user'
  | 'person'
  | 'x';

