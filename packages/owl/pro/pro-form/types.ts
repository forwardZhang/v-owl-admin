import type { Component } from 'vue';
import type { ButtonProps, ColProps, FormItemProps, FormProps } from 'antdv-next';
import type { ProFormApi } from './form-api';

/** 内置组件名（string 形式，经 adapter 映射到 antdv-next 组件） */
export type ProFormComponentType =
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Textarea'
  | 'AutoComplete'
  | 'Select'
  | 'ApiSelect'
  | 'TreeSelect'
  | 'ApiTreeSelect'
  | 'Cascader'
  | 'RadioGroup'
  | 'CheckboxGroup'
  | 'Checkbox'
  | 'Switch'
  | 'DatePicker'
  | 'RangePicker'
  | 'TimePicker'
  | 'Slider'
  | 'Rate';

/** 组件可以是内置名，也可以直接传入一个 Vue 组件 */
export type ProFormComponent = ProFormComponentType | Component;

/** 表单当前值集合 */
export type ProFormValues = Record<string, any>;

/**
 * 请求配置：把「请求 options」相关的设置统一收敛在这里。
 * 用法：componentProps: { request: { api, params, resultField, labelField, valueField } }
 */
export interface ProFormRequestConfig {
  /** 请求函数 */
  api?: (params?: Record<string, any>) => Promise<any>;
  /** 请求参数（变化会触发重新请求，可由 dependencies 注入实现联动） */
  params?: Record<string, any>;
  /** 从响应体取数组的路径，如 'data.list'；不传则认为响应体本身是数组 */
  resultField?: string;
  /** label 字段别名，默认 'label' */
  labelField?: string;
  /** value 字段别名，默认 'value' */
  valueField?: string;
  /** children 字段别名（树 / 级联用），默认 'children' */
  childrenField?: string;
  /** 是否挂载后立即请求，默认 true */
  immediate?: boolean;
  /** 请求前加工参数 */
  beforeFetch?: (
    params?: Record<string, any>
  ) => Record<string, any> | Promise<Record<string, any>>;
  /** 请求后加工列表 */
  afterFetch?: (list: any[]) => any[];
}

/** componentProps 既可静态对象，也可基于当前值动态计算 */
export type ComponentPropsFn =
  | Record<string, any>
  | ((values: ProFormValues, api: ProFormApi) => Record<string, any>);

/**
 * label 自定义渲染：返回 string / VNode / 任意可渲染内容，
 * 入参为当前表单值与 api，可实现依赖表单值的动态 label。
 */
export type ProFormLabelRender = (values: ProFormValues, api: ProFormApi) => any;

/** antdv-next 校验规则（保持松类型，避免与内部 RuleObject 强耦合） */
export interface ProFormRule {
  required?: boolean;
  message?: string;
  type?: string;
  trigger?: string | string[];
  validator?: (rule: any, value: any) => Promise<void> | void;
  pattern?: RegExp;
  min?: number;
  max?: number;
  len?: number;
  [key: string]: any;
}

/** rules：规则数组、单条规则，或 'required' 简写 */
export type ProFormSchemaRules = ProFormRule[] | ProFormRule | 'required';

/**
 * 字段联动：当 triggerFields 中任意字段变化时，重新计算目标字段的
 * 显示 / 禁用 / 必填 / 规则 / 组件 props。
 */
export interface ProFormItemDependencies {
  /** 触发重算的字段名（语义标注；computed 已天然响应所有引用） */
  triggerFields: string[];
  /** 返回 false 时隐藏该字段（且不收集值） */
  show?: (values: ProFormValues, api: ProFormApi) => boolean;
  /** 动态禁用 */
  disabled?: (values: ProFormValues, api: ProFormApi) => boolean;
  /** 动态必填 */
  required?: (values: ProFormValues, api: ProFormApi) => boolean;
  /** 动态规则 */
  rules?: (values: ProFormValues, api: ProFormApi) => ProFormRule[];
  /** 动态组件 props */
  componentProps?: (values: ProFormValues, api: ProFormApi) => Record<string, any>;
}

