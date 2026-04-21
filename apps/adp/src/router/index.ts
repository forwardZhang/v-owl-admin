import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { setupRouterGuard } from './guards';
import { constantRoutes } from './static-routes';
import { useAppPageParams } from '@/composables/use-app-page-params';

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior: () => ({
    left: 0,
    top: 0
  })
});

export function setupRouter(app: App) {
  setupRouterGuard(router);
  useAppPageParams(router);
  app.use(router);
}

export default router;
