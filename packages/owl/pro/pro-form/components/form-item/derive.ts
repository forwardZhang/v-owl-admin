import { getValuePropName, isFullWidthComponent, resolveComponent } from '../registry';
import { normalizeRules } from '../../utils';
import type { ProFormApi } from '../../form-api';
import type { ProFormCommonConfig, ProFormSchema } from '../../types';

export interface DerivedFormItem {
  show: boolean;
  component: ReturnType<typeof resolveComponent>;
  valueProp: string;
  disabled?: boolean;
  rules?: any[];
  formItemProps: Record<string, any>;
  componentProps: Record<string, any>;
}

/** 仅判断该项是否显示（栅格模式下父级用它过滤空列） */
export function isItemVisible(item: ProFormSchema, api: ProFormApi): boolean {
  return item.dependencies?.show ? item.dependencies.show(api.model, api) : true;
}

/**
 * 基于当前表单值，计算单个表单项的最终渲染属性（含 dependencies 联动）。
 * request 配置在 common / schema / dependencies 三层之间做深合并，
 * 这样 dependencies 只需注入 request.params 即可触发联动请求。
 */
export function deriveFormItem(
  item: ProFormSchema,
  common: ProFormCommonConfig,
  api: ProFormApi
): DerivedFormItem {
  const values = api.model;
  const dep = item.dependencies;

  const show = dep?.show ? dep.show(values, api) : true;
  const depDisabled = dep?.disabled ? dep.disabled(values, api) : undefined;
  const depRequired = dep?.required ? dep.required(values, api) : undefined;
  const depRules = dep?.rules ? dep.rules(values, api) : undefined;
  const depProps = dep?.componentProps ? dep.componentProps(values, api) : undefined;

  const baseProps =
    typeof item.componentProps === 'function'
      ? item.componentProps(values, api)
      : (item.componentProps ?? {});

  // rules 合并：dependencies.rules 覆盖 schema.rules；depRequired 追加 required 规则
  let rules = depRules ?? normalizeRules(item.rules, labelText(item));
  if (depRequired != null) {
    rules = [
      ...(rules ?? []),
      ...(depRequired ? [{ required: true, message: `${labelText(item)}不能为空` }] : [])
    ];
  }

  const fullWidthStyle = isFullWidthComponent(item.component) ? { width: '100%' } : undefined;

  const componentProps: Record<string, any> = {
    style: fullWidthStyle,
    ...common.componentProps,
    ...baseProps,
    ...depProps
  };

  // request 三层深合并（common -> schema -> dependencies），便于联动只注入 params
  if (common.componentProps?.request || baseProps.request || depProps?.request) {
    componentProps.request = {
      ...common.componentProps?.request,
      ...baseProps.request,
      ...depProps?.request
    };
  }

  return {
    show,
    component: resolveComponent(item.component),
    valueProp: getValuePropName(item.component),
    disabled: depDisabled ?? common.disabled,
    rules,
    formItemProps: { ...common.formItemProps, ...item.formItemProps },
    componentProps
  };
}

/** label 若是函数（自定义渲染）则取不到文案，用于校验提示时回退为空串 */
function labelText(item: ProFormSchema): string {
  return typeof item.label === 'string' ? item.label : '';
}
