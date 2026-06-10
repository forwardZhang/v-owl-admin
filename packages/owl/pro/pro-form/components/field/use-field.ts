import { computed, inject } from 'vue';
import type { ComputedRef } from 'vue';
import type { ColProps } from 'antdv-next';
import { get, set } from 'lodash-es';
import { proFormConfigKey, proFormKey } from '../../context';
import { normalizeRules, toPathArray } from '../../utils';
import type { ProFieldProps, ProFormConfigContext } from '../../types';

const EMPTY_CONFIG: ProFormConfigContext = { grid: false, cols: 3, disabled: undefined };

/**
 * 字段派生逻辑：取值（按 path 读写 formData）、规则合并、栅格列、可见性、
 * 以及给 a-form-item / 控件的最终绑定。供 <ProField> 使用。
 */
export function useField(props: ProFieldProps) {
  const form = inject(proFormKey, null);
  const config: ComputedRef<ProFormConfigContext> = inject(
    proFormConfigKey,
    computed(() => EMPTY_CONFIG)
  ) as ComputedRef<ProFormConfigContext>;

  if (!form) {
    console.warn('[ProForm] 字段组件必须用在 <pro-form> 内部，且 pro-form 需绑定 :form。');
  }

  const namePath = computed(() => toPathArray(props.path));

  /** 取值：直接读写 formData 上的 path */
  const value = computed({
    get: () => (form ? get(form.formData, namePath.value) : undefined),
    set: (v) => {
      if (form) set(form.formData as object, namePath.value, v);
    }
  });

  function setValue(v: any) {
    value.value = v;
  }

  const show = computed(() => props.visible !== false);

  const mergedDisabled = computed(() => props.disabled ?? config.value.disabled);

  /** label 为函数时走自定义渲染 */
  const labelIsFn = computed(() => typeof props.label === 'function');
  const labelText = computed(() => (typeof props.label === 'string' ? props.label : ''));

  /** rules：required 简写 + 用户 rules */
  const mergedRules = computed(() => {
    const list: any[] = [];
    if (props.required) {
      list.push({ required: true, message: `${labelText.value}不能为空` });
    }
    const userRules = normalizeRules(props.rules, labelText.value);
    if (userRules) list.push(...userRules);
    return list.length ? list : undefined;
  });

  /** 栅格列配置：colProps > span > pro-form 默认列（24/cols） */
  const colProps = computed<ColProps>(() => {
    if (props.colProps) return props.colProps;
    if (props.span != null) return { span: props.span };
    const cols = config.value.cols || 1;
    return { span: Math.max(1, Math.round(24 / cols)) };
  });

  /** a-form-item 的绑定（label 为函数时不走 label prop，改用 #label 插槽） */
  const formItemBindings = computed(() => ({
    name: namePath.value,
    label: labelIsFn.value ? undefined : labelText.value || undefined,
    rules: mergedRules.value,
    tooltip: props.tooltip,
    help: props.help,
    extra: props.extra,
    ...props.formItemProps
  }));

  return {
    form,
    config,
    show,
    value,
    setValue,
    mergedDisabled,
    labelIsFn,
    colProps,
    formItemBindings
  };
}
