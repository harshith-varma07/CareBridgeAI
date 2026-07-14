import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';

export const appTheme = {
  ...MD3LightTheme,
  dark: false,
  roundness: 18,
  fonts: configureFonts({ config: {} }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1D4ED8',
    primaryContainer: '#DBEAFE',
    secondary: '#0F766E',
    secondaryContainer: '#CCFBF1',
    tertiary: '#F59E0B',
    tertiaryContainer: '#FEF3C7',
    background: '#F4F7FB',
    surface: '#FFFFFF',
    surfaceVariant: '#E7EEF8',
    outline: '#C7D2E0',
    onSurface: '#0F172A',
    onSurfaceVariant: '#475569',
    error: '#DC2626'
  }
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#93C5FD',
    secondary: '#5EEAD4',
    tertiary: '#FCD34D'
  }
};
