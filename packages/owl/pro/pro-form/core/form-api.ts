import type {
  BaseFormComponentType,
  BuiltinComponentProps,
  FormApi as FormApiContract,
  FormSchema,
  ProFormNamePath,
  UseProFormOptions
} from '../types';
import type { FormInstance } from 'antdv-next';
import type { Ref } from 'vue';

import { cloneDeep, isArray, isEqual, mergeWith, set } from 'lodash-es';
import { reactive, ref, toRaw } from 'vue';

function normalizeNamePath(name: ProFormNamePath): Array<string | number> {
  if (Array.isArray(name)) {
    return name;
  }

  if (typeof name === 'number') {
    return [name];
  }

  return name.split('.').filter(Boolean);
}

function namePathToKey(name: ProFormNamePath): string {
  return normalizeNamePath(name).join('.');
}

function mergeWithArrayOverride<T>(source: T, target: T): T {
  return mergeWith(cloneDeep(target), source, (objValue, srcValue) => {
    if (isArray(objValue) || isArray(srcValue)) {
      return srcValue;
    }

    return undefined;
  });
}

function getSchemaDefaultValues<TValues extends Record<string, unknown>>(
  schema: UseProFormOptions<TValues>['schema']
) {
  const defaults: Record<string, unknown> = {};

  schema?.forEach((item) => {
    if (Reflect.has(item, 'defaultValue')) {
      set(defaults, normalizeNamePath(item.fieldName), cloneDeep(item.defaultValue));
    }
  });

  return defaults as Partial<TValues>;
}

function getDefaultState<TValues extends Record<string, unknown>>(): UseProFormOptions<TValues> {
  return {
    actionPosition: 'right',
    commonConfig: {},
    initialValues: {},
    layout: 'horizontal',
    resetButtonOptions: {},
    rowProps: undefined,
    schema: [],
    showDefaultActions: true,
    submitButtonOptions: {}
  };
}

export class FormApi<
  TValues extends Record<string, unknown> = Record<string, unknown>
> implements FormApiContract<TValues> {
  public formRef = ref<FormInstance>() as Ref<FormInstance | undefined>;

  public state: UseProFormOptions<TValues>;

  public values: TValues;

  constructor(options: UseProFormOptions<TValues> = {}) {
    const initialValues = mergeWithArrayOverride(
      cloneDeep(options.initialValues ?? {}) as Partial<TValues>,
      getSchemaDefaultValues(options.schema)
    );
    this.state = reactive(
      mergeWithArrayOverride({ ...options, initialValues }, getDefaultState<TValues>())
    ) as UseProFormOptions<TValues>;
    this.values = reactive(cloneDeep(initialValues)) as TValues;
  }

  getState() {
    return this.state;
  }

  getValues() {
    return cloneDeep(toRaw(this.values)) as TValues;
  }

  removeSchemaByFields(fields: ProFormNamePath[]) {
    const fieldKeys = new Set(fields.map(namePathToKey));
    this.state.schema = this.state.schema?.filter(
      (item) => !fieldKeys.has(namePathToKey(item.fieldName))
    );
  }

  resetForm() {
    const nextValues = mergeWithArrayOverride(
      cloneDeep(this.state.initialValues ?? {}) as Partial<TValues>,
      getSchemaDefaultValues(this.state.schema)
    );

    Object.keys(this.values).forEach((key) => {
      Reflect.deleteProperty(this.values, key);
    });
    Object.assign(this.values, cloneDeep(nextValues));
    this.formRef.value?.resetFields();
    this.state.handleReset?.(this.getValues());
  }

  setFormInstance(instance?: FormInstance) {
    this.formRef.value = instance;
  }

  setFieldValue(field: ProFormNamePath, value: unknown) {
    set(this.values, normalizeNamePath(field), cloneDeep(value));
    this.formRef.value?.setFieldValue(field as never, cloneDeep(value));
    this.state.handleValuesChange?.(this.getValues(), [field]);
  }

  setFieldsValue(fields: Partial<TValues>) {
    Object.entries(fields).forEach(([key, value]) => {
      set(this.values, normalizeNamePath(key), cloneDeep(value));
    });
    this.formRef.value?.setFieldsValue(cloneDeep(fields));
    this.state.handleValuesChange?.(this.getValues(), Object.keys(fields));
  }

  setValues(fields: Partial<TValues>) {
    this.setFieldsValue(fields);
  }

  setState(
    stateOrFn:
      | ((prev: UseProFormOptions<TValues>) => Partial<UseProFormOptions<TValues>>)
      | Partial<UseProFormOptions<TValues>>
  ) {
    const patch = typeof stateOrFn === 'function' ? stateOrFn(this.state) : stateOrFn;
    const nextState = mergeWithArrayOverride(patch, this.state);

    Object.entries(nextState).forEach(([key, value]) => {
      this.state[key as keyof UseProFormOptions<TValues>] = value as never;
    });
  }

  async submitForm() {
    const values = await this.validate();
    await this.state.handleSubmit?.(values);
    return values;
  }

  updateSchema(
    schema: Partial<FormSchema<BaseFormComponentType, BuiltinComponentProps, TValues>>[]
  ) {
    const hasField = schema.every((item) => Reflect.has(item, 'fieldName') && item.fieldName);

    if (!hasField) {
      console.error(
        'All items in the schema array must have a valid `fieldName` property to be updated'
      );
      return;
    }

    const updatedMap = new Map(
      schema.map((item) => [namePathToKey(item.fieldName as ProFormNamePath), item])
    );

    this.state.schema = this.state.schema?.map((item) => {
      const updated = updatedMap.get(namePathToKey(item.fieldName));

      if (!updated) {
        return item;
      }

      return mergeWithArrayOverride(updated, item) as FormSchema<
        BaseFormComponentType,
        BuiltinComponentProps,
        TValues
      >;
    });
  }

  async validate() {
    if (!this.formRef.value) {
      return this.getValues();
    }

    await this.formRef.value.validateFields();
    return this.getValues();
  }

  async validateField(fieldName: ProFormNamePath) {
    return this.formRef.value?.validateFields([fieldName as never]);
  }

  syncValue(fieldName: ProFormNamePath, value: unknown) {
    const oldValues = this.getValues();
    set(this.values, normalizeNamePath(fieldName), cloneDeep(value));

    if (!isEqual(oldValues, this.getValues())) {
      this.state.handleValuesChange?.(this.getValues(), [fieldName]);
    }
  }
}
