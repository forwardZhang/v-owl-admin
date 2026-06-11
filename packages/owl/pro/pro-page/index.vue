<script setup lang="ts">
/**
 * ProPage 页面级通用布局骨架
 * 提供标准的三段式布局：搜索区 (search) -> 自定义操作区 (toolbar) -> 主体内容区 (main)
 */
import { useSlots } from 'vue';

// 预留的 props，方便后期扩展
interface ProPageProps {
  /** 区域之间的上下间距 (px) */
  gap?: number;
  /** 搜索区是否展示为卡片样式 */
  searchCard?: boolean;
  /** 主体内容区是否展示为卡片样式 */
  bodyCard?: boolean;
}

const props = withDefaults(defineProps<ProPageProps>(), {
  gap: 16,
  searchCard: true,
  bodyCard: true
});

const slots = useSlots();
</script>

<template>
  <div class="pro-page-container" :style="{ gap: `${props.gap}px` }">
    <!-- 1. 搜索区域 -->
    <div
      v-if="slots.search"
      class="pro-page-section pro-page-search"
      :class="{ 'is-card': props.searchCard }"
    >
      <slot name="search"></slot>
    </div>
    <!-- 2. 主体区域 (Toolbar + Main) -->
    <div class="pro-page-section pro-page-body" :class="{ 'is-card': props.bodyCard }">
      <!-- 2.1 自定义操作区 (Toolbar) -->
      <div v-if="slots.toolbar" class="pro-page-toolbar">
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
  height: 100%; /* 继承父级高度，方便做内容铺满及内部滚动 */
  box-sizing: border-box;
}

.pro-page-section {
  width: 100%;
  box-sizing: border-box;
}

/* 卡片样式：你可以根据项目的全局变量替换背景色和圆角 */
.is-card {
  background-color: var(--color-bg-container, #ffffff);
  border-radius: 8px;
  padding: 16px;
  /* 柔和的阴影，增加一点呼吸感 */
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 主体区域，让它占满剩余空间 */
.pro-page-body {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* 操作区域样式 */
.pro-page-toolbar {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-start; /* 默认靠左，可根据插槽内容自由排列 */
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

/* 主体内容区域 */
.pro-page-content {
  flex: 1;
  overflow: auto; /* 当内容很长时，内部出现滚动条，不撑破页面 */
}
</style>
