import type { MenuRecord } from '@/types/menu';
import { request } from '@/utils/request';

export function fetchMenuTreeApi() {
  return request.get<MenuRecord[]>('/menus');
}
