<template>
  <Form
    ref="formInstance"
    class="pro-form"
    v-bind="attrs"
    :model="form.values"
    @finish="handleFinish"
    @finish-failed="handleFinishFailed"
    @reset="handleReset"
    @submit="handleSubmit"
  >
    <slot />
  </Form>
</template>

<script setup lang="ts">
import { Form } from 'antdv-next';
import { onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue';
import type { FormInstance } from 'antdv-next';
import type { ProFormFinishFailedInfo } from './types';
import { provideProForm } from './create-pro-form';

defineOptions({
  name: 'ProForm',
  inheritAttrs: false
});

const props = withDefaults(
  defineProps<{
    form: import('./types').CreateProFormReturn;
    loading?: boolean;
  }>(),
  {
    loading: false
  }
);

const attrs = useAttrs();
const formInstance = ref<FormInstance>();

/**
 * ProForm 作为容器组件，负责把同一份控制器注入给内部字段组件。
 */
provideProForm(props.form);

watch(
  () => props.loading,
  (nextLoading) => {
    props.form.setLoading(nextLoading);
  },
  {
    immediate: true
  }
);

onMounted(() => {
  /**
   * 真实 Form 挂载后，把实例回填给 createProForm 控制器，
   * 这样 validate / submit / clearValidate 才能走到底层实现。
   */
  props.form.__INTERNAL__.setFormInstance(formInstance.value);
});

onBeforeUnmount(() => {
  props.form.__INTERNAL__.setFormInstance(undefined);
});

function handleSubmit(event: Event) {
  if (!props.loading) {
    return;
  }

  /**
   * loading 中阻止原生 submit，避免重复提交。
   */
  event.preventDefault();
}

function handleReset(event: Event) {
  /**
   * 统一改为走 createProForm 的恢复逻辑，保证 values 与 initialValues 同步。
   */
  event.preventDefault();
  props.form.restoreFieldsValue();
}

function handleFinish(values: Record<string, unknown>) {
  props.form.__INTERNAL__.triggerFinish(values);
}

function handleFinishFailed(errorInfo: ProFormFinishFailedInfo) {
  props.form.__INTERNAL__.triggerFinishFailed(errorInfo);
}

defineExpose({
  native: formInstance,
  submit: () => props.form.submit(),
  validate: () => props.form.validate()
});
</script>

<style scoped lang="less">
.pro-form {
  width: 100%;
}
</style>
