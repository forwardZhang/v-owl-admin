<template>
  <ProField v-bind="props">
    <template #default="{ value, setValue, fieldProps, disabled }">
      <a-slider
        v-bind="{ ...$attrs, ...fieldProps }"
        :value="value"
        :disabled="disabled"
        @update:value="setValue"
      >
        <template v-for="(_, s) in $slots" #[s]="sp">
          <slot :name="s" v-bind="sp ?? {}" />
        </template>
      </a-slider>
    </template>
  </ProField>
</template>

<script setup lang="ts">
import { Slider as ASlider } from 'antdv-next';
import type { SliderProps } from 'antdv-next';
import { ProField } from '../field';
import type { ProFieldProps } from '../../types';

defineOptions({ name: 'ProSlider', inheritAttrs: false });

const props = withDefaults(defineProps<ProFieldProps<SliderProps>>(), {
  disabled: undefined,
  readonly: undefined,
  visible: undefined
});
</script>
