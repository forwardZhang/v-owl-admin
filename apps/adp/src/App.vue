<template>
  <a-config-provider
    :theme="themeConfig"
    :get-popup-container="getPopupContainer"
    v-bind="sharedConfig"
  >
    <a-layout>
      <RouterView />
      <Spinner class-name="app-boot-spinner" :spinning="appStore.booting"> </Spinner>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Spinner from '@/components/spinner/index.vue';
import { useAppStore } from '@/store/modules/app';
import type { ConfigProviderProps } from 'antdv-next';
const appStore = useAppStore();

const themeConfig = computed(() => ({
  token: {
    borderRadius: 16,
    colorInfo: appStore.primaryColor,
    colorLink: appStore.primaryColor,
    colorPrimary: appStore.primaryColor,
    controlHeight: 28,
    fontSize: 12,
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

<style scoped lang="less">
.app-shell {
  min-height: 100vh;
}

.app-boot-spinner {
  position: fixed;
  inset: 0;
  z-index: 2000;
}
</style>
