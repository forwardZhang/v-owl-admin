<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-select
      :allow-clear="true"
      :disabled="disabled"
      :options="options"
      :loading="loading || controlProps.loading"
      :placeholder="selectPlaceholder"
      :style="[{ width: '100%' }, controlProps.style]"
      :value="value"
      v-bind="controlProps"
      @update:value="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-select>
  </ProField>
</template>

<script setup lang="ts">
import { Select as ASelect } from 'antdv-next';
import type { SelectProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import { useFieldOptions } from '../../composables/use-field-options';
import type { ProFieldBaseProps, ProFieldData } from '../../shared/types';

defineOptions({ name: 'ProSelect', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<SelectProps, keyof ProFieldBaseProps>, ProFieldBaseProps {
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
const { options, loading } = useFieldOptions(
  () => props.source,
  () => controlProps.value.options
);
</script>
