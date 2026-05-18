import type {
  AutoCompleteProps,
  ButtonProps,
  CascaderProps,
  CheckboxGroupProps,
  CheckboxProps,
  ColProps,
  DatePickerProps,
  FormInstance,
  FormItemProps,
  FormProps,
  InputPasswordProps,
  InputProps,
  InputNumberProps,
  RadioGroupProps,
  RadioProps,
  RangePickerProps,
  RowProps,
  SelectProps,
  SwitchProps,
  TextAreaProps,
  TimePickerProps,
  TreeSelectProps
} from 'antdv-next';
import type { Component, Ref, VNodeChild } from 'vue';

export type ProFormNamePath = string | number | Array<string | number>;

export type BaseFormComponentType =
  | 'ApiCascader'
  | 'ApiSelect'
  | 'ApiTreeSelect'
  | 'AutoComplete'
  | 'Cascader'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Select'
  | 'Switch'
  | 'TextArea'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | (Record<never, never> & string);

export type ApiComponentOptionsItem = {
  [name: string]: unknown;
  children?: ApiComponentOptionsItem[];
  disabled?: boolean;
  label?: string;
  value?: number | string;
};

export type ApiComponentLabelFn = (item: ApiComponentOptionsItem) => string;

export interface ApiComponentProps {
  afterFetch?: (value: unknown) => PromiseLike<unknown> | unknown;
  alwaysLoad?: boolean;
  api?: (
    arg?: Record<string, unknown>
  ) =>
    | Promise<ApiComponentOptionsItem[] | Record<string, unknown>>
    | ApiComponentOptionsItem[]
    | Record<string, unknown>;
  autoSelect?:
    | 'first'
    | 'last'
    | 'one'
    | ((item: ApiComponentOptionsItem[]) => ApiComponentOptionsItem)
    | false;
  beforeFetch?: (
    value: Record<string, unknown>
  ) => PromiseLike<Record<string, unknown>> | Record<string, unknown>;
  childrenField?: string;
  component: Component;
  disabledField?: string;
  immediate?: boolean;
  labelField?: string;
  labelFn?: ApiComponentLabelFn;
  loadingSlot?: string;
  modelPropName?: string;
  numberToString?: boolean;
  options?: ApiComponentOptionsItem[];
  optionsPropName?: string;
  params?: Record<string, unknown>;
  resultField?: string;
  shouldFetch?: (value: Record<string, unknown>) => PromiseLike<boolean> | boolean;
  valueField?: string;
  visibleEvent?: string;
}

export type ApiComponentSharedProps = Omit<ApiComponentProps, 'component'>;

export interface BuiltinComponentProps {
  ApiCascader: ApiComponentSharedProps & CascaderProps;
  ApiSelect: ApiComponentSharedProps & SelectProps;
  ApiTreeSelect: ApiComponentSharedProps & TreeSelectProps;
  AutoComplete: AutoCompleteProps;
  Cascader: CascaderProps;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps;
  DatePicker: DatePickerProps;
  Input: InputProps;
  InputNumber: InputNumberProps;
  InputPassword: InputPasswordProps;
  Radio: RadioProps;
  RadioGroup: RadioGroupProps;
  RangePicker: RangePickerProps;
  Select: SelectProps;
  Switch: SwitchProps;
  TextArea: TextAreaProps;
  Textarea: TextAreaProps;
  TimePicker: TimePickerProps;
  TreeSelect: TreeSelectProps;
}

export type FormLayout = NonNullable<FormProps['layout']>;

export type FormRules = FormProps['rules'];

export type FormSchemaRule = NonNullable<FormItemProps['rules']>;

export type FormItemClass = string | string[] | Record<string, boolean>;

export type FormActionButtonOptions = ButtonProps & {
  show?: boolean;
  text?: string;
};

export type DynamicFormContext<TValues extends Record<string, unknown>> = {
  api: FormApi<TValues>;
  fieldName?: ProFormNamePath;
  schema?: FormSchema<BaseFormComponentType, BuiltinComponentProps, TValues>;
  value?: unknown;
  values: TValues;
};

