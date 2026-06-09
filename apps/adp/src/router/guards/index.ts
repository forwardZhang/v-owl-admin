import type { Router } from 'vue-router';
import { setupAccessGuard } from './access';
import { setupCommonGuard } from './common';

export function setupRouterGuard(router: Router) {
  setupCommonGuard(router);
  setupAccessGuard(router);
}
