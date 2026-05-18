<script setup lang="ts">
import type {
  BaseFormComponentType,
  BuiltinComponentProps,
  FormApi,
  FormComponentSlot,
  FormCommonConfig,
  FormSchema,
  RenderContent as RenderContentType
} from '../types';
import type { Component, PropType, VNodeChild } from 'vue';

import { Col, FormItem } from 'antdv-next';
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

// eslint-disable-next-line vue/one-component-per-file
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

// eslint-disable-next-line vue/one-component-per-file
const FieldControl = defineComponent({
  name: 'ProFormFieldControl',
  props: {
    component: {
      type: [Object, Function, String] as PropType<Component>,
      required: true
    },
    componentProps: {
      type: Object as PropType<Record<string, unknown>>,
      default: () => ({})
    },
    componentSlots: {
      type: Object as PropType<Record<string, ((props?: unknown) => VNodeChild) | undefined>>,
      default: () => ({})
    }
  },
  setup(controlProps) {
    return () =>
      h(controlProps.component, controlProps.componentProps, controlProps.componentSlots);
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

const isVisible = computed(() => {
  return isIf.value && !isHidden.value && isShow.value;
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
  if (props.schema.type === 'custom') {
    return props.schema.component;
  }

  return getFormComponent(props.schema.type);
});

const modelPropName = computed(() => {
  const schemaModelPropName =
    'modelPropName' in props.schema ? props.schema.modelPropName : undefined;

  return (
    schemaModelPropName ??
    props.commonConfig.modelPropName ??
    (props.schema.type === 'custom' ? 'modelValue' : getFormModelPropName(props.schema.type))
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
    value: 'componentProps' in props.schema ? props.schema.componentProps : undefined
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

function getSlotContext(slotProps?: unknown) {
  const componentSlotProps =
    slotProps && typeof slotProps === 'object' ? (slotProps as Record<string, unknown>) : {};

  return {
    ...createFieldContext({ api: props.api, schema: props.schema }),
    ...componentSlotProps,
    slotProps
  };
}

const componentSlots = computed(() => {
  const slotsConfig = 'componentSlots' in props.schema ? props.schema.componentSlots : undefined;

  return Object.fromEntries(
    Object.entries((slotsConfig ?? {}) as Record<string, FormComponentSlot>).map(([name, slot]) => [
      name,
      (slotProps?: unknown) => slot(getSlotContext(slotProps))
    ])
  );
});

const helpContent = computed(() => {
  return resolveMaybe({ api: props.api, schema: props.schema, value: props.schema.help });
});

const fieldClass = computed(() => {
  return resolveMaybe({
    api: props.api,
    schema: props.schema,
    value: props.schema.formItemClass ?? props.commonConfig.formItemClass
  });
});
</script>

<template>
  <Col
    v-if="(schema.colProps || commonConfig.colProps) && isVisible"
    :class="fieldClass"
    v-bind="schema.colProps ?? commonConfig.colProps"
  >
    <FormItem v-bind="formItemProps">
      <template v-if="!commonConfig.hideLabel && (fieldLabel || $slots.label)" #label>
        <slot name="label" :api="api" :label="fieldLabel" :schema="schema">
          <RenderContent :content="fieldLabel" />
        </slot>
      </template>
      <template v-if="helpContent || $slots.help" #help>
        <slot name="help" :api="api" :help="helpContent" :schema="schema">
          <RenderContent :content="helpContent" />
        </slot>
      </template>
      <FieldControl
        v-if="FieldComponent"
        :component="FieldComponent"
        :component-props="controlProps"
        :component-slots="componentSlots"
      />
      <slot
        v-else-if="schema.type === 'custom' && schema.slot"
        :name="schema.slot"
        v-bind="getSlotContext()"
      />
    </FormItem>
  </Col>
  <FormItem v-else-if="isVisible" :class="fieldClass" v-bind="formItemProps">
    <template v-if="!commonConfig.hideLabel && (fieldLabel || $slots.label)" #label>
      <slot name="label" :api="api" :label="fieldLabel" :schema="schema">
        <RenderContent :content="fieldLabel" />
      </slot>
    </template>
    <template v-if="helpContent || $slots.help" #help>
      <slot name="help" :api="api" :help="helpContent" :schema="schema">
        <RenderContent :content="helpContent" />
      </slot>
    </template>
    <FieldControl
      v-if="FieldComponent"
      :component="FieldComponent"
      :component-props="controlProps"
      :component-slots="componentSlots"
    />
    <slot
      v-else-if="schema.type === 'custom' && schema.slot"
      :name="schema.slot"
      v-bind="getSlotContext()"
    />
  </FormItem>
</template>
