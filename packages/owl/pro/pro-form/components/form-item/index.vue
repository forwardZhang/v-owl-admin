<template>
  <a-form-item
    v-if="derived.show"
    :name="item.fieldName"
    :label="staticLabel"
    :rules="derived.rules"
    :help="item.help"
    :hidden="item.hide"
    v-bind="derived.formItemProps"
  >
    <!-- label 自定义渲染（函数形式，可依赖表单值） -->
    <template v-if="isLabelRender" #label>
      <component :is="renderLabel" />
    </template>

    <component
      :is="derived.component"
      v-model:[derived.valueProp]="api.model[item.fieldName]"
      :disabled="derived.disabled"
      v-bind="derived.componentProps"
    />
  </a-form-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { deriveFormItem } from './derive';
import type { ProFormApi } from '../../form-api';
import type { ProFormCommonConfig, ProFormSchema } from '../../types';

const props = defineProps<{
  item: ProFormSchema;
  api: ProFormApi;
  commonConfig?: ProFormCommonConfig;
}>();

const api = props.api;

/** 基于当前表单值实时计算该项的派生属性（含 dependencies 联动） */
const derived = computed(() => deriveFormItem(props.item, props.commonConfig ?? {}, api));

/** label 为函数时走自定义渲染槽 */
const isLabelRender = computed(() => typeof props.item.label === 'function');

/** 非函数 label 直接用 prop */
const staticLabel = computed(() =>
  isLabelRender.value ? undefined : (props.item.label as string)
);

/**
 * 函数式 label 渲染器：作为「函数式组件」交给 <component :is>，
 * 每次随 api.model 重新求值，实现依赖表单值的动态 label。
 */
function renderLabel() {
  const label = props.item.label;
  return typeof label === 'function' ? label(api.model, api) : label;
}
</script>
