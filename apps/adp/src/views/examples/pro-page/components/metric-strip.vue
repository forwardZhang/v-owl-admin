<template>
  <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
    <div
      v-for="item in metrics"
      :key="item.label"
      class="min-h-[104px] rounded-ant-lg border border-app-border bg-white/90 p-[18px]"
    >
      <span class="block text-[13px] text-app-text-secondary">{{ item.label }}</span>
      <strong class="my-2.5 mb-1.5 block text-[26px] leading-[1.2] text-app-text-primary">
        {{ item.value }}
      </strong>
      <small class="block text-[13px] text-app-text-secondary">{{ item.trend }}</small>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MetricItem {
  label: string;
  trend: string;
  value: string;
}

defineProps<{
  metrics: MetricItem[];
}>();
</script>
