<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-tree-select
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :tree-data="resolveTreeData(fieldProps)"
        :field-names="
          fieldProps.fieldNames ?? { label: 'label', value: 'value', children: 'children' }
        "
        :placeholder="placeholder ?? fieldProps.placeholder ?? `请选择${lbl ?? ''}`"
        :style="[{ width: '100%' }, fieldProps.style]"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-tree-select>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { TreeSelect as ATreeSelect } from 'antdv-next';
import type { TreeSelectProps } from 'antdv-next';
import { ProField } from '../field';
import { useFieldOptions } from '../../composables/use-field-options';
import type { ProDataFieldProps } from '../../types';

defineOptions({ name: 'ProTreeSelect', inheritAttrs: false });

const props = withDefaults(defineProps<ProDataFieldProps<TreeSelectProps>>(), {
  disabled: undefined,
  readonly: undefined,
  source: undefined,
  visible: undefined
});

const { options } = useFieldOptions(() => props.source);

/** 有 source 用其结果，否则回退 fieldProps.treeData */
function resolveTreeData(fieldProps: Record<string, any>) {
  return props.source != null ? options.value : (fieldProps.treeData ?? []);
}
</script>
