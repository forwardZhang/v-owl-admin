import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { fetchProfileApi, loginApi, logoutApi } from '@/api/auth';
import { TOKEN_STORAGE_KEY } from '@/constants/storage';
import type { LoginCommand, UserProfile } from '@/types/auth';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(getStorage<string>(TOKEN_STORAGE_KEY, ''));
  const profile = ref<UserProfile | null>(null);

  const isAuthenticated = computed(() => Boolean(token.value));

  async function login(command: LoginCommand) {
    const result = await loginApi(command);
    token.value = result.token;
    setStorage(TOKEN_STORAGE_KEY, result.token);
    return result;
  }

  async function fetchProfile() {
    const result = await fetchProfileApi();
    profile.value = result;
    return result;
  }

  async function logout() {
    if (token.value) {
      await logoutApi();
    }

    clearSession();
  }

  function clearSession() {
    token.value = '';
    profile.value = null;
    removeStorage(TOKEN_STORAGE_KEY);
  }

  return {
    isAuthenticated,
    profile,
    token,
    clearSession,
    fetchProfile,
    login,
    logout
  };
});
