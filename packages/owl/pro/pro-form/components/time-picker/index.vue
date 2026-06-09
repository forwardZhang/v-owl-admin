<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-time-picker
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
      </a-time-picker>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { TimePicker as ATimePicker } from 'antdv-next';
import type { TimePickerProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProTimePicker', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<TimePickerProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
