<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-rate :value="value" :disabled="disabled" v-bind="controlProps" @update:value="setValue">
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-rate>
  </ProField>
</template>

<script setup lang="ts">
import { Rate as ARate } from 'antdv-next';
import type { RateProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import type { ProFieldBaseProps } from '../../shared/types';

defineOptions({ name: 'ProRate', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<RateProps, keyof ProFieldBaseProps>, ProFieldBaseProps {}

const props = withDefaults(defineProps<ProFieldRuntimeProps>(), {
  ...DEFAULT_FIELD_RUNTIME_PROPS
});

const attrs = useAttrs();
const { value, setValue, mergedDisabled: disabled, controlProps } = useProField(props, attrs);
</script>
