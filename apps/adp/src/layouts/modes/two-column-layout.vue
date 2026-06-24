<template>
  <div class="flex h-screen w-full overflow-hidden bg-transparent">
    <!-- 第一列：一级图标轨道 -->
    <MenuRail :menus="roots" :active-key="activeRootPath" @select="handleSelect" />

    <!-- 第二列：当前一级的子菜单 -->
    <a-layout-sider
      v-if="sideMenus.length"
      class="two-col-sub app-shell-sider z-10 flex h-full flex-none flex-col border-r border-app-border"
      :collapsed="appStore.sidebarCollapsed"
      :collapsed-width="SIDEBAR_COLLAPSED_WIDTH"
      collapsible
      :trigger="null"
      :theme="appStore.isDark ? 'dark' : 'light'"
      :width="214"
    >
      <div
        class="flex min-h-app-header items-center border-b border-app-border transition-all duration-300"
        :class="appStore.sidebarCollapsed ? 'justify-center px-0' : 'px-5'"
      >
        <strong
          class="truncate text-[14px] font-[800] text-app-text-primary transition-opacity duration-300"
          :class="appStore.sidebarCollapsed ? 'w-0 opacity-0' : 'opacity-100'"
        >
          {{ activeRoot?.title }}
        </strong>
      </div>

      <!-- 二级菜单 -->
      <Menu
        class="pt-3"
        :menus="sideMenus"
        :collapsed="appStore.sidebarCollapsed"
        :theme="appStore.isDark ? 'dark' : 'light'"
      />

      <!-- 侧边栏底部：收缩/展开控制 -->
      <div
        class="sider-footer mt-auto border-t border-app-border p-2 overflow-hidden shrink-0 bg-app-surface flex justify-center"
      >
        <button
          type="button"
          class="flex items-center justify-center p-2 hover:bg-app-surface-soft rounded-lg text-app-text-secondary hover:text-app-primary transition-all cursor-pointer w-full border-0 bg-transparent"
          @click="appStore.setSidebarCollapsed(!appStore.sidebarCollapsed)"
        >
          <menu-unfold-outlined v-if="appStore.sidebarCollapsed" class="text-sm" />
          <menu-fold-outlined v-else class="text-sm" />
        </button>
      </div>
    </a-layout-sider>

    <!-- 内容区 -->
    <a-layout
      class="flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-app-bg-page/35 dark:bg-transparent"
    >
      <header
        class="app-shell-header flex min-h-app-header flex-none items-center justify-between gap-[18px] border-b border-app-border px-4"
      >
        <!-- 面包屑 -->
        <div class="flex items-center gap-6 min-w-0 flex-1">
          <Breadcrumb class="shrink-0" />
        </div>
        <HeaderActions />
      </header>

      <Main />
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@antdv-next/icons';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumb from '../components/breadcrumb.vue';
import HeaderActions from '../components/header-actions.vue';
import Main from '../components/main.vue';
import Menu from '../components/menu.vue';
import MenuRail from '../components/menu-rail.vue';
import { findActiveRoot, resolveFirstLeafPath } from '../components/menu-shared';
import { SIDEBAR_COLLAPSED_WIDTH } from '../constants';
import { useAccessStore } from '@/store/modules/access';
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'TwoColumnLayout'
});

const route = useRoute();
const router = useRouter();
const accessStore = useAccessStore();
const appStore = useAppStore();

const roots = computed(() => accessStore.accessMenus);
const activeRoot = computed(() => findActiveRoot(roots.value, route.path) ?? roots.value[0]);
const activeRootPath = computed(() => activeRoot.value?.path ?? '');
const sideMenus = computed(() => activeRoot.value?.children ?? []);

function handleSelect(key: string) {
  const root = roots.value.find((item) => item.path === key);

  if (root) {
    router.push(resolveFirstLeafPath(root));
  }
}
</script>

<style scoped lang="less">
.two-col-sub {
  background: var(--app-surface);
  backdrop-filter: blur(18px);
}
.sider-footer {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.02);
}
</style>
