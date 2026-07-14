import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { RiskBadge } from '../components/RiskBadge';
import { Screen } from '../components/Screen';

export function PatientDashboardScreen() {
  return (
    <Screen>
      <Card style={styles.heroCard}>
        <Card.Content style={styles.heroContent}>
          <View style={styles.heroText}>
            <Text variant="labelLarge" style={styles.kicker}>
              Recovery overview
            </Text>
            <Text variant="headlineMedium" style={styles.heroTitle}>
              Day 5 after surgery
            </Text>
            <Text style={styles.heroSubtitle}>Your latest check-in is due. Keep an eye on the wound trend and pain pattern.</Text>
          </View>
          <RiskBadge risk="YELLOW" />
        </Card.Content>
      </Card>

      <View style={styles.metricRow}>
        <Card style={styles.metricCard}>
          <Card.Content>
            <Text style={styles.metricLabel}>Pain</Text>
            <Text variant="headlineSmall">3 / 10</Text>
          </Card.Content>
        </Card>
        <Card style={styles.metricCard}>
          <Card.Content>
            <Text style={styles.metricLabel}>Image</Text>
            <Text variant="headlineSmall">Uploaded</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.infoCard}>
        <Card.Title title="Today’s status" subtitle="Assessment pending" />
        <Card.Content>
          <Text style={styles.bodyText}>Complete your daily check-in to update the AI risk score and share a new wound image.</Text>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Title title="Quick actions" />
        <Card.Content style={styles.actionsRow}>
          <Button mode="contained">Start check-in</Button>
          <Button mode="outlined">View history</Button>
        </Card.Content>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    borderRadius: 28
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 24
  },
  heroText: {
    flex: 1,
    gap: 10
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
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 12
  },
  infoCard: {
    borderRadius: 24
  },
  bodyText: {
    color: '#475569',
    lineHeight: 22
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap'
  }
});
