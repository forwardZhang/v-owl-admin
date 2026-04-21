import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { TOKEN_STORAGE_KEY } from '@/constants/storage';
import type { ApiResponse } from '@/types/api';
import { getStorage } from '@/utils/storage';

const service = axios.create({
  baseURL: '/api',
  timeout: 10_000
});

service.interceptors.request.use((config) => {
  const token = getStorage<string>(TOKEN_STORAGE_KEY, '');

  if (token) {
    config.headers.set?.('Authorization', `Bearer ${token}`);
  }

  return config;
});

service.interceptors.response.use(
  <T>(response: { data: ApiResponse<T> }) => {
    const payload = response.data;

    if (payload.code !== 0) {
      return Promise.reject(new Error(payload.message || '请求失败'));
    }

    return payload.data;
  },
  (error: AxiosError<ApiResponse<never>>) => {
    const message = error.response?.data?.message || error.message || '网络异常，请稍后重试';
    return Promise.reject(new Error(message));
  }
);

type RequestConfig = AxiosRequestConfig;

function request<T>(config: RequestConfig) {
  return service.request<T, T>(config);
}

request.get = function get<T>(url: string, config?: RequestConfig) {
  return service.get<T, T>(url, config);
};

request.post = function post<T>(url: string, data?: unknown, config?: RequestConfig) {
  return service.post<T, T>(url, data, config);
};

request.put = function put<T>(url: string, data?: unknown, config?: RequestConfig) {
  return service.put<T, T>(url, data, config);
};

request.delete = function del<T>(url: string, config?: RequestConfig) {
  return service.delete<T, T>(url, config);
};

export { request, service };
export type { AxiosInstance };
