<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-date-picker
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :placeholder="placeholder ?? fieldProps.placeholder ?? `请选择${lbl ?? ''}`"
        :style="[{ width: '100%' }, fieldProps.style]"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-date-picker>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { DatePicker as ADatePicker } from 'antdv-next';
import type { DatePickerProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProDatePicker', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<DatePickerProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
