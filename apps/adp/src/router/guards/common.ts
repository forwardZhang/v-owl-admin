import type { Router } from 'vue-router';
import { APP_TITLE } from '@/constants/app';

/**
 * 通用守卫：与权限无关的横切逻辑——页面加载追踪 + 文档标题。
 */
export function setupCommonGuard(router: Router) {
  // 记录已加载过的路径，供页面做首屏 / keepAlive 判断
  const loadedPaths = new Set<string>();

  router.beforeEach((to) => {
    to.meta.loaded = loadedPaths.has(to.path);
    return true;
  });

  router.afterEach((to) => {
    loadedPaths.add(to.path);

    const title = typeof to.meta.title === 'string' ? to.meta.title : '';
    document.title = title ? `${title} | ${APP_TITLE}` : APP_TITLE;
  });
}
