import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const defaultBaseURL = 'http://10.0.2.2:5000/api'; // Android emulator localhost
const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || defaultBaseURL;

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['auth_token', 'auth_user']);
      // The app will detect the missing token and show login
    }
    return Promise.reject(error);
  }
);
