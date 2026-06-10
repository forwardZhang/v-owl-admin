<template>
  <div class="menu flex-1 overflow-hidden px-3 pb-3.5 pt-2.5">
    <a-menu
      v-model:open-keys="openKeys"
      :inline-collapsed="collapsed"
      mode="inline"
      :theme="theme || 'light'"
      :items="menuItems"
      :selected-keys="selectedKeys"
      @click="handleMenuClick"
    >
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { MenuRecordRaw } from '@/types/menu';
import { collectParentPaths, transformMenusToItems } from './menu-shared';

const props = defineProps<{
  collapsed: boolean;
  menus: MenuRecordRaw[];
  theme?: 'light' | 'dark';
}>();

const route = useRoute();
const router = useRouter();
const openKeys = ref<string[]>([]);

const menuItems = computed(() => transformMenusToItems(props.menus));
const selectedKeys = computed(() => [route.meta.activeMenu || route.path]);

watch(
  () => [route.path, props.menus, props.collapsed] as const,
  () => {
    if (props.collapsed) {
      openKeys.value = [];
      return;
    }

    openKeys.value = collectParentPaths(props.menus, route.path);
  },
  {
    immediate: true
  }
);

function handleMenuClick(info: { key: string }) {
  router.push(info.key);
}
</script>

<style scoped lang="less">
.menu :deep(.ant-menu) {
  height: 100%;
  font-size: 13px;
  border-inline-end: 0;
  background: transparent;
  overflow-y: auto;
}

.menu :deep(.ant-menu-item),
.menu :deep(.ant-menu-submenu-title) {
  height: 40px;
  line-height: 40px;
  margin-block: 4px;
  border-radius: var(--ant-border-radius-lg);
}

.menu :deep(.ant-menu-item-selected) {
  background: var(--app-primary-soft);
  color: var(--app-primary);
  font-weight: 700;
}

.menu :deep(.ant-menu-submenu-expand-icon) {
  display: inline-flex;
  align-items: center;
}

.menu :deep(.ant-menu-submenu-open .menu__expand) {
  transform: rotate(180deg);
}
</style>
