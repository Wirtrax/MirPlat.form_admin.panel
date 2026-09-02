import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { authToken } from './authToken';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  if (authToken && !config.headers?.Authorization) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status ?? 'unknown';
    return Promise.reject(`Ошибка: ${status}`);
  }
);

export const request = async <T>(
  endpoint: string,
  options: AxiosRequestConfig = {},
  typeRoute: 'admin' | 'api' = 'api'
): Promise<T> => {
  const res = await api.request<T>({
    url: `${typeRoute}${endpoint}`,
    ...options,
  });
  return res.data;
};
