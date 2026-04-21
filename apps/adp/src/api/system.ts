import type { SystemMenuRecord, SystemRoleRecord, SystemUserRecord } from '@/types/system';
import { request } from '@/utils/request';

export function fetchSystemUsersApi() {
  return request.get<SystemUserRecord[]>('/system/users');
}

export function fetchSystemMenusApi() {
  return request.get<SystemMenuRecord[]>('/system/menus');
}

export function fetchSystemRolesApi() {
  return request.get<SystemRoleRecord[]>('/system/roles');
}
