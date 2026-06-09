<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled }">
      <a-switch
        v-bind="{ ...$attrs, ...fieldProps }"
        :checked="value"
        :disabled="disabled"
        @update:checked="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-switch>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { Switch as ASwitch } from 'antdv-next';
import type { SwitchProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProSwitch', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<SwitchProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
