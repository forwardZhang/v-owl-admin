import { computed } from 'vue';
import { useAccessStore } from '@/store/modules/access';
import { useUserStore } from '@/store/modules/user';

function toArray(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

/**
 * 访问控制组合式函数：在脚本里做按钮 / 角色级权限判断。
 * 模板里更推荐直接用 `v-access` 指令。
 */
export function useAccess() {
  const accessStore = useAccessStore();
  const userStore = useUserStore();

  const accessCodes = computed(() => accessStore.accessCodes);
  const userRoles = computed(() => userStore.userRoles);

  /** 命中任意一个权限码即视为有权限 */
  function hasAccessByCodes(codes: string | string[]) {
    const required = toArray(codes);
    return required.some((code) => accessCodes.value.includes(code));
  }

  /** 命中任意一个角色即视为有权限 */
  function hasAccessByRoles(roles: string | string[]) {
    const required = toArray(roles);
    return required.some((role) => userRoles.value.includes(role));
  }

  return {
    accessCodes,
    userRoles,
    hasAccessByCodes,
    hasAccessByRoles
  };
}
