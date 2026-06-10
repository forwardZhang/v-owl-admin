<template>
  <a-layout class="flex h-screen w-full overflow-hidden bg-transparent">
    <a-layout-sider
      class="app-shell-sider sticky top-0 z-20 flex h-screen flex-col border-r border-app-border"
      :collapsed="appStore.sidebarCollapsed"
      :collapsed-width="SIDEBAR_COLLAPSED_WIDTH"
      collapsible
      :theme="appStore.isDark ? 'dark' : 'light'"
      :width="SIDEBAR_WIDTH"
      @collapse="appStore.setSidebarCollapsed"
    >
      <Logo :collapsed="appStore.sidebarCollapsed" />
      <Menu
        :menus="accessStore.accessMenus"
        :collapsed="appStore.sidebarCollapsed"
        :theme="appStore.isDark ? 'dark' : 'light'"
      />
      <template #trigger>
        <span class="app-shell-trigger">
          <menu-unfold-outlined v-if="appStore.sidebarCollapsed" />
          <menu-fold-outlined v-else />
        </span>
      </template>
    </a-layout-sider>

    <a-layout class="flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
      <header
        class="app-shell-header flex min-h-app-header flex-none items-center justify-between gap-[18px] border-b border-app-border px-4"
      >
        <div class="min-w-0 flex-1">
          <Breadcrumb />
        </div>
        <HeaderActions />
      </header>
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

const appStore = useAppStore();
const accessStore = useAccessStore();
</script>
