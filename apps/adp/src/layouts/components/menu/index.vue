<template>
  <div class="menu flex-1 overflow-hidden px-3 pb-3.5 pt-2.5">
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
      class: 'text-sm text-app-primary'
    });
  }

  return h(
    'span',
    {
      class:
        'inline-grid h-6 w-6 place-items-center rounded-ant-lg bg-[rgba(var(--app-primary-rgb),0.12)] text-[11px] font-bold text-app-primary'
    },
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
