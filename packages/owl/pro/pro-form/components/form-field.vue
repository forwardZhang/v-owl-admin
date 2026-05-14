<script setup lang="ts">
import type {
  BaseFormComponentType,
  BuiltinComponentProps,
  FormApi,
  FormCommonConfig,
  FormSchema,
  RenderContent as RenderContentType
} from '../types';
import type { Component, PropType, VNodeChild } from 'vue';

import { Col } from 'antdv-next/dist/grid/index';
import { FormItem } from 'antdv-next/dist/form/index';
import { computed, defineComponent, h } from 'vue';
import { get } from 'lodash-es';

import { getFormComponent, getFormModelPropName } from '../adapter/config';
import { useDependencies } from '../hooks/use-dependencies';
import {
  createFieldContext,
  mergeProps,
  normalizeNamePath,
  renderContent,
  resolveMaybe
} from '../utils';

defineOptions({
  name: 'ProFormField',
  inheritAttrs: false
});

const props = withDefaults(
  defineProps<{
    api: FormApi<Record<string, unknown>>;
    commonConfig?: FormCommonConfig<Record<string, unknown>>;
    schema: FormSchema<BaseFormComponentType, BuiltinComponentProps, Record<string, unknown>>;
  }>(),
  {
    commonConfig: () => ({})
  }
);

const slots = defineSlots<{
  [name: string]: ((props?: Record<string, unknown>) => VNodeChild) | undefined;
  default?: (props?: Record<string, unknown>) => VNodeChild;
  help?: (props?: Record<string, unknown>) => VNodeChild;
  label?: (props?: Record<string, unknown>) => VNodeChild;
}>();

const RenderContent = defineComponent({
  name: 'ProFormRenderContent',
  props: {
    content: {
      type: [String, Array, Object, Function, Boolean, Number] as PropType<RenderContentType>,
      default: undefined
    }
  },
  setup(renderProps) {
    return () => renderContent(renderProps.content);
  }
});

const {
  dynamicComponentProps,
  dynamicRules,
  isDisabled: dependencyDisabled,
  isIf,
  isRequired: dependencyRequired,
  isShow: dependencyShow
} = useDependencies({
  api: props.api,
  getDependencies: () => props.schema.dependencies,
  schema: props.schema
});

const ctx = computed(() => createFieldContext({ api: props.api, schema: props.schema }));

const isHidden = computed(() => {
  return (
    resolveMaybe({ api: props.api, schema: props.schema, value: props.schema.hidden }) ?? false
  );
});

const isShow = computed(() => {
  return (
    resolveMaybe({ api: props.api, schema: props.schema, value: props.schema.show }) ??
    dependencyShow.value
  );
});

const isDisabled = computed(() => {
  return dependencyDisabled.value || props.schema.disabled || props.commonConfig.disabled || false;
});

const fieldLabel = computed(() => {
  return resolveMaybe({ api: props.api, schema: props.schema, value: props.schema.label });
});

const isRequired = computed(() => {
  return (
    resolveMaybe({ api: props.api, schema: props.schema, value: props.schema.required }) ??
    dependencyRequired.value ??
    props.schema.formItemProps?.required
  );
});

const fieldRules = computed(() => {
  const rules = dynamicRules.value ?? props.schema.rules ?? props.schema.formItemProps?.rules;

  if (rules) {
    return rules;
  }

  if (!isRequired.value) {
    return undefined;
  }

  return [
    {
      required: true,
      message: typeof fieldLabel.value === 'string' ? `请填写${fieldLabel.value}` : '该字段为必填项'
    }
  ];
});

const FieldComponent = computed<Component | undefined>(() => {
  const component = props.schema.component;

  if (typeof component !== 'string') {
    return component;
  }

  return getFormComponent(component);
});

const modelPropName = computed(() => {
  const component = props.schema.component;

  return (
    props.schema.modelPropName ??
    props.commonConfig.modelPropName ??
    (typeof component === 'string' ? getFormModelPropName(component) : undefined)
  );
});

const componentProps = computed(() => {
  const commonProps = resolveMaybe({
    api: props.api,
    schema: props.schema,
    value: props.commonConfig.componentProps
  });
  const schemaProps = resolveMaybe({
    api: props.api,
    schema: props.schema,
    value: props.schema.componentProps
  });

  return mergeProps({
    ...(commonProps ?? {}),
    ...(schemaProps ?? {}),
    ...dynamicComponentProps.value,
    disabled: isDisabled.value
  });
});

const formItemProps = computed(() => {
  const labelWidth = props.schema.labelWidth ?? props.commonConfig.labelWidth;

  return mergeProps({
    ...(props.commonConfig.formItemProps ?? {}),
    ...(props.schema.formItemProps ?? {}),
    label: undefined,
    labelCol: labelWidth
      ? {
          style: {
            width: typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth
          }
        }
      : (props.schema.labelCol ?? props.commonConfig.labelCol),
    name: normalizeNamePath(props.schema.fieldName),
    required: isRequired.value,
    rules: fieldRules.value,
    wrapperCol: props.schema.wrapperCol ?? props.commonConfig.wrapperCol
  });
});

const controlProps = computed(() => {
  const propName = modelPropName.value || 'value';

  return {
    ...componentProps.value,
    [propName]: get(props.api.values, normalizeNamePath(props.schema.fieldName)),
    [`onUpdate:${propName}`]: (value: unknown) => {
      props.api.setFieldValue(props.schema.fieldName, value);
    }
  };
});

const componentSlots = computed(() => {
  const schemaSlots = props.schema.renderComponentContent?.(ctx.value) ?? {};
  const fieldSlots = { ...slots } as Record<string, ((props?: unknown) => VNodeChild) | undefined>;

  delete fieldSlots.label;
  delete fieldSlots.help;

  return {
    ...fieldSlots,
    ...schemaSlots
  };
});

const helpContent = computed(() => {
  return resolveMaybe({ api: props.api, schema: props.schema, value: props.schema.help });
});
</script>

<template>
  <Col
    v-if="schema.colProps || commonConfig.colProps"
    v-bind="schema.colProps ?? commonConfig.colProps"
  >
    <FormItem v-if="isIf && !isHidden" v-show="isShow" v-bind="formItemProps">
      <template v-if="!commonConfig.hideLabel && (fieldLabel || $slots.label)" #label>
        <slot name="label" :api="api" :schema="schema">
          <RenderContent :content="fieldLabel" />
        </slot>
      </template>
      <template v-if="helpContent || $slots.help" #help>
        <slot name="help" :api="api" :schema="schema">
          <RenderContent :content="helpContent" />
        </slot>
      </template>
      <component
        :is="FieldComponent"
        v-if="FieldComponent"
        v-slots="componentSlots"
        v-bind="controlProps"
      />
    </FormItem>
  </Col>
  <FormItem v-else-if="isIf && !isHidden" v-show="isShow" v-bind="formItemProps">
    <template v-if="!commonConfig.hideLabel && (fieldLabel || $slots.label)" #label>
      <slot name="label" :api="api" :schema="schema">
        <RenderContent :content="fieldLabel" />
      </slot>
    </template>
    <template v-if="helpContent || $slots.help" #help>
      <slot name="help" :api="api" :schema="schema">
        <RenderContent :content="helpContent" />
      </slot>
    </template>
    <component
      :is="FieldComponent"
      v-if="FieldComponent"
      v-slots="componentSlots"
      v-bind="controlProps"
    />
  </FormItem>
</template>
