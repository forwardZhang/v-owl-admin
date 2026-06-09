import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { TOKEN_STORAGE_KEY } from '@/constants/storage';
import type { MenuRecordRaw } from '@/types/menu';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';

/**
 * 访问控制 store：集中管理「能进什么」——
 * 登录态 token、按钮权限码、可访问的路由与派生菜单。
 * 与 user store（用户是谁）、app store（外观偏好）职责分离。
 */
export const useAccessStore = defineStore('access', () => {
  const accessToken = ref<string>(getStorage<string>(TOKEN_STORAGE_KEY, ''));
  const accessCodes = ref<string[]>([]);
  const accessRoutes = ref<RouteRecordRaw[]>([]);
  const accessMenus = ref<MenuRecordRaw[]>([]);
  // 动态路由是否已生成并挂载，避免每次导航重复拉取
  const isAccessChecked = ref(false);

  function setAccessToken(token: string) {
    accessToken.value = token;

    if (token) {
      setStorage(TOKEN_STORAGE_KEY, token);
    } else {
      removeStorage(TOKEN_STORAGE_KEY);
    }
  }

  function setAccessCodes(codes: string[]) {
    accessCodes.value = codes;
  }

  function setAccessRoutes(routes: RouteRecordRaw[]) {
    accessRoutes.value = routes;
  }

  function setAccessMenus(menus: MenuRecordRaw[]) {
    accessMenus.value = menus;
  }

  function setIsAccessChecked(checked: boolean) {
    isAccessChecked.value = checked;
  }

  function reset() {
    setAccessToken('');
    accessCodes.value = [];
    accessRoutes.value = [];
    accessMenus.value = [];
    isAccessChecked.value = false;
  }

  return {
    accessCodes,
    accessMenus,
    accessRoutes,
    accessToken,
    isAccessChecked,
    reset,
    setAccessCodes,
    setAccessMenus,
    setAccessRoutes,
    setAccessToken,
    setIsAccessChecked
  };
});
