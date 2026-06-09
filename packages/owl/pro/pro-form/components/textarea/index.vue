<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-textarea
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :placeholder="placeholder ?? fieldProps.placeholder ?? `请输入${lbl ?? ''}`"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-textarea>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { TextArea as ATextarea } from 'antdv-next';
import type { TextAreaProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProTextarea', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<TextAreaProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
