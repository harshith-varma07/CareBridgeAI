import React from 'react';
import { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  contentStyle?: ViewStyle;
};

export function Screen({ children, scroll = true, contentStyle }: ScreenProps) {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View pointerEvents="none" style={[styles.glow, styles.glowTop, { backgroundColor: theme.colors.primary }]} />
      <View pointerEvents="none" style={[styles.glow, styles.glowBottom, { backgroundColor: theme.colors.tertiary }]} />
      {scroll ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, contentStyle]}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.staticContent, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16
  },
  staticContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 180,
    opacity: 0.08
  },
  glowTop: {
    top: -72,
    right: -52
  },
  glowBottom: {
    bottom: -90,
    left: -70
  }
});