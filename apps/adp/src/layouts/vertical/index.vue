<template>
  <a-layout
    class="app-layout"
    :class="{
      'is-collapsed': appStore.sidebarCollapsed,
      'is-mobile-open': appStore.mobileMenuVisible
    }"
  >
    <a-layout-sider
      class="app-layout__sidebar"
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
        <span class="app-layout__trigger">
          <menu-unfold-outlined v-if="appStore.sidebarCollapsed" />
          <menu-fold-outlined v-else />
        </span>
      </template>
    </a-layout-sider>

    <button
      type="button"
      class="app-layout__backdrop"
      aria-label="关闭侧边栏"
      @click="appStore.setMobileMenuVisible(false)"
    />

    <a-layout class="app-layout__main">
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
.app-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.app-layout__sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  border-right: 1px solid var(--app-border);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(245, 248, 255, 0.96) 100%);
  backdrop-filter: blur(18px);
  z-index: 20;
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

.app-layout__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--ant-border-radius-lg);
  color: var(--app-primary);
  background: rgba(var(--app-primary-rgb), 0.1);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease;
}

.app-layout__trigger:hover {
  transform: translateY(-1px);
  background: rgba(var(--app-primary-rgb), 0.16);
}

.app-layout__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: 100vh;
  min-height: 0;
  min-width: 0;
  width: 0;
  overflow: hidden;
  background: transparent;
}

.app-layout__backdrop {
  display: none;
}

.app-global-spinner {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
}
</style>
