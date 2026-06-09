import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { UserProfile } from '@/types/auth';

/**
 * 用户 store：只负责「用户是谁」——个人资料与角色。
 * 登录态 token 与权限码归 access store，登录/登出编排归 auth store。
 */
export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserProfile | null>(null);
  const userRoles = ref<string[]>([]);

  const nickname = computed(() => userInfo.value?.nickname ?? '');

  function setUserInfo(info: UserProfile | null) {
    userInfo.value = info;
    userRoles.value = info?.roles ?? [];
  }

  function setUserRoles(roles: string[]) {
    userRoles.value = roles;
  }

  function reset() {
    userInfo.value = null;
    userRoles.value = [];
  }

  return {
    nickname,
    userInfo,
    userRoles,
    reset,
    setUserInfo,
    setUserRoles
  };
});
