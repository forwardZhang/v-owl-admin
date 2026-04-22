<template>
  <div class="menu">
    <a-menu
      v-model:open-keys="openKeys"
      :inline-collapsed="collapsed"
      mode="inline"
      :items="menuItems"
      :selected-keys="selectedKeys"
      @click="handleMenuClick"
    >
    </a-menu>
  </div>
</template>

<script setup lang="ts">
import type { MenuProps } from 'antdv-next';
import { computed, h, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { MenuRecord } from '@/types/menu';
import { resolveNavIcon } from '../shared/nav-icons';

const props = defineProps<{
  collapsed: boolean;
  menus: MenuRecord[];
}>();

const route = useRoute();
const router = useRouter();
const openKeys = ref<string[]>([]);

type MenuItem = Exclude<MenuProps['items'], undefined>[number];

function renderMenuIcon(item: MenuRecord) {
  const iconKey = String(item.icon || item.meta.icon || '');
  const iconComponent = resolveNavIcon(iconKey);

  if (iconComponent) {
    return h(iconComponent, {
      class: 'menu__icon-svg'
    });
  }

  return h(
    'span',
    { class: 'menu__icon' },
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
.menu {
  flex: 1;
  padding: 10px 12px 14px;
  overflow: hidden;
}

.menu__icon {
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: var(--ant-border-radius-lg);
  color: var(--app-primary);
  font-size: 11px;
  font-weight: 700;
  background: rgba(var(--app-primary-rgb), 0.12);
}

.menu__icon-svg {
  color: var(--app-primary);
  font-size: 14px;
}

.menu__expand {
  color: var(--app-primary);
  font-size: 12px;
  transition: transform 0.2s ease;
}

.menu :deep(.ant-menu) {
  height: 100%;
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
  background: rgba(var(--app-primary-rgb), 0.12);
}

.menu :deep(.ant-menu-submenu-expand-icon) {
  display: inline-flex;
  align-items: center;
}

.menu :deep(.ant-menu-submenu-open .menu__expand) {
  transform: rotate(180deg);
}
</style>
