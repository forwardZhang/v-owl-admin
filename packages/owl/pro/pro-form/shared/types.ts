import type { ColProps, FormItemProps } from 'antdv-next';
import type { VNodeChild } from 'vue';

/** 字段 path：点路径字符串（'user.age'）或数组（['user', 'age']） */
export type PathLike = string | (string | number)[];

/** 表单当前值集合 */
export type ProFormValues = Record<string, any>;

/**
 * 时间字段映射：提交取值时把范围字段拆成首尾两个字段并格式化。
 * [rangeField, [startField, endField], format?]
 * - rangeField：RangePicker 绑定的字段名（拆分后会从结果里移除）
 * - format：dayjs format，默认 'YYYY-MM-DD HH:mm:ss'；传 null 则保留原始值
 */
export type FieldMappingTime = [string, [string, string], (string | null)?][];

/** createProForm 入参 */
export interface CreateProFormOptions<Values extends ProFormValues = ProFormValues> {
  /** 初始值（reset 会还原到这里） */
  initialValues?: Partial<Values>;
  /** 提交取值时的时间字段映射 */
  fieldMappingTime?: FieldMappingTime;
  /** 校验通过、取值后的提交回调 */
  onSubmit?: (formData: Values) => void | Promise<void>;
  /** 重置后的回调 */
  onReset?: (formData: Values) => void;
  /** 校验失败的回调（antd validateFields 的 reject 内容） */
  onSubmitFailed?: (errorInfo: any) => void;
  /** 值变化回调：(当前表单数据, 变化的 path 数组) */
  onValuesChange?: (formData: Values, changedPaths: string[]) => void;
}

/** 校验规则（保持松类型，避免与 antdv-next RuleObject 强耦合） */
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
export type ProFormRules = ProFormRule[] | ProFormRule | 'required';

/**
 * options 数据源：静态数组 / Promise / 返回它们的函数（函数内读 formData 即可实现联动）。
 * @example source="[...]" | :source="fetchRoles" | :source="() => fetchCities(formData.province)"
 */
export type ProFieldDataSource = any[] | Promise<any> | (() => any | Promise<any>);

/**
 * 远程数据配置：当需要字段别名 / 取数路径时用完整对象，否则直接传数据源即可。
 * @example :source="{ data: fetchProvinces, resultField: 'data.list', labelField: 'name', valueField: 'code' }"
 */
export interface ProFormRequestConfig {
  /** 数据源（数组 / Promise / 函数） */
  data?: ProFieldDataSource;
  /** 从响应体取数组的路径，如 'data.list'；不传则认为数据源本身是数组 */
  resultField?: string;
  /** label 字段别名，默认 'label' */
  labelField?: string;
  /** value 字段别名，默认 'value' */
  valueField?: string;
  /** children 字段别名（树 / 级联用），默认 'children' */
  childrenField?: string;
}

/** 字段 source 属性：数据源，或带字段别名的完整配置 */
export type ProFieldData = ProFieldDataSource | ProFormRequestConfig;

/** label 可为字符串，或自定义渲染函数 */
export type ProFieldLabel = string | (() => VNodeChild);

/** ProForm 自身消费的字段公共 props。 */
export interface ProFieldBaseProps {
  /** 字段路径（对应 formData 上的 key，支持嵌套 'user.age'） */
  path: PathLike;
  /** 标签：字符串或自定义渲染函数 */
  label?: ProFieldLabel;
  /** 标签 tooltip */
  tooltip?: FormItemProps['tooltip'];
  /** 是否必填（内部自动追加 required 规则） */
  required?: boolean;
  /** 校验规则 */
  rules?: ProFormRules;
  /** 帮助提示文案（a-form-item help） */
  help?: FormItemProps['help'];
  /** 额外提示文案（a-form-item extra） */
  extra?: FormItemProps['extra'];
  /** 占位符（缺省由 label 生成） */
  placeholder?: string | [string, string];
  /** 禁用 */
  disabled?: boolean;
  /** 只读（透传给支持的控件） */
  readonly?: boolean;
  /** 是否显示（false 时不渲染） */
  visible?: boolean;
  /** 透传给 a-form-item 的额外 props */
  formItemProps?: Partial<FormItemProps>;
  /** 栅格模式下占据的列数（24 栅格制；与 colProps.span 二选一） */
  span?: number;
  /** 栅格模式下完整列配置（覆盖 pro-form 的默认列） */
  colProps?: ColProps;
}

/**
 * 字段组件 props：公共字段属性 + 底层控件个性属性。
 * 组件个性属性直接放一级，例如 `<ProInput allow-clear :maxlength="20" />`。
 */
export type ProFieldProps<FP = Record<string, any>> = ProFieldBaseProps & FP & Record<string, any>;

/** 带远程 options 的字段 props（select / tree-select / checkbox / radio 等） */
export type ProDataFieldProps<FP = Record<string, any>> = ProFieldProps<FP> & {
  /** options / treeData 数据源（数组 / Promise / 函数 / 带别名的配置） */
  source?: ProFieldData;
};

/** pro-form 注入给字段的栅格 / 表单级配置上下文 */
export interface ProFormConfigContext {
  /** 是否栅格模式 */
  grid: boolean;
  /** 每行列数 */
  cols: number;
  /** 表单级禁用 */
  disabled?: boolean;
}
