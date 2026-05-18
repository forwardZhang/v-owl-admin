<template>
  <div class="flex flex-col gap-2.5">
    <div class="grid grid-cols-1 gap-2.5 md:grid-cols-3">
      <button
        v-for="item in options"
        :key="item.value"
        class="min-h-[82px] cursor-pointer rounded-ant-lg border border-app-border bg-white p-3 text-left transition duration-200 disabled:cursor-not-allowed disabled:opacity-[0.58]"
        :class="{
          'border-app-primary shadow-[0_0_0_2px_rgba(var(--app-primary-rgb),0.12)]':
            modelValue === item.value
        }"
        :disabled="disabled"
        type="button"
        @click="modelValue = item.value"
      >
        <strong class="block text-sm text-app-text-primary">{{ item.label }}</strong>
        <span class="mt-1.5 block text-xs leading-normal text-app-text-secondary">
          {{ item.description }}
        </span>
      </button>
    </div>
    <a-input v-model:value="modelValue"></a-input>
    <div
      v-if="$slots.note || $slots.action"
      class="flex items-center justify-between gap-3 text-xs text-app-text-secondary"
    >
      <slot name="note" />
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAttrs } from 'vue';

interface ScenarioOption {
  description: string;
  label: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    options?: ScenarioOption[];
  }>(),
  {
    disabled: false,
    options: () => []
  }
);

const attrs = useAttrs();
console.log('attr', attrs);
console.log('attpropsr', props);

const modelValue = defineModel<string>('modelValue', {
  default: ''
});
</script>
