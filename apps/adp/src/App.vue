<template>
  <a-config-provider :theme="themeConfig">
    <a-layout>
      <RouterView />
      <Spinner class-name="app-boot-spinner" :spinning="appStore.booting"> </Spinner>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Spinner from '@/components/spinner/spinner.vue';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

const themeConfig = computed(() => ({
  token: {
    borderRadius: 16,
    colorInfo: appStore.primaryColor,
    colorLink: appStore.primaryColor,
    colorPrimary: appStore.primaryColor,
    controlHeight: 40,
    fontFamily: "'SF Pro Display', 'PingFang SC', 'Segoe UI', sans-serif"
  },
  components: {
    Layout: {
      lightTriggerBg: 'transparent',
      triggerHeight: 42
    },
    Menu: {
      subMenuItemBg: 'transparent'
    }
  }
}));
</script>

<style lang="less">
.app-shell {
  min-height: 100vh;
}

.app-boot-spinner {
  position: fixed;
  inset: 0;
  z-index: 2000;
}
</style>
