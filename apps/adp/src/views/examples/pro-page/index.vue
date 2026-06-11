<template>
  <AppProLayout :tabs="tabs" @tab-change="onTabChange">
    <template #extra>
      <a-button type="primary">主要操作</a-button>
    </template>
  </AppProLayout>
</template>

<script setup lang="ts">
import AppProLayout, { type AppProLayoutTabItem } from '@/components/app-pro-layout/index.vue';

// 引入拆分后的子组件
import TabOverview from './components/tab-overview.vue';
import TabMetrics from './components/tab-metrics.vue';
import TabLogs from './components/tab-logs.vue';

// 组件配置直接写在 tabs 配置项里
const tabs: AppProLayoutTabItem[] = [
  { label: '概览', key: 'overview', auth: 'ExamplesProPageOverview', component: TabOverview },
  { label: '指标', key: 'metrics', auth: 'ExamplesProPageMetrics', component: TabMetrics },
  { label: '日志', key: 'logs', auth: 'ExamplesProPageLogs', component: TabLogs }
];

/**
 * Tab 切换回调
 * @param {string} key 切换后的目标 key
 */
const onTabChange = (key: string) => {
  console.log('Tab changed to:', key);
  // 在这里处理 tab 切换后的业务逻辑
};
</script>