/** 单个表单项定义 */
export interface ProFormSchema {
  /** 字段名（对应 model 上的 key） */
  fieldName: string;
  /** 标签：文本，或自定义渲染函数 (values, api) => VNode/string（可依赖表单值） */
  label?: string | ProFormLabelRender;
  /** 使用的组件 */
  component: ProFormComponent;
  /** 组件 props（静态或动态） */
  componentProps?: ComponentPropsFn;
  /** 校验规则 */
  rules?: ProFormSchemaRules;
  /** 默认值 */
  defaultValue?: any;
  /** 是否隐藏（仍会保留 / 收集值，区别于 dependencies.show） */
  hide?: boolean;
  /** 帮助 / 错误提示文案 */
  help?: string;
  /** 字段联动 */
  dependencies?: ProFormItemDependencies;
  /** 透传给 a-form-item 的额外 props（colon/extra/tooltip/labelCol 等） */
  formItemProps?: Partial<FormItemProps>;
  /** 栅格模式下该项占据的列配置（覆盖表单级 colProps），如 { span: 8 } 或响应式 { xs: 24, md: 12 } */
  colProps?: ColProps;
}

/**
 * 时间字段映射：提交取值时把范围字段拆成首尾两个字段并格式化。
 * [rangeField, [startField, endField], format?]
 * - rangeField：RangePicker 绑定的字段名（拆分后会从结果里移除）
 * - format：dayjs format，默认 'YYYY-MM-DD HH:mm:ss'；传 null 则保留原始值
 */
export type FieldMappingTime = [string, [string, string], (string | null)?][];

/** 操作按钮配置 */
export interface ActionButtonOptions extends Partial<ButtonProps> {
  /** 按钮文案 */
  content?: string;
  /** 是否显示 */
  show?: boolean;
}

/** 统一作用于每个表单项的公共配置 */
export interface ProFormCommonConfig {
  componentProps?: Record<string, any>;
  formItemProps?: Partial<FormItemProps>;
  /** 统一标签宽度（等价于 labelCol，二选一） */
  labelWidth?: number;
  /** 统一禁用 */
  disabled?: boolean;
  /** 统一栅格列配置 */
  colProps?: ColProps;
}

/** ProForm 组件 / useProForm 入参 */
export interface ProFormProps {
  /** 表单项 schema */
  schema: ProFormSchema[];

  /* ---- 透传 a-form ---- */
  layout?: FormProps['layout'];
  labelCol?: ColProps;
  wrapperCol?: ColProps;
  /** 标签宽度（与 labelCol 二选一，简化写法） */
  labelWidth?: number;
  colon?: boolean;
  disabled?: boolean;
  name?: string;

  /** 公共配置 */
  commonConfig?: ProFormCommonConfig;

  /* ---- 栅格布局 ---- */
  /** 开启 Row/Col 栅格布局 */
  grid?: boolean;
  /** 栅格列间距，默认 [16, 0] */
  gutter?: number | [number, number];
  /** 表单级默认列配置，默认 { span: 8 }（每行 3 列） */
  colProps?: ColProps;
  /** 显示「展开 / 收起」按钮（搜索表单常用，需配合 grid） */
  showCollapseButton?: boolean;
  /** 收起时保留的行数，默认 1 */
  collapsedRows?: number;
  /** 是否默认收起，默认 true */
  defaultCollapsed?: boolean;

  /* ---- 操作按钮 ---- */
  showDefaultActions?: boolean;
  submitButtonOptions?: ActionButtonOptions;
  resetButtonOptions?: ActionButtonOptions;
  /** 反转 提交/重置 顺序 */
  actionButtonsReverse?: boolean;
  /** 操作区容器 class */
  actionWrapperClass?: string;

  /* ---- 行为 ---- */
  /** 值变化即提交（搜索表单常用） */
  submitOnChange?: boolean;
  /** 回车提交 */
  submitOnEnter?: boolean;
  /** 提交取值时的时间字段映射 */
  fieldMappingTime?: FieldMappingTime;

  /* ---- 回调 ---- */
  handleSubmit?: (values: ProFormValues) => void | Promise<void>;
  handleReset?: (values: ProFormValues) => void | Promise<void>;
  handleValuesChange?: (values: ProFormValues, changedFields: string[]) => void;
}

/** useProForm 返回的元组 */
export type UseProFormReturn = readonly [Component, ProFormApi];
