<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-checkbox-group
      :value="value"
      :disabled="disabled"
      :options="options"
      v-bind="controlProps"
      @update:value="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-checkbox-group>
  </ProField>
</template>

<script setup lang="ts">
import { CheckboxGroup as ACheckboxGroup } from 'antdv-next';
import type { CheckboxGroupProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import { useFieldOptions } from '../../composables/use-field-options';
import type { ProFieldBaseProps, ProFieldData } from '../../shared/types';

defineOptions({ name: 'ProCheckbox', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<CheckboxGroupProps, keyof ProFieldBaseProps>, ProFieldBaseProps {
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
