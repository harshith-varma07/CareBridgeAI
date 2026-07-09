import axios from 'axios';

const defaultBaseURL = 'http://localhost:5000/api';
const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || defaultBaseURL;

export const api = axios.create({
  baseURL,
  timeout: 10000
});
