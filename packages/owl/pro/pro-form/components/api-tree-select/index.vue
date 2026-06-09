<template>
  <ProTreeSelect
    v-bind="$attrs"
    v-model:value="value"
    :tree-data="finalOptions"
    :field-names="{ label: 'label', value: 'value', children: 'children' }"
    :loading="loading"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </ProTreeSelect>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ProTreeSelect from '../tree-select/index.vue';
import { useApiOptions } from '../../composables/use-api-options';
import type { ProFormRequestConfig } from '../../types';

defineOptions({ name: 'ApiTreeSelect', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** 请求配置（api / params / 字段别名等都放这里） */
    request?: ProFormRequestConfig;
    /** 静态 treeData（无 request.api 时使用） */
    treeData?: any[];
  }>(),
  { request: undefined, treeData: () => [] }
);

const value = defineModel<any>('value');

const { options: apiOptions, loading } = useApiOptions(() => props.request);

const finalOptions = computed(() =>
  props.request?.api ? apiOptions.value : (props.treeData ?? [])
);
</script>
