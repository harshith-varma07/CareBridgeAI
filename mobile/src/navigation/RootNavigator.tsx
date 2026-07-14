import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
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
  const theme = useTheme();
  const role = useSelector((state: RootState) => state.auth.role);

  const screenOptions = ({ route }: { route: { name: string } }) => ({
    headerShown: false,
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: '600' as const
    },
    tabBarStyle: {
      backgroundColor: theme.colors.surface,
      borderTopWidth: 0,
      height: 68,
      paddingTop: 8,
      paddingBottom: 10,
      elevation: 8,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: -4 },
      shadowRadius: 12
    },
    tabBarIcon: ({ color, size }: { color: string; size: number }) => {
      const iconName =
        route.name === 'Dashboard'
          ? 'view-dashboard-outline'
          : route.name === 'Daily Chat'
            ? 'message-reply-text-outline'
            : route.name === 'History'
              ? 'chart-line'
              : route.name === 'Notifications'
                ? 'bell-outline'
                : 'account-outline';

      return <MaterialCommunityIcons name={iconName as keyof typeof MaterialCommunityIcons.glyphMap} color={color} size={size} />;
    }
  });

  if (!role) {
    return <LoginScreen />;
  }

  if (role === 'DOCTOR' || role === 'ADMIN') {
    return (
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Dashboard" component={DoctorDashboardScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Dashboard" component={PatientDashboardScreen} />
      <Tab.Screen name="Daily Chat" component={DailyChatScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
