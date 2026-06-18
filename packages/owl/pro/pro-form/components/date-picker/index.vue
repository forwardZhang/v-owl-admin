<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-date-picker
      :value="value"
      :disabled="disabled"
      :placeholder="selectPlaceholder"
      v-bind="controlProps"
      @update:value="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-date-picker>
  </ProField>
</template>

<script setup lang="ts">
import { DatePicker as ADatePicker } from 'antdv-next';
import type { DatePickerProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import type { ProFieldBaseProps } from '../../shared/types';

defineOptions({ name: 'ProDatePicker', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<DatePickerProps, keyof ProFieldBaseProps>, ProFieldBaseProps {}

const props = withDefaults(defineProps<ProFieldRuntimeProps>(), {
  ...DEFAULT_FIELD_RUNTIME_PROPS
});

const attrs = useAttrs();
const {
  value,
  setValue,
  mergedDisabled: disabled,
  controlProps,
  selectPlaceholder
} = useProField(props, attrs);
</script>
