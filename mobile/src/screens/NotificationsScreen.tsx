import React from 'react';
import { ScrollView } from 'react-native';
import { List } from 'react-native-paper';

export function NotificationsScreen() {
  return (
    <ScrollView>
      <List.Item title="Daily Reminder" description="Please complete today's recovery assessment." left={(props) => <List.Icon {...props} icon="bell" />} />
      <List.Item title="Risk Alert" description="Pain trend increasing for patient Aarav P." left={(props) => <List.Icon {...props} icon="alert" />} />
    </ScrollView>
  );
}
