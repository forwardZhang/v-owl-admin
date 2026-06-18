import type { ComputedRef, InjectionKey } from 'vue';
import type { ProFormApi } from './create-pro-form';
import type { ProFormConfigContext } from './shared/types';

/** 表单控制器注入 key（字段组件据此读写 formData、合并配置） */
export const proFormKey: InjectionKey<ProFormApi<any>> = Symbol('pro-form');

/** 表单级 / 栅格配置注入 key（响应式） */
export const proFormConfigKey: InjectionKey<ComputedRef<ProFormConfigContext>> =
  Symbol('pro-form-config');
