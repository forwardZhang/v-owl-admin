<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled }">
      <a-radio-group
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        :options="resolveOptions(fieldProps)"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-radio-group>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { RadioGroup as ARadioGroup } from 'antdv-next';
import type { RadioGroupProps } from 'antdv-next';
import { ProField } from '../field';
import { useFieldOptions } from '../../composables/use-field-options';
import type { ProDataFieldProps } from '../../types';

defineOptions({ name: 'ProRadio', inheritAttrs: false });

const props = withDefaults(defineProps<ProDataFieldProps<RadioGroupProps>>(), {
  disabled: undefined,
  readonly: undefined,
  source: undefined,
  visible: undefined
});

const { options } = useFieldOptions(() => props.source);

/** 有 source（含远程）用其结果，否则回退 fieldProps.options */
function resolveOptions(fieldProps: Record<string, any>) {
  return props.source != null ? options.value : (fieldProps.options ?? []);
}
</script>
