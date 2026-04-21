import type { MockRoute } from '../server';
import { isValidToken } from './auth';

export const systemMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/system/users',
    handler: ({ token }) => {
      if (!isValidToken(token)) {
        return {
          code: 40102,
          data: null,
          message: '用户登录态失效，无法获取用户管理数据'
        };
      }

      return {
        code: 0,
        data: [
          {
            department: '平台技术中心',
            id: 'user_1',
            lastLoginAt: '2026-04-21 10:32:18',
            nickname: '陈小猫',
            phone: '138****1024',
            roleName: '超级管理员',
            status: 'enabled',
            username: 'admin'
          },
          {
            department: '商品运营部',
            id: 'user_2',
            lastLoginAt: '2026-04-21 09:18:46',
            nickname: '苏清和',
            phone: '139****9988',
            roleName: '商品运营',
            status: 'enabled',
            username: 'sophie'
          },
          {
            department: '数据分析部',
            id: 'user_3',
            lastLoginAt: '2026-04-20 18:41:05',
            nickname: '赵沉舟',
            phone: '137****6677',
            roleName: '数据分析师',
            status: 'enabled',
            username: 'data.zhao'
          },
          {
            department: '风控中心',
            id: 'user_4',
            lastLoginAt: '2026-04-19 16:07:22',
            nickname: '林秋白',
            phone: '136****3321',
            roleName: '风控审核员',
            status: 'disabled',
            username: 'risk.lin'
          }
        ],
        message: '获取用户列表成功'
      };
    }
  },
  {
    method: 'GET',
    path: '/system/menus',
    handler: ({ token }) => {
      if (!isValidToken(token)) {
        return {
          code: 40102,
          data: null,
          message: '用户登录态失效，无法获取菜单管理数据'
        };
      }

      return {
        code: 0,
        data: [
          {
            component: 'layout.routeView',
            id: 'menu_1',
            order: 1,
            path: '/system',
            permission: 'system:view',
            status: 'enabled',
            title: '系统管理',
            type: 'directory'
          },
          {
            component: 'system/users/index',
            id: 'menu_2',
            order: 1,
            path: '/system/users',
            permission: 'system:user:list',
            status: 'enabled',
            title: '用户管理',
            type: 'menu'
          },
          {
            component: 'system/menus/index',
            id: 'menu_3',
            order: 2,
            path: '/system/menus',
            permission: 'system:menu:list',
            status: 'enabled',
            title: '菜单管理',
            type: 'menu'
          },
          {
            component: 'system/roles/index',
            id: 'menu_4',
            order: 3,
            path: '/system/roles',
            permission: 'system:role:list',
            status: 'enabled',
            title: '角色管理',
            type: 'menu'
          },
          {
            component: '--',
            id: 'menu_5',
            order: 1,
            path: '/system/users/create',
            permission: 'system:user:create',
            status: 'enabled',
            title: '新增用户',
            type: 'button'
          }
        ],
        message: '获取菜单管理列表成功'
      };
    }
  },
  {
    method: 'GET',
    path: '/system/roles',
    handler: ({ token }) => {
      if (!isValidToken(token)) {
        return {
          code: 40102,
          data: null,
          message: '用户登录态失效，无法获取角色管理数据'
        };
      }

      return {
        code: 0,
        data: [
          {
            code: 'super_admin',
            dataScope: '全部数据',
            description: '拥有所有菜单、接口与按钮权限，适用于平台超管。',
            id: 'role_1',
            name: '超级管理员',
            permissionTags: ['用户管理', '菜单管理', '角色管理', '经营看板'],
            status: 'enabled',
            userCount: 2
          },
          {
            code: 'goods_operator',
            dataScope: '商品中心',
            description: '负责商品审核、类目维护和活动配置。',
            id: 'role_2',
            name: '商品运营',
            permissionTags: ['商品审核', '类目管理', '活动配置'],
            status: 'enabled',
            userCount: 9
          },
          {
            code: 'data_analyst',
            dataScope: '经营数据',
            description: '聚焦经营分析与报表权限，不能变更配置类数据。',
            id: 'role_3',
            name: '数据分析师',
            permissionTags: ['经营看板', '报表导出', '趋势分析'],
            status: 'enabled',
            userCount: 6
          },
          {
            code: 'risk_auditor',
            dataScope: '风控域',
            description: '处理风险订单、异常账号和合规审核。',
            id: 'role_4',
            name: '风控审核员',
            permissionTags: ['风控看板', '订单审核', '黑名单'],
            status: 'disabled',
            userCount: 3
          }
        ],
        message: '获取角色列表成功'
      };
    }
  }
];
