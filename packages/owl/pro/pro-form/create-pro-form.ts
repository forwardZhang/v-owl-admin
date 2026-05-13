import { cloneDeep, get, has, isArray, set, unset } from 'lodash-es';
import { inject, provide, reactive, ref, shallowRef, toRaw } from 'vue';
import type { FormInstance } from 'antdv-next';
import type { Ref } from 'vue';
import type {
  CreateProFormOptions,
  CreateProFormReturn,
  ProFormFinishFailedInfo,
  ProFormHook,
  ProFormNamePath,
  SetInitialValuesOptions
} from './types';

const proFormContextKey = Symbol('owl-pro-form');

/**
 * 轻量事件钩子，给 finish / finishFailed / reset 这类表单事件做订阅分发。
 */
function createHook<TPayload>(): {
  on: ProFormHook<TPayload>;
  trigger: (payload: TPayload) => void;
} {
  const handlers = new Set<(payload: TPayload) => void>();

  return {
    on(handler) {
      handlers.add(handler);

      return () => {
        handlers.delete(handler);
      };
    },
    trigger(payload) {
      handlers.forEach((handler) => {
        handler(payload);
      });
    }
  };
}

/**
 * 把 name path 统一归一成数组格式，便于 lodash get/set 处理嵌套路径。
 */
function normalizeNamePath(name: ProFormNamePath): Array<string | number> {
  if (isArray(name)) {
    return name;
  }

  return [name];
}

/**
 * 对写入 values / initialValues 的值做深拷贝，避免外部引用污染内部状态。
 */
function cloneModel<TValue>(value: TValue): TValue {
  return cloneDeep(value);
}

/**
 * 用新的 source 快照覆盖响应式对象本身，而不是替换引用，
 * 这样页面上已经依赖 values 的响应式订阅不会丢失。
 */
function replaceReactiveObject(
  target: Record<string, unknown>,
  source: Record<string, unknown> | undefined
) {
  const nextSource = source ?? {};

  Object.keys(target).forEach((key) => {
    if (!has(nextSource, key)) {
      delete target[key];
    }
  });

  Object.entries(nextSource).forEach(([key, value]) => {
    target[key] = cloneModel(value);
  });
}

