<script setup lang="ts">
/**
 * ProPage 页面级通用布局骨架（对齐 Ant Design Pro PageContainer）
 *
 * 标准三段式布局：搜索区 (search) -> 主体内容区 (main)
 * - 自带灰色页面底色，内部区块以白色卡片浮起，search / main 之间天然分隔
 * - 不依赖外层背景；无论放在哪个容器里都呈现统一观感
 * - search 区 padding 紧凑（12px），适合查询表单；main 区 padding 标准（16px）
 */
import { computed, useSlots } from 'vue';

interface ProPageProps {
  /** 区块之间的纵向间距 (px) */
  gap?: number;
  /** 搜索区内边距 (px)，默认 12 */
  searchPadding?: number;
  /** 主体区内边距 (px)，默认 16 */
  bodyPadding?: number;
  /** 搜索区是否渲染为白卡片（默认 true） */
  searchCard?: boolean;
  /** 主体区是否渲染为白卡片（默认 true） */
  bodyCard?: boolean;
  /** 页面底色，默认透明（继承父级）；传 'gray' 强制灰底 */
  background?: 'transparent' | 'gray';
}

const props = withDefaults(defineProps<ProPageProps>(), {
  gap: 12,
  searchPadding: 12,
  bodyPadding: 16,
  searchCard: true,
  bodyCard: true,
  background: 'transparent'
});

const slots = useSlots();

const containerStyle = computed(() => ({
  gap: `${props.gap}px`,
  '--pro-page-search-padding': `${props.searchPadding}px`,
  '--pro-page-body-padding': `${props.bodyPadding}px`
}));

const onlyMain = computed(() => !slots.search);
</script>

<template>
  <div
    class="pro-page-container"
    :class="[`pro-page--bg-${props.background}`, { 'pro-page--only-main': onlyMain }]"
    :style="containerStyle"
  >
    <!-- 1. 搜索区域 -->
    <div
      v-if="!onlyMain"
      class="pro-page-section pro-page-search"
      :class="{ 'is-card': props.searchCard }"
    >
      <slot name="search"></slot>
    </div>

    <!-- 2. 主体区域 -->
    <div class="pro-page-section pro-page-body" :class="{ 'is-card': props.bodyCard }">
      <!-- 2.1 自定义操作区 (Toolbar) -->
      <div v-if="$slots.toolbar" class="pro-page-toolbar">
        <slot name="toolbar"></slot>
      </div>

      <!-- 2.2 主体内容区域 (Main) -->
      <div class="pro-page-content">
        <slot name="main"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pro-page-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
}

/* 页面底色：默认透明继承父级；显式 gray 时呈现中后台标准灰底 */
.pro-page--bg-transparent {
  background: transparent;
}
.pro-page--bg-gray {
  background-color: #f0f2f5;
}
:global(html.dark) .pro-page--bg-gray {
  background-color: #0b1220;
}

/* 只有 main 区时，去除多余间距，让主体直接铺满 */
.pro-page--only-main.pro-page--bg-transparent {
  gap: 0;
}

.pro-page-section {
  width: 100%;
  box-sizing: border-box;
}

/* 白卡片区块 */
.is-card {
  background-color: var(--color-bg-container, #ffffff);
  border-radius: 12px;
  box-shadow:
    0 4px 18px -4px rgba(19, 35, 64, 0.04),
    0 1px 4px rgba(19, 35, 64, 0.02);
  border: 1px solid var(--app-border, #e3e8f2);
  transition: all 0.3s ease;
}
:global(html.dark) .is-card {
  background-color: var(--color-bg-container, #141414);
}

/* 搜索区：紧凑 padding（默认 12px），查询表单更宽松 */
.pro-page-search.is-card {
  padding: var(--pro-page-search-padding, 12px);
}

/* 主体区 */
.pro-page-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.pro-page-body.is-card {
  padding: var(--pro-page-body-padding, 16px);
}

/* Toolbar 与下方内容间距 */
.pro-page-toolbar {
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

/* 主体内容区：允许内部滚动（与表格等组件配合） */
.pro-page-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
</style>
