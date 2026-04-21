import type { RouteRecordRaw } from 'vue-router';
import RouteView from '@/layouts/route-view.vue';
import type { MenuRecord } from '@/types/menu';

const viewModules = import.meta.glob('../views/**/*.vue');

function resolveRouteComponent(component?: string) {
  if (!component || component === 'layout.routeView') {
    return RouteView;
  }

  const matched = viewModules[`../views/${component}.vue`];

  if (!matched) {
    return viewModules['../views/error/404.vue'];
  }

  return matched;
}

function normalizeRoutePath(path: string, parentPath = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (!parentPath) {
    return normalizedPath.replace(/^\//, '');
  }

  const normalizedParentPath = parentPath.startsWith('/') ? parentPath : `/${parentPath}`;

  if (normalizedPath.startsWith(`${normalizedParentPath}/`)) {
    return normalizedPath.slice(normalizedParentPath.length + 1);
  }

  return normalizedPath.replace(/^\//, '');
}

export function transformMenusToRoutes(menus: MenuRecord[], parentPath = ''): RouteRecordRaw[] {
  return menus.map((menu) => {
    const route = {
      path: normalizeRoutePath(menu.path, parentPath),
      name: menu.name,
      meta: menu.meta
    } as RouteRecordRaw;

    if (menu.redirect) {
      route.redirect = menu.redirect;
    }

    if (menu.children?.length) {
      route.component = resolveRouteComponent(menu.component);
      route.children = transformMenusToRoutes(menu.children, menu.path);
    } else {
      route.component = resolveRouteComponent(menu.component);
    }

    return route;
  });
}
