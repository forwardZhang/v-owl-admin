<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-input
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :placeholder="placeholder ?? fieldProps.placeholder ?? `请输入${lbl ?? ''}`"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-input>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { Input as AInput } from 'antdv-next';
import type { InputProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProInput', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<InputProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
