import type { App, Directive, DirectiveBinding } from 'vue';
import { pinia } from '@/store';
import { useAccessStore } from '@/store/modules/access';

type AccessValue = string | string[];

/** 命中任意一个所需权限码即放行 */
function hasAccess(value: AccessValue): boolean {
  const accessStore = useAccessStore(pinia);
  const required = Array.isArray(value) ? value : [value];

  if (!required.length) {
    return true;
  }

  return required.some((code) => accessStore.accessCodes.includes(code));
}

/**
 * 按钮级权限指令：`v-access="'system:user:add'"` 或 `v-access="['a', 'b']"`。
 * 无权限时直接从 DOM 移除元素（与 vben 行为一致）。
 */
export const accessDirective: Directive<HTMLElement, AccessValue> = {
  mounted(el, binding: DirectiveBinding<AccessValue>) {
    if (!hasAccess(binding.value)) {
      el.remove();
    }
  }
};

export function setupAccessDirective(app: App) {
  app.directive('access', accessDirective);
}
