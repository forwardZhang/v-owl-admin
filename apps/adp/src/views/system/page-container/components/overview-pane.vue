<template>
  <div class="overview-pane">
    <a-row :gutter="[18, 18]">
      <a-col v-for="item in highlights" :key="item.title" :xs="24" :lg="8">
        <a-card class="overview-pane__card" variant="borderless">
          <span class="overview-pane__eyebrow">{{ item.eyebrow }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
        </a-card>
      </a-col>
    </a-row>

    <a-card class="overview-pane__card" variant="borderless">
      <div class="overview-pane__section-head">
        <div>
          <span class="overview-pane__eyebrow">Quick Start</span>
          <h3>推荐接入姿势</h3>
        </div>
        <a-tag color="processing">Vue 3.5 + TypeScript</a-tag>
      </div>

      <div class="overview-pane__steps">
        <div v-for="item in setupSteps" :key="item.title" class="overview-pane__step">
          <strong>{{ item.title }}</strong>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
const highlights = [
  {
    description: '普通页面直接用 title + default slot，就能拿到统一的页面头部结构。',
    eyebrow: 'Single',
    title: '单内容模式'
  },
  {
    description: '顶部可完全由 tabs 驱动，适合系统设置、详情页、配置中心这类多面板页面。',
    eyebrow: 'Tabs',
    title: '多内容模式'
  },
  {
    description: 'tab 标题和内容都留了动态插槽，配置和插槽可以混搭，不会写着写着就撞墙。',
    eyebrow: 'Slots',
    title: '插槽优先'
  }
];

const setupSteps = [
  {
    description: '单页场景直接传 title；多页签场景传 tabs，并结合 v-model:activeKey 控制激活项。',
    title: '1. 先选容器模式'
  },
  {
    description: '顶部右侧统一用 extra 插槽放按钮、状态或筛选控件，视觉更稳，业务也更收敛。',
    title: '2. 把操作区收口到 extra'
  },
  {
    description:
      'tab 里如果遇到复杂布局，优先写 #tab-[key]，不够再配 component，扩展起来会更从容。',
    title: '3. 内容走插槽优先策略'
  }
];
</script>

<style scoped lang="less">
.overview-pane {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.overview-pane__card {
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.overview-pane__eyebrow {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(var(--app-primary-rgb), 0.1);
}

.overview-pane__card h3 {
  margin: 14px 0 10px;
  color: var(--app-text-primary);
  font-size: 22px;
}

.overview-pane__card p {
  margin: 0;
  color: var(--app-text-secondary);
  line-height: 1.8;
}

.overview-pane__section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.overview-pane__steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.overview-pane__step {
  padding: 18px;
  border: 1px solid var(--app-border);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.78);
}

.overview-pane__step strong {
  color: var(--app-text-primary);
  font-size: 16px;
}

.overview-pane__step p {
  margin-top: 10px;
}

@media (max-width: 992px) {
  .overview-pane__steps {
    grid-template-columns: 1fr;
  }
}
</style>
