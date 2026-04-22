<template>
  <a-layout-content class="main">
    <RouterView v-slot="{ Component, route }">
      <KeepAlive>
        <component :is="Component" v-if="route.meta.keepAlive" :key="route.fullPath" />
      </KeepAlive>
      <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
    </RouterView>
    <Spinner class-name="main__spinner" :spinning="spinning" />
  </a-layout-content>
</template>

<script setup lang="ts">
import Spinner from '@/components/spinner/index.vue';
import { useContentSpinner } from '@/composables/use-content-spinner';

defineOptions({
  name: 'LayoutMain'
});

const { spinning } = useContentSpinner();
</script>

<style scoped lang="less">
.main {
  position: relative;
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  padding: 16px;
  overflow: auto;
  overscroll-behavior: contain;
}

:deep(.main__spinner) {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
}
</style>
