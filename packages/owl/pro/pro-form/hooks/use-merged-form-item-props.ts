import { computed } from 'vue';
import { isPlainObject } from 'lodash-es';
import type { FormItemProps } from 'antdv-next';
import type { ProFieldComponentProps } from '../types';

export function useMergedFormItemProps<TFieldProps>(props: ProFieldComponentProps<TFieldProps>) {
  return computed<Partial<FormItemProps> & { title?: string }>(() => {
    /**
     * 字段层的 label/name 默认会灌入到 ProFormItem，
     * 同时允许 formItemProps 显式覆盖。
     */
    return {
      name: props.name,
      label: props.label,
      ...(isPlainObject(props.formItemProps) ? props.formItemProps : {})
    };
  });
}
