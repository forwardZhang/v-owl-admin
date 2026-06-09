<template>
  <ProSelect v-bind="$attrs" v-model:value="value" :options="finalOptions" :loading="loading">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </ProSelect>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProSelect from '../select/index.vue';
import { useApiOptions } from '../../composables/use-api-options';
import type { ProFormRequestConfig } from '../../types';

defineOptions({ name: 'ApiSelect', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 请求配置（api / params / 字段别名等都放这里） */
    request?: ProFormRequestConfig;
    /** 静态 options（无 request.api 时使用） */
    options?: any[];
  }>(),
  { request: undefined, options: () => [] }
);

const value = defineModel<any>('value');

const { options: apiOptions, loading } = useApiOptions(() => props.request);

/** 有 request.api 用请求结果，否则透传静态 options */
const finalOptions = computed(() =>
  props.request?.api ? apiOptions.value : (props.options ?? [])
);
</script>
