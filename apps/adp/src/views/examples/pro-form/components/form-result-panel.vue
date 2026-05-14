<template>
  <a-card class="form-result-panel" variant="borderless">
    <div class="form-result-panel__head">
      <div>
        <span class="form-result-panel__eyebrow">Remote Result</span>
        <h3>{{ result?.planName || '等待生成方案' }}</h3>
      </div>
      <a-tag :color="levelColor">{{ result?.level || 'idle' }}</a-tag>
    </div>

    <a-skeleton v-if="loading" active :paragraph="{ rows: 5 }" />

    <template v-else-if="result">
      <p class="form-result-panel__summary">{{ result.summary }}</p>

      <div class="form-result-panel__metrics">
        <div v-for="item in result.metrics" :key="item.label" class="form-result-panel__metric">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </div>
      </div>

      <a-list size="small" :data-source="result.highlights">
        <template #renderItem="{ item }">
          <a-list-item>{{ item }}</a-list-item>
        </template>
      </a-list>

      <a-alert :message="result.action" show-icon type="info" />
    </template>

    <a-empty v-else description="提交表单后，这里展示按条件返回的远程结果" />
  </a-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ProFormInsightResult } from '@/api/examples';

const props = defineProps<{
  loading?: boolean;
  result?: ProFormInsightResult;
}>();

const levelColor = computed(() => {
  if (props.result?.level === 'high') {
    return 'red';
  }

  if (props.result?.level === 'medium') {
    return 'orange';
  }

  if (props.result?.level === 'low') {
    return 'green';
  }

  return 'default';
});
</script>

<style scoped lang="less">
.form-result-panel {
  height: 100%;
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.form-result-panel__head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.form-result-panel__eyebrow {
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.form-result-panel h3 {
  margin: 8px 0 0;
  color: var(--app-text-primary);
  font-size: 20px;
}

.form-result-panel__summary {
  margin: 0 0 16px;
  color: var(--app-text-secondary);
  line-height: 1.8;
}

.form-result-panel__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.form-result-panel__metric {
  padding: 12px;
  border: 1px solid var(--app-border);
  border-radius: var(--ant-border-radius-lg);
  background: rgba(255, 255, 255, 0.78);
}

.form-result-panel__metric span,
.form-result-panel__metric strong {
  display: block;
}

.form-result-panel__metric span {
  color: var(--app-text-secondary);
  font-size: 12px;
}

.form-result-panel__metric strong {
  margin-top: 6px;
  color: var(--app-text-primary);
  font-size: 18px;
}

@media (max-width: 768px) {
  .form-result-panel__metrics {
    grid-template-columns: 1fr;
  }
}
</style>
