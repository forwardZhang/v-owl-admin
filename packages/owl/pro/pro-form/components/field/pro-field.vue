<template>
  <template v-if="show">
    <!-- 栅格模式：自动包一层 a-col -->
    <a-col v-if="config.grid" v-bind="colProps">
      <a-form-item v-bind="formItemBindings">
        <template v-if="hasLabelSlot" #label>
          <slot name="label">
            <component :is="label" />
          </slot>
        </template>
        <slot v-bind="slotScope" />
      </a-form-item>
    </a-col>

    <!-- 普通堆叠 -->
    <a-form-item v-else v-bind="formItemBindings">
      <template v-if="hasLabelSlot" #label>
        <slot name="label">
          <component :is="label" />
        </slot>
      </template>
      <slot v-bind="slotScope" />
    </a-form-item>
  </template>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue';
import { useProField } from '../../composables/use-pro-field';
import { proFieldSharedProps } from '../../shared/shared-props';

defineOptions({ name: 'ProField', inheritAttrs: false });

const props = defineProps(proFieldSharedProps);
const slots = useSlots();

const { config, show, value, setValue, mergedDisabled, colProps, formItemBindings } =
  useProField(props);

/** 自定义 label：函数式 label 或父级传入的 #label 插槽 */
const label = computed(() => props.label);
const hasLabelSlot = computed(() => !!slots.label);

/**
 * 传给默认插槽（即具体控件）的作用域：
 * - value / setValue：当前值与写值（控件按需绑定 value 或 checked）
 * - disabled / readonly / placeholder / label：常用透传
 */
const slotScope = computed(() => ({
  value: value.value,
  setValue,
  disabled: mergedDisabled.value,
  readonly: props.readonly,
  placeholder: props.placeholder,
  label: typeof props.label === 'string' ? props.label : undefined
}));
</script>
