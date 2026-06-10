<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-select
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :options="resolveOptions(fieldProps)"
        :loading="loading || fieldProps.loading"
        :placeholder="placeholder ?? fieldProps.placeholder ?? `请选择${lbl ?? ''}`"
        :style="[{ width: '100%' }, fieldProps.style]"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-select>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { Select as ASelect } from 'antdv-next';
import type { SelectProps } from 'antdv-next';
import { ProField } from '../field';
import { useFieldOptions } from '../../composables/use-field-options';
import type { ProDataFieldProps } from '../../types';

defineOptions({ name: 'ProSelect', inheritAttrs: false });

const props = withDefaults(defineProps<ProDataFieldProps<SelectProps>>(), {
  disabled: undefined,
  readonly: undefined,
  source: undefined,
  visible: undefined
});

const { options, loading } = useFieldOptions(() => props.source);

/** 有 source 用其结果，否则回退 fieldProps.options */
function resolveOptions(fieldProps: Record<string, any>) {
  return props.source != null ? options.value : (fieldProps.options ?? []);
}
</script>
