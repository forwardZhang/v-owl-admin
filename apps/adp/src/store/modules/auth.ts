import { defineStore } from 'pinia';
import { fetchProfileApi, getAccessCodesApi, loginApi, logoutApi } from '@/api/auth';
import { resetAccessRoutes } from '@/router/access';
import { useAccessStore } from '@/store/modules/access';
import { useUserStore } from '@/store/modules/user';
import type { LoginCommand, UserProfile } from '@/types/auth';

/**
 * 认证编排 store：串联登录 / 拉取资料 / 登出的完整流程，
 * 把结果分发到 access store（token、权限码）与 user store（资料、角色）。
 */
export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();

  /** 登录：写入 token 后立即拉取用户资料与权限码 */
  async function authLogin(params: LoginCommand) {
    const { token } = await loginApi(params);
    accessStore.setAccessToken(token);

    const userInfo = await fetchUserInfo();
    return userInfo;
  }

  /** 拉取用户资料 + 按钮权限码，分别写入 user / access store */
  async function fetchUserInfo(): Promise<UserProfile> {
    const [userInfo, accessCodes] = await Promise.all([fetchProfileApi(), getAccessCodesApi()]);

    userStore.setUserInfo(userInfo);
    accessStore.setAccessCodes(accessCodes);
    return userInfo;
  }

  /** 登出：尽力通知后端，然后清空所有访问态与动态路由 */
  async function logout() {
    try {
      if (accessStore.accessToken) {
        await logoutApi();
      }
    } catch {
      // 后端登出失败不应阻塞本地清理
    } finally {
      resetAccessRoutes();
      accessStore.reset();
      userStore.reset();
    }
  }

  return {
    authLogin,
    fetchUserInfo,
    logout
  };
});
