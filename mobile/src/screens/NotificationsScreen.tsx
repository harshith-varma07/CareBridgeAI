import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Divider, List, Text } from 'react-native-paper';
import { Screen } from '../components/Screen';

export function NotificationsScreen() {
  return (
    <Screen>
      <Card style={styles.heroCard}>
        <Card.Content style={styles.heroContent}>
          <Text variant="labelLarge" style={styles.kicker}>
            Notifications
          </Text>
          <Text variant="headlineSmall" style={styles.heroTitle}>
            Reminders and alerts in one place.
          </Text>
          <Text style={styles.heroSubtitle}>Stay on top of assessments, escalations, and follow-ups without digging through the inbox.</Text>
        </Card.Content>
      </Card>

      <Card style={styles.listCard}>
        <List.Item
          title="Daily reminder"
          description="Please complete today's recovery assessment."
          left={() => <List.Icon icon="bell-outline" />}
        />
        <Divider />
        <List.Item
          title="Risk alert"
          description="Pain trend increasing for patient Aarav P."
          left={() => <List.Icon icon="alert-outline" />}
        />
        <Divider />
        <List.Item
          title="Care team update"
          description="New photo review note was added to Maya R.'s chart."
          left={() => <List.Icon icon="file-document-outline" />}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 28
  },
  heroContent: {
    gap: 10,
    paddingVertical: 22
  },
  kicker: {
    color: '#1D4ED8',
    letterSpacing: 1.2,
    textTransform: 'uppercase'
  },
  heroTitle: {
    color: '#0F172A',
    fontWeight: '700'
  },
  heroSubtitle: {
    color: '#475569',
    lineHeight: 22
  },
  listCard: {
    borderRadius: 24,
    overflow: 'hidden'
  }
});
