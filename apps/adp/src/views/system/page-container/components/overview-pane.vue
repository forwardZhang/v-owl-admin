<template>
  <div class="flex flex-col gap-3">
    <a-row :gutter="[18, 18]">
      <a-col v-for="item in highlights" :key="item.title" :xs="24" :lg="8">
        <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
          <span
            class="inline-flex h-[26px] items-center rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-2.5 text-xs font-bold uppercase tracking-[0.08em] text-app-primary"
          >
            {{ item.eyebrow }}
          </span>
          <h3 class="mb-2.5 mt-3.5 text-[22px] text-app-text-primary">{{ item.title }}</h3>
          <p class="leading-[1.8] text-app-text-secondary">{{ item.description }}</p>
        </a-card>
      </a-col>
    </a-row>

    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
      <div class="mb-5 flex items-start justify-between gap-4">
        <div>
          <span
            class="inline-flex h-[26px] items-center rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-2.5 text-xs font-bold uppercase tracking-[0.08em] text-app-primary"
          >
            Quick Start
          </span>
          <h3 class="mb-2.5 mt-3.5 text-[22px] text-app-text-primary">推荐接入姿势</h3>
        </div>
        <a-tag color="processing">Vue 3.5 + TypeScript</a-tag>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div
          v-for="item in setupSteps"
          :key="item.title"
          class="rounded-[20px] border border-app-border bg-white/80 p-[18px]"
        >
          <strong class="text-base text-app-text-primary">{{ item.title }}</strong>
          <p class="mt-2.5 leading-[1.8] text-app-text-secondary">{{ item.description }}</p>
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
