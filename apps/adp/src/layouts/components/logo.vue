<template>
  <!-- 轨道变体：仅图标，居中 -->
  <div
    v-if="variant === 'rail'"
    class="flex min-h-app-header items-center justify-center border-b border-app-border"
  >
    <a-avatar
      class="logo-avatar shrink-0 bg-app-brand-gradient text-[13px] font-bold tracking-[0.08em]"
      :size="38"
    >
      VO
    </a-avatar>
  </div>

  <!-- sider / header 变体 -->
  <div
    v-else
    class="flex items-center overflow-hidden"
    :class="[
      variant === 'sider' ? 'min-h-app-header border-b border-app-border px-5' : 'h-app-header',
      collapsed ? 'justify-center gap-0 px-0' : 'gap-3.5'
    ]"
  >
    <a-avatar
      class="logo-avatar shrink-0 bg-app-brand-gradient text-[13px] font-bold tracking-[0.08em]"
      :size="38"
    >
      VO
    </a-avatar>
    <div
      class="overflow-hidden transition-[width,opacity,transform] duration-200 ease-out"
      :class="collapsed ? 'w-0 -translate-x-2.5 opacity-0' : 'w-[132px] opacity-100'"
    >
      <div class="flex w-[132px] min-w-0 flex-col">
        <strong class="whitespace-nowrap text-sm font-bold text-app-text-primary">Owl Admin</strong>
        <span class="whitespace-nowrap text-xs text-app-text-tertiary">Enterprise Center</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
.logo-avatar {
  box-shadow: 0 2px 4px rgba(var(--app-primary-rgb), 0.22);
  background: rgba(var(--app-primary-rgb), 0.22);
}
</style>
