import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { RiskBadge } from '../components/RiskBadge';

export function HistoryScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      {[
        { day: 'Day 3', risk: 'GREEN' as const },
        { day: 'Day 4', risk: 'YELLOW' as const },
      ].map((item) => (
        <Card key={item.day}>
          <Card.Title title={item.day} right={() => <RiskBadge risk={item.risk} />} />
          <Card.Content>
            <Text>Tap to view detailed symptoms, trend, and explanation.</Text>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}
