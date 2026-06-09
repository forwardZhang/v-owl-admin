import type { PropType } from 'vue';
import type { ColProps, FormItemProps } from 'antdv-next';
import type { PathLike, ProFieldData, ProFieldLabel, ProFormRules } from '../../types';

/**
 * 所有字段组件（pro-input / pro-select 等）共享的运行时 props。
 * <ProField> 据此声明 props；各字段组件用 TS 泛型 `ProFieldProps<FP>` 声明以获得类型提示。
 */
export const proFieldSharedProps = {
  /** 字段路径（支持嵌套 'user.age'） */
  path: {
    type: [String, Array] as PropType<PathLike>,
    required: true as const
  },
  /** 标签：字符串或自定义渲染函数 */
  label: [String, Function] as PropType<ProFieldLabel>,
  /** 标签 tooltip */
  tooltip: null as unknown as PropType<any>,
  /** 是否必填（自动追加 required 规则） */
  required: Boolean,
  /** 校验规则 */
  rules: [Array, Object, String] as PropType<ProFormRules>,
  /** a-form-item help 文案 */
  help: null as unknown as PropType<any>,
  /** a-form-item extra 文案 */
  extra: null as unknown as PropType<any>,
  /** 透传给底层控件的 props */
  fieldProps: Object as PropType<Record<string, any>>,
  /** 占位符（缺省由各控件按 label 生成） */
  placeholder: [String, Array] as PropType<string | [string, string]>,
  /** 禁用 */
  disabled: { type: Boolean, default: undefined },
  /** 只读 */
  readonly: { type: Boolean, default: undefined },
  /** 是否显示（false 时不渲染） */
  visible: { type: Boolean, default: undefined },
  /** 透传给 a-form-item 的额外 props */
  formItemProps: Object as PropType<Partial<FormItemProps>>,
  /** 栅格列数（24 制；与 colProps.span 二选一） */
  span: Number,
  /** 栅格完整列配置（覆盖 pro-form 默认列） */
  colProps: Object as PropType<ColProps>
} as const;

/**
 * 带远程 options 的字段共享 props（select / tree-select / cascader / checkbox / radio）。
 * 在共享 props 基础上增加 `source`（数据源 / 配置）。
 */
export const proDataFieldSharedProps = {
  ...proFieldSharedProps,
  /** options / treeData 数据源（数组 / Promise / 函数 / 带别名的配置） */
  source: null as unknown as PropType<ProFieldData>
} as const;
