export const Colors = {
  light: {
    pearl: '#FABDD7',
    flow: '#FD9EAA',
    blush: '#EF7D88',
    rush: '#721422',
    dune: '#FFEBCE',
    text: '#000000',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    border: '#E0E0E0',
  },
  dark: {
    pearl: '#FABDD7',
    flow: '#FD9EAA',
    blush: '#EF7D88',
    rush: '#721422',
    dune: '#FFEBCE',
    text: '#FFFFFF',
    background: '#000000',
    surface: '#1A1A1A',
    border: '#333333',
  },
} as const;

export type ColorScheme = 'light' | 'dark';
export type ColorName = keyof typeof Colors.light;
