<template>
  <div class="metric-strip">
    <div v-for="item in metrics" :key="item.label" class="metric-strip__item">
      <span>{{ item.label }}</span>
      <strong>{{ item.value }}</strong>
      <small>{{ item.trend }}</small>
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

<style scoped lang="less">
.metric-strip {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.metric-strip__item {
  min-height: 104px;
  padding: 18px;
  border: 1px solid var(--app-border);
  border-radius: var(--ant-border-radius-lg);
  background: rgba(255, 255, 255, 0.88);
}

.metric-strip__item span,
.metric-strip__item small {
  display: block;
  color: var(--app-text-secondary);
  font-size: 13px;
}

.metric-strip__item strong {
  display: block;
  margin: 10px 0 6px;
  color: var(--app-text-primary);
  font-size: 26px;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .metric-strip {
    grid-template-columns: 1fr;
  }
}
</style>
