import React from 'react';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

export function ProfileScreen() {
  return (
    <View style={{ padding: 16 }}>
      <Card>
        <Card.Title title="Profile" />
        <Card.Content>
          <Text>Name: Demo User</Text>
          <Text>Hospital ID: HSP-1001</Text>
        </Card.Content>
      </Card>
    </View>
  );
}