export type MaybeDynamic<TValue, TValues extends Record<string, unknown>> =
  | TValue
  | ((ctx: DynamicFormContext<TValues>) => TValue);

export type RenderContent = string | (() => VNodeChild) | VNodeChild;

export type FormComponentSlot<TValues extends Record<string, unknown> = Record<string, unknown>> = (
  ctx: DynamicFormContext<TValues> & { slotProps?: unknown }
) => VNodeChild;

export type ComponentPropsGetter<TProps extends object, TValues extends Record<string, unknown>> = (
  ctx: DynamicFormContext<TValues>
) => Partial<TProps> & Record<string, unknown>;

export type ComponentProps<
  TProps extends object = Record<string, unknown>,
  TValues extends Record<string, unknown> = Record<string, unknown>
> = (Partial<TProps> & Record<string, unknown>) | ComponentPropsGetter<TProps, TValues>;

export type DependencyResolver<TValue, TValues extends Record<string, unknown>> =
  | TValue
  | ((ctx: DynamicFormContext<TValues>) => PromiseLike<TValue> | TValue);

export interface FormItemDependencies<
  TProps extends object = Record<string, unknown>,
  TValues extends Record<string, unknown> = Record<string, unknown>
> {
  componentProps?: DependencyResolver<Partial<TProps> & Record<string, unknown>, TValues>;
  disabled?: DependencyResolver<boolean, TValues>;
  if?: DependencyResolver<boolean, TValues>;
  required?: DependencyResolver<boolean, TValues>;
  rules?: DependencyResolver<FormSchemaRule | undefined, TValues>;
  show?: DependencyResolver<boolean, TValues>;
  trigger?: (ctx: DynamicFormContext<TValues>) => PromiseLike<void> | void;
  triggerFields: ProFormNamePath[];
}

export interface FormCommonConfig<
  TValues extends Record<string, unknown> = Record<string, unknown>
> {
  colProps?: ColProps;
  componentProps?: ComponentProps<Record<string, unknown>, TValues>;
  disabled?: boolean;
  formItemClass?: MaybeDynamic<FormItemClass, TValues>;
  formItemProps?: Partial<FormItemProps>;
  hideLabel?: boolean;
  labelCol?: FormProps['labelCol'];
  labelWidth?: number | string;
  modelPropName?: string;
  wrapperCol?: FormProps['wrapperCol'];
}

export interface FormSchemaBody<
  TProps extends object,
  TValues extends Record<string, unknown>
> extends Omit<FormCommonConfig<TValues>, 'componentProps'> {
  colProps?: ColProps;
  /**
   * 传给字段组件的 props，支持对象或基于当前表单上下文动态返回。
   * 表单值和 `onUpdate:*` 会由 ProForm 自动注入，这里只放业务组件自己的配置。
   */
  componentProps?: ComponentProps<TProps, TValues>;
  /**
   * 传给字段组件内部的插槽内容。
   * 这里直接声明组件支持的插槽，例如 Input 的 `prefix`、Select 的 `suffixIcon`。
   * 这是组件自己的插槽，不是 FormItem 内容区的 template 插槽。
   */
  componentSlots?: Record<string, FormComponentSlot<TValues>>;
  defaultValue?: unknown;
  dependencies?: FormItemDependencies<TProps, TValues>;
  fieldName: ProFormNamePath;
  formItemProps?: Partial<FormItemProps>;
  help?: MaybeDynamic<VNodeChild, TValues>;
  hidden?: MaybeDynamic<boolean, TValues>;
  label?: MaybeDynamic<VNodeChild, TValues>;
  required?: MaybeDynamic<boolean, TValues>;
  rules?: FormSchemaRule;
  show?: MaybeDynamic<boolean, TValues>;
}

type FormSchemaDiscriminated<
  T extends BaseFormComponentType,
  P extends object,
  TValues extends Record<string, unknown>
