import type { LoginCommand, LoginResult, UserProfile } from '@/types/auth';
import { request } from '@/utils/request';

export function loginApi(payload: LoginCommand) {
  return request.post<LoginResult>('/auth/login', payload);
}

export function fetchProfileApi() {
  return request.get<UserProfile>('/auth/profile');
}

export function logoutApi() {
  return request.post<null>('/auth/logout');
}
