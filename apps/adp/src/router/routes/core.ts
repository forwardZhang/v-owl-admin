import type { RouteRecordRaw } from 'vue-router';

/**
 * 核心（常量）路由：不依赖权限、应用启动即存在。
 * 动态路由由 access 守卫在登录后挂载到 name 为 `root` 的布局路由下。
 */
export const coreRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      ignoreAccess: true,
      title: '登录'
    }
  },
  {
    path: '/',
    name: 'root',
    component: () => import('@/layouts/index.vue'),
    children: [],
    redirect: '/dashboard',
    meta: {
      hideInMenu: true,
      requiresAuth: true,
      title: '首页'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在'
    }
  }
];
