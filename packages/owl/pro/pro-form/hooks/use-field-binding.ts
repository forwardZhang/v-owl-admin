import { computed } from 'vue';
import type { CreateProFormReturn, ProFormNamePath } from '../types';

export function useFieldBinding<TValue = unknown>(
  form: CreateProFormReturn,
  name: ProFormNamePath
) {
  /**
   * 统一把字段值读写桥接到 createProForm，
   * 避免每个字段组件自己重复处理 get/set/setFieldValue。
   */
  return computed<TValue | undefined>({
    get: () => form.getFieldValue<TValue>(name),
    set: (value) => {
      form.setFieldValue(name, value);
    }
  });
}
