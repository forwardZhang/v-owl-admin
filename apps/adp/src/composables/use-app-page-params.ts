import type { Router } from 'vue-router';

export function useAppPageParams(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();
  router.beforeEach((to) => {
    if (to.meta) {
      to.meta.loaded = loadedPaths.has(to.path);
    }

    return true;
  });
  router.afterEach((to) => {
    loadedPaths.add(to.path);
  });
}
