<template>
  <a-card class="h-full rounded-ant-lg shadow-app-soft" variant="borderless">
    <div class="mb-4 flex justify-between gap-3">
      <div>
        <span class="text-xs font-bold uppercase text-app-primary">Remote Result</span>
        <h3 class="mt-2 text-xl text-app-text-primary">{{ result?.planName || '等待生成方案' }}</h3>
      </div>
      <a-tag :color="levelColor">{{ result?.level || 'idle' }}</a-tag>
    </div>

    <a-skeleton v-if="loading" active :paragraph="{ rows: 5 }" />

    <template v-else-if="result">
      <p class="mb-4 leading-[1.8] text-app-text-secondary">{{ result.summary }}</p>

      <div class="mb-3.5 grid grid-cols-1 gap-2.5 md:grid-cols-3">
        <div
          v-for="item in result.metrics"
          :key="item.label"
          class="rounded-ant-lg border border-app-border bg-white/80 p-3"
        >
          <span class="block text-xs text-app-text-secondary">{{ item.label }}</span>
          <strong class="mt-1.5 block text-lg text-app-text-primary">{{ item.value }}</strong>
        </div>
      </div>

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
