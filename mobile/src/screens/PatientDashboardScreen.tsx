import React from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { RiskBadge } from '../components/RiskBadge';

export function PatientDashboardScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Card>
        <Card.Title title="Current Recovery Day" subtitle="Day 5" />
      </Card>
      <Card>
        <Card.Title title="Current Risk" right={() => <RiskBadge risk="YELLOW" />} />
        <Card.Content>
          <Text>Today’s assessment is pending.</Text>
        </Card.Content>
      </Card>
      <Card>
        <Card.Title title="Previous Assessments" />
        <Card.Content>
          <Text>View your symptom and image history from the History tab.</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}
