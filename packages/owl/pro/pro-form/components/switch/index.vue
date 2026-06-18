<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-switch
      :checked="value"
      :disabled="disabled"
      v-bind="controlProps"
      @update:checked="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-switch>
  </ProField>
</template>

<script setup lang="ts">
import { Switch as ASwitch } from 'antdv-next';
import type { SwitchProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import type { ProFieldBaseProps } from '../../shared/types';

defineOptions({ name: 'ProSwitch', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<SwitchProps, keyof ProFieldBaseProps>, ProFieldBaseProps {}

const props = withDefaults(defineProps<ProFieldRuntimeProps>(), {
  ...DEFAULT_FIELD_RUNTIME_PROPS
});

const attrs = useAttrs();
const { value, setValue, mergedDisabled: disabled, controlProps } = useProField(props, attrs);
</script>