> = {
  [K in Extract<keyof P, T>]: {
    /**
     * 字段类型。传内置组件名时，会从 ProForm 组件适配器里取真实组件。
     */
    type: K;
  } & FormSchemaBody<P[K] extends object ? P[K] : Record<string, unknown>, TValues>;
}[Extract<keyof P, T>];

type FormCustomComponentSchema<TValues extends Record<string, unknown>> = {
  /**
   * 自定义字段类型。只有 custom 才支持 component。
   */
  type: 'custom';
  /**
   * 自定义字段组件。ProForm 仍会自动注入值和 `onUpdate:*`。
   */
  component: Component;
  slot?: never;
} & FormSchemaBody<Record<string, unknown>, TValues>;

type FormSlotSchemaBody<TValues extends Record<string, unknown>> = Omit<
  FormSchemaBody<Record<string, unknown>, TValues>,
  'componentProps' | 'componentSlots' | 'modelPropName'
>;

type FormCustomSlotSchema<TValues extends Record<string, unknown>> = {
  /**
   * 自定义字段类型。只有 custom 才支持 slot。
   */
  type: 'custom';
  component?: never;
  /**
   * FormItem 内容区使用的父级 template 插槽名。
   * 例如 schema 声明 `slot: 'test-component'` 时，父级可写
   * `<template #test-component="{ schema, api }">...</template>` 渲染该字段内容。
   * slot 渲染的是 FormItem 内容区，不接收 componentProps、componentSlots、modelPropName。
   */
  slot: string;
} & FormSlotSchemaBody<TValues>;

type FormCustomSchema<TValues extends Record<string, unknown>> =
  | FormCustomComponentSchema<TValues>
  | FormCustomSlotSchema<TValues>;

export type FormSchema<
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends object = BuiltinComponentProps,
  TValues extends Record<string, unknown> = Record<string, unknown>
> = FormSchemaDiscriminated<T, P, TValues> | FormCustomSchema<TValues>;

export interface ProFormProps<
  TValues extends Record<string, unknown> = Record<string, unknown>
> extends Omit<FormProps, 'model'> {
  actionButtonsReverse?: boolean;
  actionPosition?: 'center' | 'left' | 'right';
  commonConfig?: FormCommonConfig<TValues>;
  formApi: FormApi<TValues>;
  resetButtonOptions?: FormActionButtonOptions;
  rowProps?: RowProps;
  schema?: FormSchema<BaseFormComponentType, BuiltinComponentProps, TValues>[];
  showDefaultActions?: boolean;
  submitButtonOptions?: FormActionButtonOptions;
  wrapperClass?: FormItemClass;
}

export interface UseProFormOptions<
  TValues extends Record<string, unknown> = Record<string, unknown>
> extends Omit<ProFormProps<TValues>, 'formApi'> {
  handleReset?: (values: TValues) => void | Promise<void>;
  handleSubmit?: (values: TValues) => void | Promise<void>;
  handleValuesChange?: (values: TValues, changedFields: ProFormNamePath[]) => void;
  initialValues?: Partial<TValues>;
}

export interface FormApi<TValues extends Record<string, unknown> = Record<string, unknown>> {
  formRef: Ref<FormInstance | undefined>;
  values: TValues;
  getState: () => UseProFormOptions<TValues>;
  getValues: () => TValues;
  removeSchemaByFields: (fields: ProFormNamePath[]) => void;
  resetForm: () => void;
  setFormInstance: (instance?: FormInstance) => void;
  setFieldValue: (field: ProFormNamePath, value: unknown) => void;
  setFieldsValue: (fields: Partial<TValues>) => void;
  setState: (
    stateOrFn:
      | ((prev: UseProFormOptions<TValues>) => Partial<UseProFormOptions<TValues>>)
      | Partial<UseProFormOptions<TValues>>
  ) => void;
  setValues: (fields: Partial<TValues>) => void;
  submitForm: () => Promise<TValues>;
  updateSchema: (
    schema: Partial<FormSchema<BaseFormComponentType, BuiltinComponentProps, TValues>>[]
  ) => void;
  validate: () => Promise<TValues>;
  validateField: (fieldName: ProFormNamePath) => Promise<unknown>;
}
