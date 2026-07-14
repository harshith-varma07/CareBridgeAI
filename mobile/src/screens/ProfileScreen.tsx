import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logout } from '../store';
import { Screen } from '../components/Screen';

export function ProfileScreen() {
  const dispatch = useDispatch();

  return (
    <Screen scroll={false}>
      <View style={styles.wrapper}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text size={72} label="DU" style={styles.avatar} />
            <View style={styles.profileText}>
              <Text variant="headlineSmall" style={styles.name}>
                Demo User
              </Text>
              <Text style={styles.meta}>Hospital ID: HSP-1001</Text>
              <Text style={styles.meta}>Role: Patient</Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.metricRow}>
          <Card style={styles.metricCard}>
            <Card.Content>
              <Text style={styles.metricLabel}>Recovery</Text>
              <Text variant="headlineSmall">On track</Text>
            </Card.Content>
          </Card>
          <Card style={styles.metricCard}>
            <Card.Content>
              <Text style={styles.metricLabel}>Tasks</Text>
              <Text variant="headlineSmall">2 open</Text>
            </Card.Content>
          </Card>
        </View>

        <Button mode="outlined" icon="logout" onPress={() => dispatch(logout())}>
          Sign out
        </Button>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    gap: 16
  },
  profileCard: {
    borderRadius: 28
  },
  profileContent: {
    alignItems: 'center',
    gap: 16,
    paddingVertical: 24
  },
  avatar: {
    backgroundColor: '#1D4ED8'
  },
  profileText: {
    alignItems: 'center',
    gap: 4
  },
  name: {
    color: '#0F172A',
    fontWeight: '700'
  },
  meta: {
    color: '#475569'
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12
  },
  metricCard: {
    flex: 1,
    borderRadius: 22
  },
  metricLabel: {
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 12,
    marginBottom: 8
  }
});
