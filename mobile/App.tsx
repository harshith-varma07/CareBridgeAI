import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { store } from './src/store';
import { appTheme } from './src/theme';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={appTheme}>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </PaperProvider>
    </ReduxProvider>
  );
}
