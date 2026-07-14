import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { RiskBadge } from '../components/RiskBadge';
import { Screen } from '../components/Screen';

export function HistoryScreen() {
  return (
    <Screen>
      <Card style={styles.heroCard}>
        <Card.Content style={styles.heroContent}>
          <Text variant="labelLarge" style={styles.kicker}>
            Recovery history
          </Text>
          <Text variant="headlineSmall" style={styles.heroTitle}>
            View the pattern behind each check-in.
          </Text>
          <Text style={styles.heroSubtitle}>Tap any entry to inspect symptoms, image trends, and the AI explanation behind the risk score.</Text>
        </Card.Content>
      </Card>

      {[
        { day: 'Day 3', risk: 'GREEN' as const, note: 'Healing trend remained stable.' },
        { day: 'Day 4', risk: 'YELLOW' as const, note: 'Pain increased slightly overnight.' }
      ].map((item) => (
        <Card key={item.day} style={styles.entryCard}>
          <Card.Content style={styles.entryContent}>
            <RiskBadge risk={item.risk} />
            <Text variant="titleMedium">{item.day}</Text>
            <Text style={styles.entryText}>{item.note}</Text>
            <Button mode="text" compact>
              Open details
            </Button>
          </Card.Content>
        </Card>
      ))}
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
  entryCard: {
    borderRadius: 24
  },
  entryContent: {
    gap: 10,
    paddingVertical: 18
  },
  entryText: {
    color: '#475569',
    lineHeight: 20
  }
});
