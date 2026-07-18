import { api } from './api';

export type NotificationItem = {
  _id: string;
  type: 'DAILY_REMINDER' | 'HIGH_RISK_ALERT' | 'DOCTOR_NOTIFICATION' | 'CRITICAL_PATIENT_NOTIFICATION';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export async function getNotifications(): Promise<NotificationItem[]> {
  const { data } = await api.get<NotificationItem[]>('/notifications');
  return data;
}

export async function markNotificationRead(id: string): Promise<void> {
  await api.put(`/notifications/${id}/read`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await api.put('/notifications/read-all');
}
