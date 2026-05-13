import { isPlainObject } from 'lodash-es';
import type { ProFieldComponentProps, ProFormNamePath } from '../types';

/**
 * 把字段 name 统一归一为数组路径，便于兼容嵌套字段。
 */
export function normalizeNamePath(name: ProFormNamePath): Array<string | number> {
  return Array.isArray(name) ? name : [name];
}

export function resolveFieldLabel(
  label: ProFieldComponentProps<unknown>['label'],
  formItemProps?: ProFieldComponentProps<unknown>['formItemProps']
) {
  return formItemProps?.label ?? label;
}

export function createPlaceholder(
  prefix: '请输入' | '请选择',
  label: ProFieldComponentProps<unknown>['label'],
  formItemProps?: ProFieldComponentProps<unknown>['formItemProps']
) {
  const resolvedLabel = resolveFieldLabel(label, formItemProps);

  return typeof resolvedLabel === 'string' && resolvedLabel
    ? `${prefix}${resolvedLabel}`
    : undefined;
}

export function getFieldPropsOptions<TOption>(fieldProps?: unknown) {
  const resolvedFieldProps = isPlainObject(fieldProps)
    ? (fieldProps as { options?: unknown })
    : undefined;

  if (!resolvedFieldProps || !Array.isArray(resolvedFieldProps.options)) {
    return undefined;
  }

  return resolvedFieldProps.options as TOption[];
}

export function hasOptionsConfig(fieldProps?: unknown) {
  return Array.isArray(getFieldPropsOptions(fieldProps));
}
