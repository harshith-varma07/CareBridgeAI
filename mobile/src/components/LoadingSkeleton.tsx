import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

type LoadingSkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export function LoadingSkeleton({ width = '100%', height = 20, borderRadius = 12, style }: LoadingSkeletonProps) {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius, backgroundColor: theme.colors.surfaceVariant, opacity },
        style,
      ]}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <View style={styles.container}>
      <LoadingSkeleton height={140} borderRadius={28} />
      <View style={styles.row}>
        <LoadingSkeleton height={80} borderRadius={22} width="48%" />
        <LoadingSkeleton height={80} borderRadius={22} width="48%" />
      </View>
      <LoadingSkeleton height={100} borderRadius={24} />
      <LoadingSkeleton height={80} borderRadius={24} />
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {},
  container: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
