import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'ADMIN';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type LoginResponse = {
  token: string;
  user: AuthUser;
};

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', { email, password });
  await AsyncStorage.setItem('auth_token', data.token);
  await AsyncStorage.setItem('auth_user', JSON.stringify(data.user));
  return data;
}

export async function registerApi(name: string, email: string, password: string, role: UserRole): Promise<{ id: string; email: string; role: UserRole }> {
  const { data } = await api.post('/auth/register', { name, email, password, role });
  return data;
}

export async function logoutApi(): Promise<void> {
  await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
}

export async function getStoredAuth(): Promise<{ token: string; user: AuthUser } | null> {
  const token = await AsyncStorage.getItem('auth_token');
  const userStr = await AsyncStorage.getItem('auth_user');
  if (token && userStr) {
    return { token, user: JSON.parse(userStr) };
  }
  return null;
}
