<template>
  <a-config-provider :theme="themeConfig">
    <RouterView />
  </a-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
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
    }
  }
}));
</script>

<style scoped></style>
