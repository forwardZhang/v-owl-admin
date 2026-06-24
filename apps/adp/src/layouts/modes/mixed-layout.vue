<template>
  <a-layout class="flex h-screen w-full flex-col overflow-hidden bg-transparent">
    <!-- 顶部：Logo + 一级横向菜单 + 操作区 -->
    <header
      class="app-shell-header flex min-h-app-header flex-none items-center gap-5 border-b border-app-border px-4"
    >
      <Logo variant="header" class="flex-none" />
      <MenuTop
        :menus="roots"
        :active-key="activeRootPath"
        class="flex-1"
        @select="handleTopSelect"
      />
      <HeaderActions class="flex-none" />
    </header>

    <a-layout class="flex min-h-0 min-w-0 flex-1 overflow-hidden bg-transparent">
      <!-- 左侧：当前一级菜单的子集 -->
      <a-layout-sider
        v-if="sideMenus.length"
        class="app-shell-sider z-10 flex h-full flex-col border-r border-app-border"
        :collapsed="appStore.sidebarCollapsed"
        :collapsed-width="SIDEBAR_COLLAPSED_WIDTH"
        collapsible
        :trigger="null"
        :theme="appStore.isDark ? 'dark' : 'light'"
        :width="SIDEBAR_WIDTH"
      >
        <!-- 子菜单 -->
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

      <!-- 右侧视图与 TabNav 页签 -->
      <a-layout
        class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-app-bg-page/35 dark:bg-transparent"
      >
        <Main />
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@antdv-next/icons';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderActions from '../components/header-actions.vue';
import Logo from '../components/logo.vue';
import Main from '../components/main.vue';
import Menu from '../components/menu.vue';
import MenuTop from '../components/menu-top.vue';
import { findActiveRoot, resolveFirstLeafPath } from '../components/menu-shared';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from '../constants';
import { useAccessStore } from '@/store/modules/access';
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'MixedLayout'
});

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const accessStore = useAccessStore();

const roots = computed(() => accessStore.accessMenus);
const activeRoot = computed(() => findActiveRoot(roots.value, route.path) ?? roots.value[0]);
const activeRootPath = computed(() => activeRoot.value?.path ?? '');
const sideMenus = computed(() => activeRoot.value?.children ?? []);

function handleTopSelect(key: string) {
  const root = roots.value.find((item) => item.path === key);

  if (root) {
    router.push(resolveFirstLeafPath(root));
  }
}
</script>

<style scoped lang="less">
.sider-footer {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.02);
}
</style>
