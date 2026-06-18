import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import type { FormInstance } from 'antdv-next';
import { get, set } from 'lodash-es';
import { applyFieldMappingTime, cloneDeepSafe, toPathArray } from './utils';
import type { CreateProFormOptions, PathLike, ProFormValues } from './shared/types';

/**
 * ProForm 控制器实例。
 * - `formData`：响应式表单数据，由 createProForm 返回元组的第一项暴露出来
 * - 其余方法均为闭包（已绑定），可安全解构：`const [formData, formApi] = createProForm()`
 */
export interface ProFormApi<Values extends ProFormValues = ProFormValues> {
  /** 响应式表单数据 */
  formData: Values;
  /** 提交中（防重复提交，驱动按钮 loading） */
  submitting: Ref<boolean>;
  /** createProForm 入参 */
  options: CreateProFormOptions<Values>;
  /** 内部：挂载 a-form 实例 */
  mount: (formRef: FormInstance) => void;
  /** 内部：卸载 */
  unmount: () => void;
  /** 读取某字段值 */
  getFieldValue: (path: PathLike) => any;
  /** 设置某字段值 */
  setFieldValue: (path: PathLike, value: any) => void;
  /** 获取经 fieldMappingTime 处理后的全部值 */
  getFieldsValue: <T extends ProFormValues = Values>() => T;
  /** 批量设值；merge=false 时先清空再设 */
  setFieldsValue: (fields: Partial<Values>, merge?: boolean) => void;
  /** 校验（不传=整表，字符串=单字段，数组=多字段） */
  validate: (paths?: PathLike | PathLike[]) => Promise<Values>;
  /** 清空校验态（不改值） */
  restoreValidation: (paths?: PathLike | PathLike[]) => void;
  /** 重置到初始值并清空校验 */
  resetFields: () => void;
  /** 设置新的初始值；setValues 为真时同步还原当前值 */
  setInitialValues: (formData: Partial<Values>, setValues?: boolean) => void;
  /** 校验通过后提交 */
  submit: () => Promise<Values | undefined>;
}

export type ProFormInstance<Values extends ProFormValues = ProFormValues> = ProFormApi<Values>;

export type CreateProFormReturn<Values extends ProFormValues = ProFormValues> = readonly [
  formData: Values,
  formApi: ProFormApi<Values>
];

/** 创建一个 ProForm 控制器 */
export function createProForm<Values extends ProFormValues = ProFormValues>(
  options: CreateProFormOptions<Values> = {}
): CreateProFormReturn<Values> {
  const formData = reactive({}) as Values;
  const submitting = ref(false);

  let formRef: FormInstance | null = null;
  let initialValues = cloneDeepSafe((options.initialValues ?? {}) as Values);
  Object.assign(formData, cloneDeepSafe(initialValues));

  const mount = (inst: FormInstance) => {
    formRef = inst;
  };
  const unmount = () => {
    formRef = null;
  };

  const getFieldValue = (path: PathLike) => get(formData, toPathArray(path));

  const setFieldValue = (path: PathLike, value: any) => {
    set(formData as object, toPathArray(path), value);
  };

  const getFieldsValue = <T extends ProFormValues = Values>(): T => {
    const raw = cloneDeepSafe(formData) as ProFormValues;
    return applyFieldMappingTime(raw, options.fieldMappingTime) as T;
  };

  const setFieldsValue = (fields: Partial<Values>, merge = true) => {
    if (!merge) {
      Object.keys(formData).forEach((key) => {
        delete (formData as Record<string, any>)[key];
      });
    }
    Object.entries(fields).forEach(([key, value]) => {
      set(formData as object, toPathArray(key), value);
    });
  };

  /** 把 validate/restoreValidation 的入参规整成 a-form 的 NamePath[] */
  const toNameList = (paths?: PathLike | PathLike[]): (string | number)[][] | undefined => {
    if (paths == null) return undefined;
    const list = (typeof paths === 'string' ? [paths] : paths) as PathLike[];
    return list.map((p) => toPathArray(p));
  };

  const validate = async (paths?: PathLike | PathLike[]): Promise<Values> => {
    if (!formRef) return getFieldsValue();
    await formRef.validateFields(toNameList(paths) as any);
    return getFieldsValue();
  };

  const restoreValidation = (paths?: PathLike | PathLike[]) => {
    formRef?.clearValidate?.(toNameList(paths) as any);
  };

  const resetFields = () => {
    Object.keys(formData).forEach((key) => {
      delete (formData as Record<string, any>)[key];
    });
    Object.assign(formData, cloneDeepSafe(initialValues));
    formRef?.clearValidate?.();
    options.onReset?.(getFieldsValue());
  };

  const setInitialValues = (nextFormData: Partial<Values>, setValues = true) => {
    initialValues = cloneDeepSafe({ ...initialValues, ...nextFormData });
    if (setValues) resetFields();
  };

  const submit = async (): Promise<Values | undefined> => {
    if (submitting.value) return;
    submitting.value = true;
    try {
      const submittedFormData = await validate();
      await options.onSubmit?.(submittedFormData);
      return submittedFormData;
    } catch (errorInfo) {
      options.onSubmitFailed?.(errorInfo);
      return undefined;
    } finally {
      submitting.value = false;
    }
  };

  const formApi: ProFormApi<Values> = {
    formData,
    submitting,
    options,
    mount,
    unmount,
    getFieldValue,
    setFieldValue,
    getFieldsValue,
    setFieldsValue,
    validate,
    restoreValidation,
    resetFields,
    setInitialValues,
    submit
  };

  return [formData, formApi] as const;
}
