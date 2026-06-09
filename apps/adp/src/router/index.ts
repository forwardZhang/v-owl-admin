import type { App } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { setupRouterGuard } from './guards';
import { coreRoutes } from './routes/core';

const router = createRouter({
  history: createWebHistory(),
  routes: coreRoutes,
  scrollBehavior: () => ({
    left: 0,
    top: 0
  })
});

export function setupRouter(app: App) {
  setupRouterGuard(router);
  app.use(router);
}

export default router;
