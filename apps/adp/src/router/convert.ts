import { markRaw } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import RouteView from '@/layouts/route-view.vue';
import type { MenuRecord, MenuRecordRaw } from '@/types/menu';

const viewModules = import.meta.glob('../views/**/*.vue');

/** 把后端 component 字段解析为真实组件：容器用 RouteView，叶子按路径动态导入，缺失回退 404 */
function resolveRouteComponent(component?: string) {
  if (!component || component === 'layout.routeView') {
    return markRaw(RouteView);
  }

  const matched = viewModules[`../views/${component}.vue`];

  if (!matched) {
    return viewModules['../views/error/404.vue'];
  }

  return matched;
}

/**
 * 后端下发的路由配置 → vue-router 路由表。
 * 保留后端的绝对 path（vue-router 允许子路由使用绝对路径），无需相对化处理。
 */
export function buildRoutesFromBackend(records: MenuRecord[]): RouteRecordRaw[] {
  return records.map((record) => {
    const route = {
      component: resolveRouteComponent(record.component),
      meta: record.meta,
      name: record.name,
      path: record.path
    } as RouteRecordRaw;

    if (record.redirect) {
      route.redirect = record.redirect;
    }

    if (record.children?.length) {
      route.children = buildRoutesFromBackend(record.children);
    }

    return route;
  });
}

/**
 * 可访问路由树 → UI 菜单（单一数据源）。
 * 过滤隐藏项、按 meta.order 升序，把 meta 中的展示字段拍平到菜单节点。
 */
export function generateMenus(routes: RouteRecordRaw[]): MenuRecordRaw[] {
  return routes
    .filter((route) => !route.meta?.hideInMenu)
    .map((route) => {
      const children = route.children?.length ? generateMenus(route.children) : undefined;

      return {
        children: children?.length ? children : undefined,
        icon: route.meta?.icon,
        name: String(route.name ?? ''),
        order: route.meta?.order ?? 0,
        path: route.path,
        title: route.meta?.title ?? ''
      } satisfies MenuRecordRaw;
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
