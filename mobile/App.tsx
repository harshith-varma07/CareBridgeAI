import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { store } from './src/store';
import { appTheme } from './src/theme';

const navigationTheme = {
  dark: false,
  colors: {
    primary: appTheme.colors.primary,
    background: appTheme.colors.background,
    card: appTheme.colors.surface,
    text: appTheme.colors.onSurface,
    border: appTheme.colors.outline,
    notification: appTheme.colors.tertiary
  }
};

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={appTheme}>
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
