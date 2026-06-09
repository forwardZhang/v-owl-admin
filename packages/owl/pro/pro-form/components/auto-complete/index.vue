<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled, placeholder, label: lbl }">
      <a-auto-complete
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
      </a-auto-complete>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { AutoComplete as AAutoComplete } from 'antdv-next';
import type { AutoCompleteProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProAutoComplete', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<AutoCompleteProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
