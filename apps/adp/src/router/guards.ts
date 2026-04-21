import type { Router } from 'vue-router';
import { APP_TITLE, HOME_PATH, LOGIN_PATH, WHITE_LIST } from '@/constants/app';
import { pinia } from '@/store';
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';
import { useUserStore } from '@/store/modules/user';

function updateDocumentTitle(title?: string) {
  document.title = title ? `${title} | ${APP_TITLE}` : APP_TITLE;
}

async function ensureDynamicRoutes(router: Router) {
  const permissionStore = usePermissionStore(pinia);

  if (permissionStore.routesReady) {
    return;
  }

  const dynamicRoutes = await permissionStore.generatePermissions();

  dynamicRoutes.forEach((route) => {
    router.addRoute('root', route);
  });

  permissionStore.markRoutesReady(true);
}

export function setupRouterGuard(router: Router) {
  router.beforeEach(async (to) => {
    const userStore = useUserStore(pinia);
    const permissionStore = usePermissionStore(pinia);
    const appStore = useAppStore(pinia);

    updateDocumentTitle(to.meta.title);

    if (!userStore.isAuthenticated) {
      if (WHITE_LIST.includes(to.path)) {
        return true;
      }

      return {
        path: LOGIN_PATH,
        query: {
          redirect: to.fullPath
        },
        replace: true
      };
    }

    if (to.path === LOGIN_PATH) {
      return {
        path: HOME_PATH,
        replace: true
      };
    }

    try {
      if (!userStore.profile) {
        await userStore.fetchProfile();
      }

      if (!permissionStore.routesReady) {
        await ensureDynamicRoutes(router);

        const targetPath =
          to.path === '/404' && to.redirectedFrom?.fullPath
            ? to.redirectedFrom.fullPath
            : to.fullPath;

        return {
          path: targetPath,
          replace: true
        };
      }

      if (to.path === LOGIN_PATH) {
        return {
          path: HOME_PATH,
          replace: true
        };
      }

      appStore.setMobileMenuVisible(false);
      return true;
    } catch {
      userStore.clearSession();
      permissionStore.resetPermissions();

      return {
        path: LOGIN_PATH,
        query: {
          redirect: to.fullPath
        },
        replace: true
      };
    }
  });
}
