<template>
  <ProField v-bind="props">
    <template v-if="$slots.label" #label>
      <slot name="label" />
    </template>
    <a-input-password
      :value="value"
      :disabled="disabled"
      :placeholder="inputPlaceholder"
      v-bind="controlProps"
      @update:value="setValue"
    >
      <template v-for="(_, s) in $slots" #[s]="sp">
        <slot v-if="s !== 'label'" :name="s" v-bind="sp ?? {}" />
      </template>
    </a-input-password>
  </ProField>
</template>

<script setup lang="ts">
import { InputPassword as AInputPassword } from 'antdv-next';
import type { InputPasswordProps } from 'antdv-next';
import { DEFAULT_FIELD_RUNTIME_PROPS, ProField, useProField } from '../field';
import { useAttrs } from 'vue';
import type { ProFieldBaseProps } from '../../shared/types';

defineOptions({ name: 'ProPassword', inheritAttrs: false });

interface ProFieldRuntimeProps
  extends /* @vue-ignore */ Omit<InputPasswordProps, keyof ProFieldBaseProps>, ProFieldBaseProps {}

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
