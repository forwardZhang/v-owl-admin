<template>
  <div class="app-menu">
    <a-menu
      v-model:open-keys="openKeys"
      :inline-collapsed="collapsed"
      mode="inline"
      :items="menuItems"
      :selected-keys="selectedKeys"
      :expand-icon="CaretDownOutlined"
      @click="handleMenuClick"
    >
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import {
  AppstoreOutlined,
  CaretDownOutlined,
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from '@antdv-next/icons';
import type { MenuProps } from 'antdv-next';
import { computed, h, ref, watch, type Component } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { MenuRecord } from '@/types/menu';

const props = defineProps<{
  collapsed: boolean;
  menus: MenuRecord[];
}>();

const route = useRoute();
const router = useRouter();
const openKeys = ref<string[]>([]);

type MenuItem = Exclude<MenuProps['items'], undefined>[number];

const menuIconMap: Record<string, Component> = {
  dashboard: DashboardOutlined,
  menus: AppstoreOutlined,
  roles: TeamOutlined,
  system: SettingOutlined,
  users: UserOutlined
};

function renderMenuIcon(item: MenuRecord) {
  const iconKey = String(item.icon || item.meta.icon || '');

  if (menuIconMap[iconKey]) {
    return h(menuIconMap[iconKey], {
      class: 'app-menu__icon-svg'
    });
  }

  return h(
    'span',
    { class: 'app-menu__icon' },
    item.icon || item.meta.icon || item.meta.title.slice(0, 2)
  );
}

function transformMenusToItems(menus: MenuRecord[]): MenuItem[] {
  return menus.map((item) => ({
    children: item.children?.length ? transformMenusToItems(item.children) : undefined,
    icon: renderMenuIcon(item),
    key: item.path,
    label: item.meta.title
  }));
}

function collectParentPaths(
  menus: MenuRecord[],
  targetPath: string,
  parents: string[] = []
): string[] {
  for (const item of menus) {
    if (item.path === targetPath) {
      return parents;
    }

    if (item.children?.length) {
      const result = collectParentPaths(item.children, targetPath, [...parents, item.path]);

      if (result.length) {
        return result;
      }
    }
  }

  return [];
}

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
.app-menu {
  flex: 1;
  padding: 8px 16px;
  overflow: hidden;
}

.app-menu__icon {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  color: var(--app-primary);
  font-size: 11px;
  font-weight: 700;
  background: rgba(var(--app-primary-rgb), 0.12);
}

.app-menu__expand,
.app-menu__icon-svg {
  color: var(--app-primary);
  font-size: 14px;
}

.app-menu :deep(.ant-menu) {
  height: 100%;
  border-inline-end: 0;
  background: transparent;
  overflow-y: auto;
}

.app-menu :deep(.ant-menu-item),
.app-menu :deep(.ant-menu-submenu-title) {
  height: 46px;
  line-height: 46px;
  margin-block: 6px;
  border-radius: 14px;
}

.app-menu :deep(.ant-menu-item-selected) {
  background: rgba(var(--app-primary-rgb), 0.12);
}

.app-menu :deep(.ant-menu-submenu-expand-icon) {
  display: inline-flex;
  align-items: center;
}
</style>
