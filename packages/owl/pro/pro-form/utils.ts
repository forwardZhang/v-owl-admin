import type { FieldMappingTime, PathLike, ProFormValues } from './types';

const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/** 判断是否为 dayjs（或类 dayjs，带 format / isValid 方法）的对象 */
export function isDayjsLike(value: any): value is { format: (f: string) => string } {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as any).format === 'function' &&
    typeof (value as any).isValid === 'function'
  );
}

/**
 * 深克隆表单值，但保留 dayjs 实例与非普通对象（File、class 实例等）原样不动，
 * 避免 lodash.cloneDeep 把 dayjs 克隆坏。仅递归普通对象与数组。
 */
export function cloneDeepSafe<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeepSafe(item)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    if (isDayjsLike(value)) return value;
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) {
      const out: Record<string, any> = {};
      for (const key in value as Record<string, any>) {
        out[key] = cloneDeepSafe((value as Record<string, any>)[key]);
      }
      return out as T;
    }
    // 其它 class 实例（dayjs 之外）保持引用
    return value;
  }
  return value;
}

/**
 * 把字段 path 统一成数组形式，供 lodash get/set 与 a-form-item 的 NamePath 使用。
 * 'user.age' -> ['user', 'age']；'list.0.name' -> ['list', 0, 'name']；数组原样返回。
 */
export function toPathArray(path: PathLike): (string | number)[] {
  if (Array.isArray(path)) return path;
  return String(path)
    .split('.')
    .map((seg) => (/^\d+$/.test(seg) ? Number(seg) : seg));
}

/** 把 rules 的 'required' 简写或单条规则，标准化为规则数组 */
export function normalizeRules(rules: any, label?: string): any[] | undefined {
  if (!rules) return undefined;
  if (rules === 'required') {
    return [{ required: true, message: `${label ?? ''}不能为空` }];
  }
  return Array.isArray(rules) ? rules : [rules];
}

/**
 * 提交取值时的时间字段映射：把范围字段拆成首尾两个字段并格式化。
 * 直接在传入对象上做增删（调用方已传克隆值），并返回它。
 */
export function applyFieldMappingTime(
  formData: ProFormValues,
  mapping?: FieldMappingTime
): ProFormValues {
  if (!mapping?.length) return formData;

  mapping.forEach(([rangeField, [startField, endField], format]) => {
    const rangeValue = formData[rangeField];
    delete formData[rangeField];

    if (!Array.isArray(rangeValue) || rangeValue.length !== 2) {
      formData[startField] = undefined;
      formData[endField] = undefined;
      return;
    }

    const fmt = format === undefined ? DEFAULT_TIME_FORMAT : format;
    formData[startField] = formatTime(rangeValue[0], fmt);
    formData[endField] = formatTime(rangeValue[1], fmt);
  });

  return formData;
}

function formatTime(value: any, format: string | null) {
  if (value == null) return undefined;
  // format 为 null 表示保留原值
  if (format === null) return value;
  if (isDayjsLike(value)) return value.format(format);
  return value;
}
