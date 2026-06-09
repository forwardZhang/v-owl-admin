<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-cascader
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :options="resolveOptions(fieldProps)"
        :placeholder="placeholder ?? fieldProps.placeholder ?? `请选择${lbl ?? ''}`"
        :style="[{ width: '100%' }, fieldProps.style]"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-cascader>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { Cascader as ACascader } from 'antdv-next';
import type { CascaderProps } from 'antdv-next';
import { ProField } from '../field';
import { useFieldOptions } from '../../composables/use-field-options';
import type { ProDataFieldProps } from '../../types';

defineOptions({ name: 'ProCascader', inheritAttrs: false });

const props = withDefaults(defineProps<ProDataFieldProps<CascaderProps>>(), {
  disabled: undefined,
  readonly: undefined,
  source: undefined,
  visible: undefined
});

const { options } = useFieldOptions(() => props.source);

function resolveOptions(fieldProps: Record<string, any>) {
  return props.source != null ? options.value : (fieldProps.options ?? []);
}
</script>
