<template>
  <div class="operation-pane">
    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="16">
        <a-card class="operation-pane__card" variant="borderless">
          <div class="operation-pane__head">
            <div>
              <span class="operation-pane__eyebrow">Operation</span>
              <h3>多区域内容承载</h3>
            </div>
            <a-tag color="processing">ProPage</a-tag>
          </div>
          <p>
            ProPage 把页面顶部的
            tabs、右侧操作区和主体滚动区统一收口，业务组件只需要专注自己的内容。
          </p>
          <MetricStrip :metrics="metrics" />
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="8">
        <a-card class="operation-pane__card operation-pane__stack" variant="borderless">
          <span class="operation-pane__eyebrow">Extra Slot</span>
          <h3>操作区独立维护</h3>
          <p>页面级按钮、状态标签、快捷筛选，都可以稳定放进 extra 插槽。</p>
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

const metrics = [
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
];
</script>

<style scoped lang="less">
.operation-pane {
  display: flex;
  flex-direction: column;
}

.operation-pane__card {
  height: 100%;
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.operation-pane__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.operation-pane__eyebrow {
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.operation-pane__card h3 {
  margin: 8px 0 10px;
  color: var(--app-text-primary);
  font-size: 22px;
}

.operation-pane__card p {
  margin: 0 0 18px;
  color: var(--app-text-secondary);
  line-height: 1.8;
}

.operation-pane__stack {
  display: flex;
  flex-direction: column;
}
</style>
