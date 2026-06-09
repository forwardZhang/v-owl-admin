import type { Router } from 'vue-router';
import { fetchMenuTreeApi } from '@/api/menu';
import { buildRoutesFromBackend, generateMenus } from '@/router/convert';
import { pinia } from '@/store';
import { useAccessStore } from '@/store/modules/access';

/** 已挂载动态路由的卸载函数，登出 / 切换用户时用于清场 */
const dynamicRouteRemovers: Array<() => void> = [];

/**
 * 后端访问控制：拉取菜单配置 → 生成路由并挂载到 root → 派生 UI 菜单写入 store。
 * 重新生成前会先卸载上一批动态路由，避免不同用户权限残留。
 */
export async function generateAccess(router: Router) {
  const accessStore = useAccessStore(pinia);

  const backendMenus = await fetchMenuTreeApi();
  const accessRoutes = buildRoutesFromBackend(backendMenus);
  const accessMenus = generateMenus(accessRoutes);

  resetAccessRoutes();

  accessRoutes.forEach((route) => {
    const remove = router.addRoute('root', route);
    dynamicRouteRemovers.push(remove);
  });

  accessStore.setAccessRoutes(accessRoutes);
  accessStore.setAccessMenus(accessMenus);

  return accessRoutes;
}

/** 卸载全部已挂载的动态路由 */
export function resetAccessRoutes() {
  while (dynamicRouteRemovers.length) {
    dynamicRouteRemovers.pop()?.();
  }
}
