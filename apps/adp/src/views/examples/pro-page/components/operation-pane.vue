<template>
  <div class="flex flex-col">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="16">
        <a-card class="h-full rounded-ant-lg shadow-app-soft" variant="borderless">
          <div class="mb-3 flex justify-between gap-4">
            <div>
              <span class="text-xs font-bold uppercase text-app-primary">Operation</span>
              <h3 class="mb-2.5 mt-2 text-[22px] text-app-text-primary">{{ title }}</h3>
            </div>
            <a-tag :color="statusColor">{{ statusText }}</a-tag>
          </div>
          <p class="mb-[18px] leading-[1.8] text-app-text-secondary">{{ description }}</p>
          <MetricStrip :metrics="metrics" />
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card class="flex h-full flex-col rounded-ant-lg shadow-app-soft" variant="borderless">
          <span class="text-xs font-bold uppercase text-app-primary">Extra Slot</span>
          <h3 class="mb-2.5 mt-2 text-[22px] text-app-text-primary">操作区独立维护</h3>
          <p class="mb-[18px] leading-[1.8] text-app-text-secondary">
            页面级按钮、状态标签、快捷筛选，都可以稳定放进 extra 插槽。
          </p>
          <a-space wrap>
            <a-button size="small">导出</a-button>
            <a-button size="small" type="primary">新建任务</a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import MetricStrip from './metric-strip.vue';

interface MetricItem {
  label: string;
  trend: string;
  value: string;
}

withDefaults(
  defineProps<{
    description?: string;
    metrics?: MetricItem[];
    statusColor?: string;
    statusText?: string;
    title?: string;
  }>(),
  {
    description:
      'ProPage 把页面顶部的 tabs、右侧操作区和主体滚动区统一收口，业务组件只需要专注自己的内容。',
    metrics: () => [
      {
        label: '今日任务',
        trend: '较昨日 +12%',
        value: '128'
      },
      {
        label: '自动化率',
        trend: '稳定运行中',
        value: '84%'
      },
      {
        label: '平均耗时',
        trend: '下降 18 分钟',
        value: '42m'
      }
    ],
    statusColor: 'processing',
    statusText: 'ProPage',
    title: '多区域内容承载'
  }
);
</script>
