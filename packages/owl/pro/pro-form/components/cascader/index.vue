<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-cascader
      :value="value"
      :disabled="disabled"
      :options="options"
      :placeholder="selectPlaceholder"
      :style="[{ width: '100%' }, controlProps.style]"
      v-bind="controlProps"
      @update:value="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-cascader>
  </ProField>
</template>

<script setup lang="ts">
import { Cascader as ACascader } from 'antdv-next';
import type { CascaderProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import { useFieldOptions } from '../../composables/use-field-options';
import type { ProFieldBaseProps, ProFieldData } from '../../shared/types';

defineOptions({ name: 'ProCascader', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<CascaderProps, keyof ProFieldBaseProps>, ProFieldBaseProps {
  source?: ProFieldData;
}

const props = withDefaults(defineProps<ProFieldRuntimeProps>(), {
  ...DEFAULT_FIELD_RUNTIME_PROPS,
  source: undefined
});

const attrs = useAttrs();
const {
  value,
  setValue,
  mergedDisabled: disabled,
  controlProps,
  selectPlaceholder
} = useProField(props, attrs);
const { options } = useFieldOptions(
  () => props.source,
  () => controlProps.value.options
);
</script>
