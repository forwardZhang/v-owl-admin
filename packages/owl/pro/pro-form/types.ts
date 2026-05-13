import type { Component, Ref, ShallowRef, VNodeChild } from 'vue';
import type { FormInstance, FormItemProps, FormProps } from 'antdv-next';

/**
 * 表单字段路径，兼容 antdv-next Form 的 name path 设计。
 */
export type ProFormNamePath = string | number | Array<string | number>;

export interface ProFormFinishFailedInfo {
  errorFields?: Array<{
    errors?: string[];
    name?: ProFormNamePath;
    warnings?: string[];
  }>;
  outOfDate?: boolean;
  values?: Record<string, unknown>;
}

export type ProFieldType =
  | 'input'
  | 'password'
  | 'textarea'
  | 'checkbox'
  | 'checkbox-group'
  | 'radio'
  | 'radio-group'
  | 'select';

/**
 * 在 antdv-next FormItem 的基础上新增的扩展属性。
 */
export interface ProFormItemProps extends FormItemProps {
  /**
   * title 作为 label 的别名，便于和业务字段配置保持一致。
   */
  title?: string;
  /**
   * 预留给 FormItem 的 tooltip 配置，统一从 ProFormItem 这一层透传。
   */
  tooltip?: FormItemProps['tooltip'];
}

export interface ProFieldOption {
  label: VNodeChild;
  value: unknown;
  disabled?: boolean;
  title?: string;
  class?: string;
  style?: Record<string, unknown>;
  id?: string;
}

export interface ProFieldRequestContext<
  TValues extends Record<string, unknown> = Record<string, unknown>
> {
  form: CreateProFormReturn<TValues>;
  values: TValues;
  dependencyValues: Record<string, unknown>;
}

export type ProFieldRequest<
  TOption = ProFieldOption,
  TValues extends Record<string, unknown> = Record<string, unknown>
> = (context: ProFieldRequestContext<TValues>) => Promise<TOption[]> | TOption[];

export interface ProFieldComponentProps<TFieldProps = Record<string, unknown>> {
  /**
   * 透传给具体输入控件的属性，例如 Input / Select / Checkbox 的原生 props。
   */
  fieldProps?: TFieldProps;
  /**
   * 透传给 ProFormItem 的属性，用于控制 label、rules、extra、tooltip 等行为。
   */
  formItemProps?: Partial<ProFormItemProps>;
  /**
   * 字段隐藏时不渲染整个 FormItem。
   */
  hidden?: boolean;
  /**
   * 字段标题，默认同时作为 FormItem 的 label 文案来源。
   */
  label?: string;
  /**
   * 对应 Form model 的字段路径。
   */
  name: ProFormNamePath;
  /**
   * 自定义占位文案；未传时会根据 label 自动生成。
   */
  placeholder?: string;
}

export interface ProChoiceFieldProps<
  TFieldProps = Record<string, unknown>,
  TOption = ProFieldOption
> extends ProFieldComponentProps<TFieldProps> {
  /**
   * 直接配置静态选项，适用于 select / checkbox-group / radio-group 等场景。
   */
  options?: TOption[];
  /**
   * 组件内部请求远程选项；依赖项变化后会自动重新拉取。
   */
  request?: ProFieldRequest<TOption>;
  /**
   * 选项请求依赖的字段路径列表。
   */
  dependencies?: ProFormNamePath[];
}

export interface ProFieldProps extends ProChoiceFieldProps {
  /**
   * 自定义渲染组件，优先级高于内置 type 映射。
   */
  component?: Component;
  /**
   * 内置字段类型，通过类型映射选择具体组件。
   */
  type?: ProFieldType;
}

export interface SetInitialValuesOptions {
  /**
   * 更新初始值后，是否同步把当前字段值重置为最新初始值。
   */
  updateFields?: boolean;
}

