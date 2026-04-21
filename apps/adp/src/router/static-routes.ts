import type { RouteRecordRaw } from 'vue-router';

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    name: 'root',
    component: () => import('@/layouts/vertical/index.vue'),
    children: [],
    redirect: '/dashboard',
    meta: {
      hidden: true,
      requiresAuth: true,
      title: '首页'
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
];
