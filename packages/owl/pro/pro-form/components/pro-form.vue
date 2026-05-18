<script setup lang="ts">
import type { BaseFormComponentType, BuiltinComponentProps, FormApi, FormSchema } from '../types';
import type { FormInstance } from 'antdv-next';
import type { Slot } from 'vue';

import { Button, Form, FormItem, Row, Space } from 'antdv-next';
import { computed, ref, useAttrs, useSlots, watchEffect } from 'vue';

import ProFormField from './form-field.vue';

defineOptions({
  name: 'ProForm',
  inheritAttrs: false
});

const props = withDefaults(
  defineProps<{
    formApi: FormApi<Record<string, unknown>>;
  }>(),
  {}
);

const attrs = useAttrs();
const slots = useSlots();
const formRef = ref<FormInstance>();
const state = computed(() => props.formApi.getState());

watchEffect(() => {
  props.formApi.setFormInstance(formRef.value);
});

const formProps = computed(() => {
  const {
    actionButtonsReverse,
    actionPosition,
    commonConfig,
    handleReset,
    handleSubmit,
    handleValuesChange,
    initialValues,
    resetButtonOptions,
    rowProps,
    schema,
    showDefaultActions,
    submitButtonOptions,
    wrapperClass,
    ...restState
  } = state.value;

  return {
    ...restState,
    ...attrs,
    model: props.formApi.values
  };
});

const schema = computed(
  () =>
    (state.value.schema ?? []) as FormSchema<
      BaseFormComponentType,
      BuiltinComponentProps,
      Record<string, unknown>
    >[]
);

const fieldSlots = computed(() => {
  return Object.fromEntries(
    Object.entries(slots).filter(([name]) => !['action', 'default'].includes(name))
  ) as Record<string, Slot>;
});

const actionJustify = computed(() => {
  if (state.value.actionPosition === 'center') {
    return 'center';
  }

  if (state.value.actionPosition === 'left') {
    return 'start';
  }

  return 'end';
});

async function handleFinish() {
  await state.value.handleSubmit?.(props.formApi.getValues());
}

function handleReset(event: Event) {
  event.preventDefault();
  props.formApi.resetForm();
}
</script>

<template>
  <Form ref="formRef" class="w-full" v-bind="formProps" @finish="handleFinish" @reset="handleReset">
    <div v-if="state.wrapperClass" :class="['grid flex-col gap-x-4', state.wrapperClass]">
      <ProFormField
        v-for="fieldSchema in schema"
        :key="JSON.stringify(fieldSchema.fieldName)"
        :api="formApi"
        :common-config="state.commonConfig"
        :schema="fieldSchema"
      >
        <template v-for="(_, slotName) in fieldSlots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
      </ProFormField>
    </div>
    <Row v-else-if="state.rowProps" v-bind="state.rowProps">
      <ProFormField
        v-for="fieldSchema in schema"
        :key="JSON.stringify(fieldSchema.fieldName)"
        :api="formApi"
        :common-config="state.commonConfig"
        :schema="fieldSchema"
      >
        <template v-for="(_, slotName) in fieldSlots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
      </ProFormField>
    </Row>
    <template v-else>
      <ProFormField
        v-for="fieldSchema in schema"
        :key="JSON.stringify(fieldSchema.fieldName)"
        :api="formApi"
        :common-config="state.commonConfig"
        :schema="fieldSchema"
      >
        <template v-for="(_, slotName) in fieldSlots" #[slotName]="slotProps">
          <slot :name="slotName" v-bind="slotProps ?? {}" />
        </template>
      </ProFormField>
    </template>

    <slot />
    <slot name="action" :api="formApi" />

    <FormItem v-if="state.showDefaultActions">
      <div
        class="flex w-full"
        :class="{
          'justify-start': (state.actionPosition ?? 'right') === 'left',
          'justify-center': state.actionPosition === 'center',
          'justify-end': !state.actionPosition || state.actionPosition === 'right'
        }"
      >
        <Space :style="{ justifyContent: actionJustify, width: '100%' }">
          <template v-if="state.actionButtonsReverse">
            <Button
              v-if="state.submitButtonOptions?.show !== false"
              html-type="submit"
              type="primary"
              v-bind="state.submitButtonOptions"
            >
              {{ state.submitButtonOptions?.text ?? '提交' }}
            </Button>
            <Button
              v-if="state.resetButtonOptions?.show !== false"
              html-type="reset"
              v-bind="state.resetButtonOptions"
            >
              {{ state.resetButtonOptions?.text ?? '重置' }}
            </Button>
          </template>
          <template v-else>
            <Button
              v-if="state.resetButtonOptions?.show !== false"
              html-type="reset"
              v-bind="state.resetButtonOptions"
            >
              {{ state.resetButtonOptions?.text ?? '重置' }}
            </Button>
            <Button
              v-if="state.submitButtonOptions?.show !== false"
              html-type="submit"
              type="primary"
              v-bind="state.submitButtonOptions"
            >
              {{ state.submitButtonOptions?.text ?? '提交' }}
            </Button>
          </template>
        </Space>
      </div>
    </FormItem>
  </Form>
</template>
