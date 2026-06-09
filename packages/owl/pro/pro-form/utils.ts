/**
 * 浅克隆表单值。
 * model 是扁平的 field -> value 结构；用浅克隆即可，
 * 同时避免 lodash.cloneDeep 把 dayjs 实例克隆坏。
 */
export function cloneDeep<T extends Record<string, any>>(obj: T): T {
  return { ...obj };
}

/** 判断是否为 dayjs（或类 dayjs，带 format 方法）的对象 */
export function isDayjsLike(value: any): value is { format: (f: string) => string } {
  return (
    !!value &&
    typeof value === 'object' &&
    typeof (value as any).format === 'function' &&
    typeof (value as any).isValid === 'function'
  );
}

/** 把 rules 的 'required' 简写或单条规则，标准化为规则数组 */
export function normalizeRules(rules: any, label?: string): any[] | undefined {
  if (!rules) return undefined;
  if (rules === 'required') {
    return [{ required: true, message: `${label ?? ''}不能为空` }];
  }
  return Array.isArray(rules) ? rules : [rules];
}
