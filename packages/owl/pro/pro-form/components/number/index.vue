<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-input-number
      :value="value"
      :disabled="disabled"
      :placeholder="inputPlaceholder"
      v-bind="controlProps"
      @update:value="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-input-number>
  </ProField>
</template>

<script setup lang="ts">
import { InputNumber as AInputNumber } from 'antdv-next';
import type { InputNumberProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import type { ProFieldBaseProps } from '../../shared/types';

defineOptions({ name: 'ProNumber', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<InputNumberProps, keyof ProFieldBaseProps>, ProFieldBaseProps {}

const props = withDefaults(defineProps<ProFieldRuntimeProps>(), {
  ...DEFAULT_FIELD_RUNTIME_PROPS
});

const attrs = useAttrs();
const {
  value,
  setValue,
  mergedDisabled: disabled,
  controlProps,
  inputPlaceholder
} = useProField(props, attrs);
</script>
