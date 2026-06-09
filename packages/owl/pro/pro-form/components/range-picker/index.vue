<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder }">
      <a-date-range-picker
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :placeholder="placeholder ?? fieldProps.placeholder"
        :style="[{ width: '100%' }, fieldProps.style]"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-date-range-picker>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { DateRangePicker as ADateRangePicker } from 'antdv-next';
import type { RangePickerProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProRangePicker', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<RangePickerProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
