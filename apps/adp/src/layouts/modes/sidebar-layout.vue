<template>
  <a-layout class="flex h-screen w-full overflow-hidden bg-transparent">
    <!-- 侧边栏：隐藏默认触发器，在底部自定义实现 -->
    <a-layout-sider
      class="app-shell-sider sticky top-0 z-20 flex h-screen flex-col border-r border-app-border"
      :collapsed="appStore.sidebarCollapsed"
      :collapsed-width="SIDEBAR_COLLAPSED_WIDTH"
      collapsible
      :trigger="null"
      :theme="appStore.isDark ? 'dark' : 'light'"
      :width="SIDEBAR_WIDTH"
    >
      <!-- Logo 区域 -->
      <Logo :collapsed="appStore.sidebarCollapsed" />

      <!-- 菜单列表 -->
      <Menu
        :menus="accessStore.accessMenus"
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

    <!-- 右侧主体内容容器 -->
    <a-layout
      class="flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-app-bg-page/35 dark:bg-transparent"
    >
      <!-- 顶栏 -->
      <header
        class="app-shell-header flex min-h-app-header flex-none items-center justify-between gap-[18px] border-b border-app-border px-4"
      >
        <!-- 面包屑 -->
        <div class="flex items-center gap-6 min-w-0 flex-1">
          <Breadcrumb class="shrink-0" />
        </div>

        <!-- 头操作区 -->
        <HeaderActions />
      </header>

      <!-- 主视图 -->
      <Main />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@antdv-next/icons';
import Breadcrumb from '../components/breadcrumb.vue';
import HeaderActions from '../components/header-actions.vue';
import Logo from '../components/logo.vue';
import Main from '../components/main.vue';
import Menu from '../components/menu.vue';
import { SIDEBAR_COLLAPSED_WIDTH, SIDEBAR_WIDTH } from '../constants';
import { useAccessStore } from '@/store/modules/access';
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'SidebarLayout'
});

const appStore = useAppStore();
const accessStore = useAccessStore();
</script>

<style scoped lang="less">
.sider-footer {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.02);
}
</style>