export interface CreateProFormOptions<
  TValues extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * 表单初始化快照，同时也是 restore/reset 的回退基准。
   */
  initialValues?: Partial<TValues>;
  /**
   * 提交成功回调，对应 antdv-next Form 的 finish。
   */
  onFinish?: (values: TValues) => void | Promise<void>;
  /**
   * 提交失败回调，对应 antdv-next Form 的 finishFailed。
   */
  onFinishFailed?: (errorInfo: ProFormFinishFailedInfo) => void;
  /**
   * 字段或整表恢复到初始值后的统一回调。
   */
  onReset?: () => void;
}

export interface ProFormHook<TPayload> {
  /**
   * 注册事件订阅，返回取消订阅函数。
   */
  (handler: (payload: TPayload) => void): () => void;
}

export interface CreateProFormReturn<
  TValues extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * 当前挂载的 Form 实例引用，供内部校验、重置、提交复用。
   */
  formRef: Readonly<ShallowRef<FormInstance | undefined>>;
  /**
   * 初始值快照，用于 restore/reset 相关能力。
   */
  initialValues: Readonly<Ref<Partial<TValues>>>;
  /**
   * 提交态开关，常用于防止重复提交。
   */
  loading: Readonly<Ref<boolean>>;
  /**
   * 响应式表单值对象，推荐页面层直接消费这一份 model。
   */
  values: TValues;
  /**
   * 清空指定字段或整表的校验状态。
   */
  clearValidate: (nameList?: ProFormNamePath[]) => void;
  /**
   * 获取指定字段当前值。
   */
  getFieldValue: <TValue = unknown>(name: ProFormNamePath) => TValue | undefined;
  /**
   * 与 restoreFieldsValue 语义保持一致的重置入口。
   */
  resetFields: (nameList?: ProFormNamePath[]) => void;
  /**
   * 把单字段恢复到初始值，并清掉该字段校验状态。
   */
  restoreFieldValue: (name: ProFormNamePath) => void;
  /**
   * 把指定字段或整表恢复到初始值，并清掉对应校验状态。
   */
  restoreFieldsValue: (nameList?: ProFormNamePath[]) => void;
  /**
   * 设置单字段值，同时同步写回到底层 Form 实例。
   */
  setFieldValue: (name: ProFormNamePath, value: unknown) => void;
  /**
   * 批量设置字段值，同时同步写回到底层 Form 实例。
   */
  setFieldsValue: (nextValues: Partial<TValues>) => void;
  /**
   * 更新初始值快照，可选择是否立刻覆盖当前值。
   */
  setInitialValues: (
    nextInitialValues: Partial<TValues>,
    options?: SetInitialValuesOptions
  ) => void;
  /**
   * 外部手动控制提交态。
   */
  setLoading: (loading: boolean) => void;
  /**
   * 触发表单提交，最终复用 antdv-next Form 的 submit 流程。
   */
  submit: () => void;
  /**
   * 校验整个表单并返回当前值。
   */
  validate: () => Promise<TValues>;
  /**
   * 校验指定字段，未挂载 Form 实例时回退返回当前 values 快照。
   */
  validateFields: (nameList?: ProFormNamePath[], options?: unknown) => Promise<Partial<TValues>>;
  onFinish: ProFormHook<TValues>;
  onFinishFailed: ProFormHook<ProFormFinishFailedInfo>;
  onReset: ProFormHook<void>;
  /**
   * 内部桥接对象，给 ProForm 容器和字段层注册真实 Form 实例与事件触发器。
   */
  __INTERNAL__: {
    setFormInstance: (instance?: FormInstance) => void;
    triggerFinish: (values: TValues) => void;
    triggerFinishFailed: (errorInfo: ProFormFinishFailedInfo) => void;
    triggerReset: () => void;
  };
}

export interface ProFormProps extends Omit<FormProps, 'model'> {
  /**
   * createProForm 返回的控制器实例。
   */
  form: CreateProFormReturn;
  /**
   * 提交中状态，会同步写入 form.loading。
   */
  loading?: boolean;
}
