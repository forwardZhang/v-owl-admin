<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-input-password
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :placeholder="placeholder ?? fieldProps.placeholder ?? `请输入${lbl ?? ''}`"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-input-password>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { InputPassword as AInputPassword } from 'antdv-next';
import type { InputPasswordProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProPassword', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<InputPasswordProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
