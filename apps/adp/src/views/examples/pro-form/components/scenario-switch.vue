<template>
  <div class="scenario-switch" :class="{ 'is-disabled': disabled }">
    <div class="scenario-switch__options">
      <button
        v-for="item in options"
        :key="item.value"
        class="scenario-switch__option"
        :class="{ 'is-active': modelValue === item.value }"
        :disabled="disabled"
        type="button"
        @click="modelValue = item.value"
      >
        <strong>{{ item.label }}</strong>
        <span>{{ item.description }}</span>
      </button>
    </div>

    <div v-if="$slots.note || $slots.action" class="scenario-switch__footer">
      <slot name="note" />
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface ScenarioOption {
  description: string;
  label: string;
  value: string;
}

withDefaults(
  defineProps<{
    disabled?: boolean;
    options?: ScenarioOption[];
  }>(),
  {
    disabled: false,
    options: () => []
  }
);

const modelValue = defineModel<string>('modelValue', {
  default: ''
});
</script>

<style scoped lang="less">
.scenario-switch {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scenario-switch__options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.scenario-switch__option {
  min-height: 82px;
  padding: 12px;
  border: 1px solid var(--app-border);
  border-radius: var(--ant-border-radius-lg);
  text-align: left;
  background: #fff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.scenario-switch__option strong,
.scenario-switch__option span {
  display: block;
}

.scenario-switch__option strong {
  color: var(--app-text-primary);
  font-size: 14px;
}

.scenario-switch__option span {
  margin-top: 6px;
  color: var(--app-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}

.scenario-switch__option.is-active {
  border-color: var(--app-primary);
  box-shadow: 0 0 0 2px rgba(var(--app-primary-rgb), 0.12);
}

.scenario-switch__option:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.scenario-switch__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: var(--app-text-secondary);
  font-size: 12px;
}

@media (max-width: 768px) {
  .scenario-switch__options {
    grid-template-columns: 1fr;
  }
}
</style>
