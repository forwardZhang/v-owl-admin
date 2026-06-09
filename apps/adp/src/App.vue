<template>
  <a-config-provider
    :theme="themeConfig"
    :get-popup-container="getPopupContainer"
    v-bind="sharedConfig"
  >
    <div class="min-h-screen bg-transparent">
      <RouterView />
      <Spinner class-name="fixed inset-0 z-[2000]" :spinning="appStore.booting" />
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { type ConfigProviderProps, theme } from 'antdv-next';
import Spinner from '@/components/spinner/index.vue';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

const themeConfig = computed(() => ({
  algorithm: appStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
  cssVar: { key: 'app' },
  token: {
    colorLink: appStore.primaryColor,
    colorPrimary: appStore.primaryColor,
    controlHeight: 28,
    fontSize: 13,
    fontFamily: "'SF Pro Display', 'PingFang SC', 'Segoe UI', sans-serif"
  },
  components: {
    Layout: {
      lightTriggerBg: 'transparent',
      triggerHeight: 42
    },
    Menu: {
      subMenuItemBg: 'transparent'
    },
    Button: {
      fontSize: 12
    }
  }
}));

const appNode = document.querySelector('#app');
function getPopupContainer() {
  if (appNode) {
    return appNode as HTMLElement;
  }
  return document.body;
}

const sharedConfig: ConfigProviderProps = {};
</script>
