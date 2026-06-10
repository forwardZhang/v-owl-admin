<template>
  <!-- 轨道变体：仅图标，居中 -->
  <div
    v-if="variant === 'rail'"
    class="flex min-h-app-header items-center justify-center border-b border-app-border"
  >
    <div class="brand__mark shrink-0">O</div>
  </div>

  <!-- sider / header 变体 -->
  <div
    v-else
    class="flex items-center overflow-hidden"
    :class="[
      variant === 'sider'
        ? 'min-h-app-header border-b border-app-border px-[18px]'
        : 'h-app-header',
      collapsed ? 'justify-center gap-0 px-0' : 'gap-[10px]'
    ]"
  >
    <div class="brand__mark shrink-0">O</div>
    <div
      class="overflow-hidden transition-[width,opacity,transform] duration-200 ease-out flex flex-col gap-[2px]"
      :class="collapsed ? 'w-0 -translate-x-2.5 opacity-0' : 'w-[132px] opacity-100'"
    >
      <div class="flex w-[132px] min-w-0 flex-col">
        <strong
          class="brand__name truncate text-[14px] font-[800] leading-[1.2] text-app-text-primary"
          >{{ APP_TITLE }}</strong
        >
        <span class="brand__desc text-[11px] leading-[1.2] text-app-text-tertiary"
          >Enterprise Console</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { APP_TITLE } from '@/constants/app';

withDefaults(
  defineProps<{
    collapsed?: boolean;
    variant?: 'sider' | 'header' | 'rail';
  }>(),
  {
    collapsed: false,
    variant: 'sider'
  }
);
</script>

<style scoped lang="less">
.brand__mark {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 8px;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, var(--app-primary), #00a3ff);
  box-shadow: 0 10px 20px rgba(var(--app-primary-rgb), 0.24);
}
</style>
