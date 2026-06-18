<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-date-range-picker
      :value="value"
      :disabled="disabled"
      :placeholder="controlProps.placeholder"
      :style="[{ width: '100%' }, controlProps.style]"
      v-bind="controlProps"
      @update:value="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-date-range-picker>
  </ProField>
</template>

<script setup lang="ts">
import { DateRangePicker as ADateRangePicker } from 'antdv-next';
import type { RangePickerProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import type { ProFieldBaseProps } from '../../shared/types';

defineOptions({ name: 'ProRangePicker', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<RangePickerProps, keyof ProFieldBaseProps>, ProFieldBaseProps {}

const props = withDefaults(defineProps<ProFieldRuntimeProps>(), {
  ...DEFAULT_FIELD_RUNTIME_PROPS
});

const attrs = useAttrs();
const { value, setValue, mergedDisabled: disabled, controlProps } = useProField(props, attrs);
</script>
