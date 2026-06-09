import { reactive } from 'vue';
import type { FormInstance } from 'antdv-next';
import { cloneDeep, isDayjsLike } from './utils';
import type { FieldMappingTime, ProFormProps, ProFormSchema, ProFormValues } from './types';

const DEFAULT_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/**
 * ProForm 的命令式 API。
 * 持有响应式的 model（表单值）与 state（schema 等配置），并在挂载后接管 antdv-next FormInstance。
 */
export class ProFormApi {
  /** 响应式表单值 */
  public model: ProFormValues = reactive({});

  /** 响应式表单配置（schema、按钮、布局等） */
  public state: ProFormProps;

  /** 挂载后注入的 antdv-next 表单实例 */
  public formRef: FormInstance | null = null;

  public isMounted = false;

  private latestSubmissionValues: ProFormValues | null = null;

  constructor(options: ProFormProps) {
    this.state = reactive({ ...options }) as ProFormProps;
    this.initModelFromSchema(this.state.schema);
  }

  /** 用 schema 的 defaultValue 初始化 model（不覆盖已有值） */
  private initModelFromSchema(schema: ProFormSchema[]) {
    schema.forEach((item) => {
      if (!(item.fieldName in this.model)) {
        this.model[item.fieldName] = item.defaultValue ?? undefined;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 生命周期                                                            */
  /* ------------------------------------------------------------------ */

  public mount(formRef: FormInstance) {
    this.formRef = formRef;
    this.isMounted = true;
  }

  public unmount() {
    this.formRef = null;
    this.isMounted = false;
  }

  /* ------------------------------------------------------------------ */
  /* 取值 / 设值                                                         */
  /* ------------------------------------------------------------------ */

  /** 获取（经 fieldMappingTime 处理后的）表单值 */
  public getValues<T extends ProFormValues = ProFormValues>(): T {
    const values = cloneDeep(this.model) as ProFormValues;
    return this.applyFieldMappingTime(values) as T;
  }

  public getFieldValue(field: string) {
    return this.model[field];
  }

  /** 批量设值；merge=false 时先清空再设 */
  public setValues(fields: ProFormValues, merge = true) {
    if (!merge) {
      Object.keys(this.model).forEach((key) => {
        this.model[key] = undefined;
      });
    }
    Object.entries(fields).forEach(([key, value]) => {
      this.model[key] = value;
    });
  }

  public setFieldValue(field: string, value: any, shouldValidate = false) {
    this.model[field] = value;
    if (shouldValidate) {
      void this.validateField(field);
    }
  }

  public getLatestSubmissionValues() {
    return this.latestSubmissionValues;
  }

  /* ------------------------------------------------------------------ */
  /* schema / state                                                      */
  /* ------------------------------------------------------------------ */

  public getState() {
    return this.state;
  }

  public setState(
    stateOrFn: Partial<ProFormProps> | ((prev: ProFormProps) => Partial<ProFormProps>)
  ) {
    const patch = typeof stateOrFn === 'function' ? stateOrFn(this.state) : stateOrFn;
    Object.assign(this.state, patch);
  }

  /** 按 fieldName 合并更新若干 schema 项 */
  public updateSchema(partials: Array<Partial<ProFormSchema> & { fieldName: string }>) {
    const map = new Map(partials.map((p) => [p.fieldName, p]));
    this.state.schema = this.state.schema.map((item) => {
      const patch = map.get(item.fieldName);
      return patch ? { ...item, ...patch } : item;
    });
    // 新增字段补默认值
    partials.forEach((p) => {
      if (!(p.fieldName in this.model)) {
        this.model[p.fieldName] = p.defaultValue ?? undefined;
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 校验 / 提交 / 重置                                                   */
  /* ------------------------------------------------------------------ */

  public async validate(): Promise<ProFormValues> {
    if (!this.formRef) return {};
    return this.formRef.validateFields();
  }

  public async validateField(field: string) {
    if (!this.formRef) return;
    return this.formRef.validateFields([field]);
  }

  public async isFieldValid(field: string) {
    try {
      await this.validateField(field);
      return true;
    } catch {
      return false;
    }
  }

  public resetValidate(fields?: string[]) {
    this.formRef?.clearValidate?.(fields);
  }

  /** 校验通过后提交 */
  public async submitForm(e?: Event) {
    e?.preventDefault?.();
    await this.validate();
    const values = this.getValues();
    this.latestSubmissionValues = values;
    await this.state.handleSubmit?.(values);
    return values;
  }

  /** validate + submit 的别名 */
  public async validateAndSubmitForm() {
    return this.submitForm();
  }

  /** 重置表单值与校验态 */
  public async resetForm() {
    this.formRef?.resetFields?.();
    // resetFields 会把 model 复位为初始 :model 状态；这里再按 defaultValue 兜底
    this.state.schema.forEach((item) => {
      this.model[item.fieldName] = item.defaultValue ?? undefined;
    });
    await this.state.handleReset?.(this.getValues());
  }

  /* ------------------------------------------------------------------ */
  /* 内部：时间字段映射                                                   */
  /* ------------------------------------------------------------------ */

  private applyFieldMappingTime(values: ProFormValues): ProFormValues {
    const mapping = this.state.fieldMappingTime as FieldMappingTime | undefined;
    if (!mapping?.length) return values;

    mapping.forEach(([rangeField, [startField, endField], format]) => {
      const rangeValue = values[rangeField];
      // 拆分后移除原范围字段
      delete values[rangeField];

      if (!Array.isArray(rangeValue) || rangeValue.length !== 2) {
        values[startField] = undefined;
        values[endField] = undefined;
        return;
      }

      const fmt = format === undefined ? DEFAULT_TIME_FORMAT : format;
      values[startField] = this.formatTime(rangeValue[0], fmt);
      values[endField] = this.formatTime(rangeValue[1], fmt);
    });

    return values;
  }

  private formatTime(value: any, format: string | null) {
    if (value == null) return undefined;
    // format 为 null 表示保留原值
    if (format === null) return value;
    if (isDayjsLike(value)) return value.format(format);
    return value;
  }
}
