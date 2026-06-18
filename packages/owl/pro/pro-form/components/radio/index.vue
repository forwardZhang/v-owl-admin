<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-radio-group
      :value="value"
      :disabled="disabled"
      :options="options"
      v-bind="controlProps"
      @update:value="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-radio-group>
  </ProField>
</template>

<script setup lang="ts">
import { RadioGroup as ARadioGroup } from 'antdv-next';
import type { RadioGroupProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import { useFieldOptions } from '../../composables/use-field-options';
import type { ProFieldBaseProps, ProFieldData } from '../../shared/types';

defineOptions({ name: 'ProRadio', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<RadioGroupProps, keyof ProFieldBaseProps>, ProFieldBaseProps {
  source?: ProFieldData;
}

const props = withDefaults(defineProps<ProFieldRuntimeProps>(), {
  ...DEFAULT_FIELD_RUNTIME_PROPS,
  source: undefined
});

const attrs = useAttrs();
const { value, setValue, mergedDisabled: disabled, controlProps } = useProField(props, attrs);
const { options } = useFieldOptions(
  () => props.source,
  () => controlProps.value.options
);
</script>
