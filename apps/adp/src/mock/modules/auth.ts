import type { LoginCommand } from '../../types/auth';
import type { MockRoute } from '../server';

const mockToken = 'mock-token-admin';

const mockProfile = {
  id: 'u_10001',
  username: 'admin',
  nickname: '陈小猫',
  avatar: 'VA',
  department: '平台技术中心',
  position: '前端负责人',
  roles: ['super']
};

// 演示用按钮级权限码（对应系统管理各页面的增删改操作）
const mockAccessCodes = [
  'system:user:add',
  'system:user:edit',
  'system:user:delete',
  'system:menu:add',
  'system:menu:edit',
  'system:menu:delete',
  'system:role:add',
  'system:role:edit',
  'system:role:delete',
  'system:role:export'
];

export function isValidToken(token: string) {
  return token === mockToken;
}

export const authMockRoutes: MockRoute[] = [
  {
    method: 'POST',
    path: '/auth/login',
    handler: ({ data }) => {
      const payload = data as LoginCommand;

      if (payload.username === 'admin' && payload.password === 'Admin123') {
        return {
          code: 0,
          message: '登录成功',
          data: {
            token: mockToken,
            expiresAt: '2026-12-31 23:59:59'
          }
        };
      }

      return {
        code: 40101,
        message: '用户名或密码错误，演示账号为 admin / Admin123',
        data: null
      };
    }
  },
  {
    method: 'GET',
    path: '/auth/profile',
    handler: ({ token }) => {
      if (!isValidToken(token)) {
        return {
          code: 40102,
          message: '登录态已过期，请重新登录',
          data: null
        };
      }

      return {
        code: 0,
        message: '获取成功',
        data: mockProfile
      };
    }
  },
  {
    method: 'GET',
    path: '/auth/codes',
    handler: ({ token }) => {
      if (!isValidToken(token)) {
        return {
          code: 40102,
          message: '登录态已过期，请重新登录',
          data: null
        };
      }

      return {
        code: 0,
        message: '获取成功',
        data: mockAccessCodes
      };
    }
  },
  {
    method: 'POST',
    path: '/auth/logout',
    handler: () => ({
      code: 0,
      message: '退出成功',
      data: null
    })
  }
];
