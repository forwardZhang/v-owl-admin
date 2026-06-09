import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios';
import { LOGIN_PATH } from '@/constants/app';
import { TOKEN_STORAGE_KEY } from '@/constants/storage';
import type { ApiResponse } from '@/types/api';
import { getStorage, removeStorage } from '@/utils/storage';

const service = axios.create({
  baseURL: '/api',
  timeout: 10_000
});

/** 鉴权失效：清 token 并跳转登录（带回跳地址），避免每个调用方各自处理 */
function redirectToLogin() {
  removeStorage(TOKEN_STORAGE_KEY);

  if (window.location.pathname === LOGIN_PATH) {
    return;
  }

  const redirect = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.assign(`${LOGIN_PATH}?redirect=${redirect}`);
}

// 请求拦截：注入 Bearer token
service.interceptors.request.use((config) => {
  const token = getStorage<string>(TOKEN_STORAGE_KEY, '');

  if (token) {
    config.headers.set?.('Authorization', `Bearer ${token}`);
  }

  return config;
});

// 响应拦截：解包业务数据 / 统一错误
service.interceptors.response.use(
  <T>(response: { data: ApiResponse<T> }) => {
    const payload = response.data;

    if (payload.code !== 0) {
      return Promise.reject(new Error(payload.message || '请求失败'));
    }

    return payload.data;
  },
  (error: AxiosError<ApiResponse<never>>) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      redirectToLogin();
    }

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
