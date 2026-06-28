import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { RiskBadge } from '../components/RiskBadge';

export function DoctorDashboardScreen() {
  const patients = [
    { name: 'Aarav P.', risk: 'RED' as const, daysSinceSurgery: 6, lastUpdate: '10 mins ago' },
    { name: 'Maya R.', risk: 'YELLOW' as const, daysSinceSurgery: 4, lastUpdate: '1 hour ago' }
  ];

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Card><Card.Title title="Today's Check-ins" subtitle="14 / 20 completed" /></Card>
      <Card><Card.Title title="Critical Patients" subtitle="1 RED alert" /></Card>
      {patients.map((patient) => (
        <Card key={patient.name}>
          <Card.Title title={patient.name} subtitle={`Day ${patient.daysSinceSurgery} • ${patient.lastUpdate}`} right={() => <RiskBadge risk={patient.risk} />} />
          <Card.Content><Text>Open patient timeline and AI explanation.</Text></Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
