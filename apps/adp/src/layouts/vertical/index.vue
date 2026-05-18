<template>
  <a-layout
    class="flex h-screen w-full overflow-hidden"
    :class="{
      'is-collapsed': appStore.sidebarCollapsed,
      'is-mobile-open': appStore.mobileMenuVisible
    }"
  >
    <a-layout-sider
      class="app-layout__sidebar sticky top-0 z-20 flex h-screen flex-col border-r border-app-border bg-[linear-gradient(180deg,rgba(255,255,255,0.96)_0%,rgba(245,248,255,0.96)_100%)] backdrop-blur-[18px]"
      :collapsed="appStore.sidebarCollapsed"
      :collapsed-width="88"
      collapsible
      :theme="'light'"
      :width="220"
      @collapse="handleSidebarCollapse"
    >
      <Logo :collapsed="appStore.sidebarCollapsed" />
      <Menu :menus="permissionStore.visibleMenus" :collapsed="appStore.sidebarCollapsed" />
      <template #trigger>
        <span
          class="inline-flex h-9 w-9 items-center justify-center rounded-ant-lg bg-[rgba(var(--app-primary-rgb),0.1)] text-app-primary transition duration-200 hover:-translate-y-px hover:bg-[rgba(var(--app-primary-rgb),0.16)]"
        >
          <menu-unfold-outlined v-if="appStore.sidebarCollapsed" />
          <menu-fold-outlined v-else />
        </span>
      </template>
    </a-layout-sider>

    <button
      type="button"
      class="hidden"
      aria-label="关闭侧边栏"
      @click="appStore.setMobileMenuVisible(false)"
    />

    <a-layout class="flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
      <Header />
      <Main />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import Header from '@/layouts/components/header/index.vue';
import Logo from '@/layouts/components/logo/index.vue';
import Main from '@/layouts/components/main/index.vue';
import Menu from '@/layouts/components/menu/index.vue';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@antdv-next/icons';
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';

const appStore = useAppStore();
const permissionStore = usePermissionStore();

function handleSidebarCollapse(collapsed: boolean) {
  appStore.setSidebarCollapsed(collapsed);
}
</script>

<style scoped lang="less">
.app-layout__sidebar {
  :deep(.ant-layout-sider-children) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  :deep(.ant-layout-sider-trigger) {
    display: grid;
    place-items: center;
    height: 52px;
    border-top: 1px solid rgba(18, 36, 61, 0.07);
  }
}
</style>
