import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { RiskBadge } from '../components/RiskBadge';
import { Screen } from '../components/Screen';

export function DoctorDashboardScreen() {
  const patients = [
    { name: 'Aarav P.', risk: 'RED' as const, daysSinceSurgery: 6, lastUpdate: '10 mins ago' },
    { name: 'Maya R.', risk: 'YELLOW' as const, daysSinceSurgery: 4, lastUpdate: '1 hour ago' }
  ];

  return (
    <Screen>
      <View style={styles.metricRow}>
        <Card style={styles.metricCard}>
          <Card.Content>
            <Text style={styles.metricLabel}>Check-ins</Text>
            <Text variant="headlineSmall">14 / 20</Text>
            <Text style={styles.metricCaption}>Completed today</Text>
          </Card.Content>
        </Card>
        <Card style={styles.metricCard}>
          <Card.Content>
            <Text style={styles.metricLabel}>Critical</Text>
            <Text variant="headlineSmall">1</Text>
            <Text style={styles.metricCaption}>Needs immediate review</Text>
          </Card.Content>
        </Card>
      </View>

      <Card style={styles.infoCard}>
        <Card.Title title="Team snapshot" subtitle="Real-time recovery status" />
        <Card.Content>
          <Text style={styles.bodyText}>Review the most recent patient submissions, compare wound trends, and prioritize follow-up quickly.</Text>
        </Card.Content>
      </Card>

      {patients.map((patient) => (
        <Card key={patient.name} style={styles.patientCard}>
          <Card.Content style={styles.patientContent}>
            <View style={styles.patientHeader}>
              <View style={styles.patientText}>
                <Text variant="titleMedium">{patient.name}</Text>
                <Text style={styles.patientMeta}>{`Day ${patient.daysSinceSurgery} · ${patient.lastUpdate}`}</Text>
              </View>
              <RiskBadge risk={patient.risk} />
            </View>
            <Text style={styles.bodyText}>Open patient timeline, symptom trend, and AI explanation to decide next steps.</Text>
            <Button mode="outlined" style={styles.button}>
              Review chart
            </Button>
          </Card.Content>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
  },
  metricCaption: {
    color: '#475569',
    marginTop: 6
  },
  infoCard: {
    borderRadius: 24
  },
  bodyText: {
    color: '#475569',
    lineHeight: 22
  },
  patientCard: {
    borderRadius: 24
  },
  patientContent: {
    gap: 12,
    paddingVertical: 18
  },
  patientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12
  },
  patientText: {
    flex: 1,
    gap: 4
  },
  patientMeta: {
    color: '#64748B'
  },
  button: {
    alignSelf: 'flex-start'
  }
});
