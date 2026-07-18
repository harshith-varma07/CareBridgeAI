import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';

type EmptyStateProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
};

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={56} color={theme.colors.outline} />
      <Text variant="titleMedium" style={[styles.title, { color: theme.colors.onSurface }]}>
        {title}
      </Text>
      <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
        {description}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  title: {
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 260,
  },
});
