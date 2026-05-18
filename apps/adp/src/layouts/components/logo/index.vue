<template>
  <div
    class="flex min-h-[var(--app-header-height)] items-center overflow-hidden border-b border-app-border px-5"
    :class="collapsed ? 'justify-center gap-0 px-0' : 'gap-3.5'"
  >
    <a-avatar
      class="bg-app-brand-gradient text-[13px] font-bold tracking-[0.08em] shadow-[0_18px_30px_rgba(var(--app-primary-rgb),0.22)]"
      :class="{ 'mx-auto': collapsed }"
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
defineProps<{
  collapsed: boolean;
}>();
</script>
