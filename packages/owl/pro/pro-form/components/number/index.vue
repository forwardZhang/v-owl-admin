<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-input-number
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :placeholder="placeholder ?? fieldProps.placeholder ?? `请输入${lbl ?? ''}`"
        :style="[{ width: '100%' }, fieldProps.style]"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-input-number>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { InputNumber as AInputNumber } from 'antdv-next';
import type { InputNumberProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProNumber', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<InputNumberProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
