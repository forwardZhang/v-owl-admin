import { find } from 'lodash-es';
import type { ApiResponse } from '../types/api';
import { authMockRoutes } from './modules/auth';
import { dashboardMockRoutes } from './modules/dashboard';
import { menuMockRoutes } from './modules/menu';
import { systemMockRoutes } from './modules/system';

type MockMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface MockContext {
  data: unknown;
  headers: Record<string, string>;
  method: MockMethod;
  params: unknown;
  path: string;
  token: string;
}

type MockHandlerResult<T = unknown> = Pick<ApiResponse<T>, 'code' | 'message' | 'data'>;

export interface MockRoute {
  method: MockMethod;
  path: string;
  handler: (context: MockContext) => MockHandlerResult | Promise<MockHandlerResult>;
}

interface ResolveMockRequestOptions {
  data?: unknown;
  headers?: Record<string, string>;
  method: string;
  params?: unknown;
  url?: string;
}

interface ResolvedMockResponse<T = unknown> {
  payload: ApiResponse<T>;
  status: number;
}

export const mockRoutes: MockRoute[] = [
  ...authMockRoutes,
  ...menuMockRoutes,
  ...dashboardMockRoutes,
  ...systemMockRoutes
];

export function sleep(duration: number) {
  return new Promise((resolve) => {
    globalThis.setTimeout(resolve, duration);
  });
}

export function normalizeMockPath(url = '') {
  return url.replace(/^\/api/, '') || '/';
}

export function parseMockBody(payload: unknown) {
  if (typeof payload !== 'string') {
    return payload ?? {};
  }

  try {
    return JSON.parse(payload);
  } catch {
    return payload;
  }
}

function createApiPayload<T>(partial: MockHandlerResult<T>): ApiResponse<T> {
  return {
    code: partial.code,
    message: partial.message,
    data: partial.data as T,
    success: partial.code === 0,
    traceId: `trace_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
}

export function normalizeMockHeaders(headers: Record<string, string> = {}) {
  return Object.entries(headers).reduce<Record<string, string>>((result, [key, value]) => {
    result[key.toLowerCase()] = value;
    return result;
  }, {});
}

function resolveToken(headers: Record<string, string>) {
  const authorization = headers.authorization || '';
  return authorization.replace(/^Bearer\s+/i, '');
}

export async function resolveMockRequest({
  data,
  headers = {},
  method,
  params,
  url
}: ResolveMockRequestOptions): Promise<ResolvedMockResponse> {
  const normalizedMethod = ((method || 'GET').toUpperCase() as MockMethod) || 'GET';
  const path = normalizeMockPath(url);
  const normalizedHeaders = normalizeMockHeaders(headers);

  await sleep(320 + Math.floor(Math.random() * 360));

  const matchedRoute = find(
    mockRoutes,
    (route) => route.method === normalizedMethod && route.path === path
  );

  if (!matchedRoute) {
    return {
      payload: createApiPayload({
        code: 40404,
        message: `未找到 Mock 接口: ${normalizedMethod} ${path}`,
        data: null
      }),
      status: 404
    };
  }

  const payload = await matchedRoute.handler({
    data: parseMockBody(data),
    headers: normalizedHeaders,
    method: normalizedMethod,
    params,
    path,
    token: resolveToken(normalizedHeaders)
  });

  return {
    payload: createApiPayload(payload),
    status: 200
  };
}
