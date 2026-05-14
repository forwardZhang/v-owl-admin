<script setup lang="ts">
import type { BaseFormComponentType, BuiltinComponentProps, FormApi, FormSchema } from '../types';
import type { FormInstance } from 'antdv-next';

import Button from 'antdv-next/dist/button/index';
import Form, { FormItem } from 'antdv-next/dist/form/index';
import { Row } from 'antdv-next/dist/grid/index';
import Space from 'antdv-next/dist/space/index';
import { computed, ref, useAttrs, watchEffect } from 'vue';

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
  <Form
    ref="formRef"
    class="pro-form"
    v-bind="formProps"
    @finish="handleFinish"
    @reset="handleReset"
  >
    <Row v-if="state.rowProps" v-bind="state.rowProps">
      <ProFormField
        v-for="fieldSchema in schema"
        :key="JSON.stringify(fieldSchema.fieldName)"
        :api="formApi"
        :common-config="state.commonConfig"
        :schema="fieldSchema"
      />
    </Row>
    <template v-else>
      <ProFormField
        v-for="fieldSchema in schema"
        :key="JSON.stringify(fieldSchema.fieldName)"
        :api="formApi"
        :common-config="state.commonConfig"
        :schema="fieldSchema"
      />
    </template>

    <slot />
    <slot name="action" :api="formApi" />

    <FormItem v-if="state.showDefaultActions">
      <div class="pro-form__actions" :class="`is-${state.actionPosition ?? 'right'}`">
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

<style scoped lang="less">
.pro-form {
  width: 100%;
}

.pro-form__actions {
  display: flex;
  width: 100%;
}

.pro-form__actions.is-left {
  justify-content: flex-start;
}

.pro-form__actions.is-center {
  justify-content: center;
}

.pro-form__actions.is-right {
  justify-content: flex-end;
}
</style>
