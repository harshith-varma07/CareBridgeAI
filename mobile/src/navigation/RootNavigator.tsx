import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { LoginScreen } from '../screens/LoginScreen';
import { PatientDashboardScreen } from '../screens/PatientDashboardScreen';
import { DailyChatScreen } from '../screens/DailyChatScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { DoctorDashboardScreen } from '../screens/DoctorDashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();

export function RootNavigator() {
  const role = useSelector((state: RootState) => state.auth.role);

  if (!role) {
    return <LoginScreen />;
  }

  if (role === 'DOCTOR' || role === 'ADMIN') {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={DoctorDashboardScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={PatientDashboardScreen} />
      <Tab.Screen name="Daily Chat" component={DailyChatScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
