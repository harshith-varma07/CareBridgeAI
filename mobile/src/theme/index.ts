import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';

export const appTheme = {
  ...MD3LightTheme,
  dark: false,
  roundness: 12,
  fonts: configureFonts({ config: {} }),
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1E88E5',
    tertiary: '#43A047',
    error: '#E53935'
  }
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#64B5F6'
  }
};
