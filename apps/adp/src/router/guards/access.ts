import type { Router } from 'vue-router';
import { HOME_PATH, LOGIN_PATH } from '@/constants/app';
import { generateAccess } from '@/router/access';
import { pinia } from '@/store';
import { useAccessStore } from '@/store/modules/access';
import { useAuthStore } from '@/store/modules/auth';

/**
 * 访问控制守卫：鉴权 + 首次登录后生成并挂载动态路由。
 */
export function setupAccessGuard(router: Router) {
  router.beforeEach(async (to) => {
    const accessStore = useAccessStore(pinia);
    const authStore = useAuthStore(pinia);

    // 未登录：放行无需鉴权的路由，否则跳登录并带回跳地址
    if (!accessStore.accessToken) {
      if (to.meta.ignoreAccess) {
        return true;
      }

      return {
        path: LOGIN_PATH,
        query: { redirect: to.fullPath },
        replace: true
      };
    }

    // 已登录再访问登录页：跳首页
    if (to.path === LOGIN_PATH) {
      return { path: HOME_PATH, replace: true };
    }

    // 已完成权限初始化：直接放行
    if (accessStore.isAccessChecked) {
      return true;
    }

    try {
      await authStore.fetchUserInfo();
      await generateAccess(router);
      accessStore.setIsAccessChecked(true);

      // 动态路由刚挂载，重新进入目标地址（命中 404 时回退到原始地址）
      const targetPath =
        to.path === '/404' && to.redirectedFrom?.fullPath
          ? to.redirectedFrom.fullPath
          : to.fullPath;

      return { path: targetPath, replace: true };
    } catch {
      await authStore.logout();

      return {
        path: LOGIN_PATH,
        query: { redirect: to.fullPath },
        replace: true
      };
    }
  });
}
