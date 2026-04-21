import type { MockRoute } from '../server';
import { isValidToken } from './auth';

export const menuMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/menus',
    handler: ({ token }) => {
      if (!isValidToken(token)) {
        return {
          code: 40102,
          message: '未获取到有效登录态，无法拉取菜单',
          data: null
        };
      }

      return {
        code: 0,
        message: '获取菜单成功',
        data: [
          {
            id: 'dashboard',
            name: 'Dashboard',
            path: '/dashboard',
            component: 'dashboard/index',
            icon: 'dashboard',
            meta: {
              title: '工作台',
              order: 1,
              icon: 'dashboard',
              keepAlive: true,
              requiresAuth: true
            }
          },
          {
            id: 'system',
            name: 'System',
            path: '/system',
            component: 'layout.routeView',
            redirect: '/system/users',
            icon: 'system',
            meta: {
              title: '系统管理',
              order: 2,
              icon: 'system',
              requiresAuth: true
            },
            children: [
              {
                id: 'system-users',
                name: 'SystemUsers',
                path: '/system/users',
                component: 'system/users/index',
                icon: 'users',
                meta: {
                  title: '用户管理',
                  order: 1,
                  icon: 'users',
                  requiresAuth: true
                }
              },
              {
                id: 'system-menus',
                name: 'SystemMenus',
                path: '/system/menus',
                component: 'system/menus/index',
                icon: 'menus',
                meta: {
                  title: '菜单管理',
                  order: 2,
                  icon: 'menus',
                  requiresAuth: true
                }
              },
              {
                id: 'system-roles',
                name: 'SystemRoles',
                path: '/system/roles',
                component: 'system/roles/index',
                icon: 'roles',
                meta: {
                  title: '角色管理',
                  order: 3,
                  icon: 'roles',
                  requiresAuth: true
                }
              }
            ]
          }
        ]
      };
    }
  }
];
