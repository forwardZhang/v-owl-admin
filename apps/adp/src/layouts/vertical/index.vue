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
      @collapse="appStore.toggleSidebar()"
    >
      <AppLogo :collapsed="appStore.sidebarCollapsed" />
      <AppMenu :menus="permissionStore.visibleMenus" :collapsed="appStore.sidebarCollapsed" />
      <template #trigger>
        <menu-unfold-outlined v-if="appStore.sidebarCollapsed" />
        <menu-fold-outlined v-else />
      </template>
    </a-layout-sider>

    <button
      type="button"
      class="app-layout__backdrop"
      aria-label="关闭侧边栏"
      @click="appStore.setMobileMenuVisible(false)"
    />

    <a-layout class="app-layout__main">
      <AppHeader />
      <AppMain />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import AppHeader from '@/layouts/components/app-header.vue';
import AppLogo from '@/layouts/components/app-logo.vue';
import AppMain from '@/layouts/components/app-main.vue';
import AppMenu from '@/layouts/components/app-menu.vue';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@antdv-next/icons';
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';

const appStore = useAppStore();
const permissionStore = usePermissionStore();
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
    border-top: 1px solid rgba(18, 36, 61, 0.07);
  }
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

@media (max-width: 960px) {
  .app-layout {
    display: block;
    height: 100vh;
  }

  .app-layout__sidebar {
    position: fixed;
    left: 0;
    width: 280px;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .app-layout__backdrop {
    position: fixed;
    inset: 0;
    display: block;
    border: 0;
    opacity: 0;
    pointer-events: none;
    background: rgba(7, 14, 28, 0.42);
    transition: opacity 0.25s ease;
    z-index: 10;
  }

  .app-layout.is-mobile-open .app-layout__sidebar {
    transform: translateX(0);
  }

  .app-layout.is-mobile-open .app-layout__backdrop {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
