<template>
  <div class="slot-pane">
    <a-row :gutter="[16, 16]">
      <a-col v-for="item in slots" :key="item.name" :xs="24" :lg="8">
        <a-card class="slot-pane__card" variant="borderless">
          <span>{{ item.name }}</span>
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
const slots = [
  {
    description: '覆盖页签标题，适合加状态、徽标或轻量统计。',
    name: 'tab-label-[key]',
    title: '自定义标签'
  },
  {
    description: '覆盖指定页签内容，复杂业务页可以拆成独立组件。',
    name: 'tab-[key]',
    title: '自定义内容'
  },
  {
    description: '统一承载页面级操作，避免每个业务区自己摆按钮。',
    name: 'extra',
    title: '右侧操作'
  }
];
</script>

<style scoped lang="less">
.slot-pane__card {
  min-height: 178px;
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.slot-pane__card span {
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
}

.slot-pane__card strong {
  display: block;
  margin: 12px 0 10px;
  color: var(--app-text-primary);
  font-size: 20px;
}

.slot-pane__card p {
  margin: 0;
  color: var(--app-text-secondary);
  line-height: 1.8;
}
</style>
