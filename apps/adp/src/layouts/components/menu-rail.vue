<template>
  <div class="menu-rail flex w-[84px] flex-none flex-col border-r border-app-border">
    <Logo variant="rail" />
    <nav class="flex flex-1 flex-col gap-1 overflow-y-auto px-2.5 py-3">
      <button
        v-for="item in menus"
        :key="item.path"
        type="button"
        class="rail-item"
        :class="{ 'is-active': item.path === activeKey }"
        @click="emit('select', item.path)"
      >
        <component :is="iconOf(item)" class="text-lg" />
        <span class="rail-item__label">{{ item.title }}</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { AppstoreOutlined } from '@antdv-next/icons';
import type { MenuRecordRaw } from '@/types/menu';
import Logo from './logo.vue';
import { resolveNavIcon } from './nav-icons';

defineProps<{
  menus: MenuRecordRaw[];
  activeKey: string;
}>();

const emit = defineEmits<{
  select: [key: string];
}>();

function iconOf(item: MenuRecordRaw) {
  return resolveNavIcon(item.icon ?? '') || AppstoreOutlined;
}
</script>

<style scoped lang="less">
.menu-rail {
  background: var(--app-surface);
  backdrop-filter: blur(18px);
}

.rail-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 10px 4px;
  cursor: pointer;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--app-text-tertiary);
  transition: all 0.2s ease;

  &:hover {
    color: var(--app-primary);
    background: rgba(var(--app-primary-rgb), 0.1);
  }

  &.is-active {
    color: #fff;
    background: var(--app-primary);
    box-shadow: 0 8px 18px rgba(var(--app-primary-rgb), 0.32);
  }
}

.rail-item__label {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
  text-align: center;
}
</style>
