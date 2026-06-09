<template>
  <div
    class="page-header flex items-center justify-between gap-6 rounded-ant-lg p-6 shadow-app-soft max-[900px]:flex-col max-[900px]:items-start"
  >
    <div class="min-w-0">
      <span
        v-if="eyebrow"
        class="inline-flex h-7 items-center rounded-ant-lg bg-[rgba(var(--app-primary-rgb),0.1)] px-3 text-xs font-bold uppercase tracking-[0.08em] text-app-primary"
      >
        {{ eyebrow }}
      </span>
      <h1 class="mb-2.5 mt-3.5 text-3xl text-app-text-primary">{{ title }}</h1>
      <p v-if="description" class="max-w-[640px] leading-[1.8] text-app-text-secondary">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.actions" class="flex-none">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
  description?: string;
}>();
</script>

<style scoped lang="less">
.page-header {
  background:
    radial-gradient(circle at top left, rgba(var(--app-primary-rgb), 0.14) 0%, transparent 36%),
    linear-gradient(135deg, var(--app-surface-strong) 0%, var(--app-surface-subtle) 100%);
  border: 1px solid var(--app-border);
}
</style>