export function createProForm<TValues extends Record<string, unknown> = Record<string, unknown>>(
  options: CreateProFormOptions<TValues> = {}
): CreateProFormReturn<TValues> {
  const finishHook = createHook<TValues>();
  const finishFailedHook = createHook<ProFormFinishFailedInfo>();
  const resetHook = createHook<void>();

  /**
   * initialValues 保存“初始快照”，values 保存“当前工作值”。
   * restore/reset 系列 API 始终以 initialValues 为准回退。
   */
  const initialValues = ref(cloneModel(options.initialValues ?? {}) as Partial<TValues>) as Ref<
    Partial<TValues>
  >;
  const values = reactive(cloneModel(initialValues.value)) as TValues;
  const formRef = shallowRef<FormInstance>();
  const loading = ref(false);

  function setFormInstance(instance?: FormInstance) {
    formRef.value = instance;
  }

  function setLoading(nextLoading: boolean) {
    loading.value = nextLoading;
  }

  function getFieldValue<TValue = unknown>(name: ProFormNamePath): TValue | undefined {
    return get(values, normalizeNamePath(name)) as TValue | undefined;
  }

  function setFieldValue(name: ProFormNamePath, value: unknown) {
    set(values, normalizeNamePath(name), cloneModel(value));
    formRef.value?.setFieldValue(name, cloneModel(value));
  }

  function setFieldsValue(nextValues: Partial<TValues>) {
    Object.entries(nextValues).forEach(([key, value]) => {
      set(values, [key], cloneModel(value));
    });

    formRef.value?.setFieldsValue(cloneModel(nextValues));
  }

  function clearValidate(nameList?: ProFormNamePath[]) {
    formRef.value?.clearValidate(nameList);
  }

  /**
   * 恢复单字段时，同时把对应校验态清掉，避免 UI 还停留在旧错误提示上。
   */
  function restoreFieldValue(name: ProFormNamePath) {
    const normalizedName = normalizeNamePath(name);
    const nextValue = get(initialValues.value, normalizedName);

    if (typeof nextValue === 'undefined') {
      unset(values, normalizedName);
      formRef.value?.setFieldValue(name, undefined);
    } else {
      set(values, normalizedName, cloneModel(nextValue));
      formRef.value?.setFieldValue(name, cloneModel(nextValue));
    }

    clearValidate([name]);
    options.onReset?.();
    resetHook.trigger(undefined);
  }

  function restoreFieldsValue(nameList?: ProFormNamePath[]) {
    if (nameList?.length) {
      nameList.forEach((name) => {
        const normalizedName = normalizeNamePath(name);
        const nextValue = get(initialValues.value, normalizedName);

        if (typeof nextValue === 'undefined') {
          unset(values, normalizedName);
          formRef.value?.setFieldValue(name, undefined);
          return;
        }

        set(values, normalizedName, cloneModel(nextValue));
        formRef.value?.setFieldValue(name, cloneModel(nextValue));
      });

      clearValidate(nameList);
    } else {
      /**
       * 整表恢复时优先替换响应式 values，再调用 Form 实例 resetFields，
       * 保证外部直接消费 form.values 的场景也能同步看到最新值。
       */
      replaceReactiveObject(values, initialValues.value as Record<string, unknown>);
      formRef.value?.resetFields();
      clearValidate();
    }

    options.onReset?.();
    resetHook.trigger(undefined);
  }

  function resetFields(nameList?: ProFormNamePath[]) {
    restoreFieldsValue(nameList);
  }

  function setInitialValues(
    nextInitialValues: Partial<TValues>,
    setInitialOptions: SetInitialValuesOptions = {}
  ) {
    initialValues.value = cloneModel(nextInitialValues);

    if (setInitialOptions.updateFields) {
      restoreFieldsValue();
    }
  }

  async function validateFields(nameList?: ProFormNamePath[], validateOptions?: unknown) {
    if (!formRef.value) {
      /**
       * 某些场景下 createProForm 可能先于真实 Form 挂载，
       * 这里回退返回当前 values，避免调用期直接抛空实例错误。
       */
      return cloneModel(toRaw(values)) as Partial<TValues>;
    }

    return (await formRef.value.validateFields(
      nameList,
      validateOptions as never
    )) as Partial<TValues>;
  }

  async function validate() {
    return (await validateFields()) as TValues;
  }

  function submit() {
    if (loading.value) {
      return;
    }

    formRef.value?.submit();
  }

  /**
   * 统一由 ProForm 容器把 finish 事件回流到这里，再触发 options 与订阅钩子。
   */
  function triggerFinish(nextValues: TValues) {
    options.onFinish?.(nextValues);
    finishHook.trigger(nextValues);
  }

  function triggerFinishFailed(errorInfo: ProFormFinishFailedInfo) {
    options.onFinishFailed?.(errorInfo);
    finishFailedHook.trigger(errorInfo);
  }

  function triggerReset() {
    options.onReset?.();
    resetHook.trigger(undefined);
  }

  const returned: CreateProFormReturn<TValues> = {
    formRef,
    initialValues,
    loading,
    values,
    clearValidate,
    getFieldValue,
    resetFields,
    restoreFieldValue,
    restoreFieldsValue,
    setFieldValue,
    setFieldsValue,
    setInitialValues,
    setLoading,
    submit,
    validate,
    validateFields,
    onFinish: finishHook.on,
    onFinishFailed: finishFailedHook.on,
    onReset: resetHook.on,
    __INTERNAL__: {
      setFormInstance,
      triggerFinish,
      triggerFinishFailed,
      triggerReset
    }
  };

  return returned;
}

export function provideProForm(form: CreateProFormReturn) {
  provide(proFormContextKey, form);
}

export function useInjectProForm<
  TValues extends Record<string, unknown> = Record<string, unknown>
>() {
  /**
   * 字段组件通过该注入获取同一份 ProForm 控制器。
   */
  return inject<CreateProFormReturn<TValues> | null>(proFormContextKey, null);
}
