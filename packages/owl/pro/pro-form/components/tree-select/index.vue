<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-tree-select
      :value="value"
      :disabled="disabled"
      :tree-data="options"
      :field-names="
        controlProps.fieldNames ?? { label: 'label', value: 'value', children: 'children' }
      "
      :placeholder="selectPlaceholder"
      :style="[{ width: '100%' }, controlProps.style]"
      v-bind="controlProps"
      @update:value="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-tree-select>
  </ProField>
</template>

<script setup lang="ts">
import { TreeSelect as ATreeSelect } from 'antdv-next';
import type { TreeSelectProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import { useFieldOptions } from '../../composables/use-field-options';
import type { ProFieldBaseProps, ProFieldData } from '../../shared/types';

defineOptions({ name: 'ProTreeSelect', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<TreeSelectProps, keyof ProFieldBaseProps>, ProFieldBaseProps {
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
  () => controlProps.value.treeData
);
</script>
