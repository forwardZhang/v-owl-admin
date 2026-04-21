<template>
  <a-layout-content class="app-layout__content">
    <RouterView v-slot="{ Component, route }">
      <KeepAlive>
        <component :is="Component" v-if="route.meta.keepAlive" :key="route.fullPath" />
      </KeepAlive>
      <component :is="Component" v-if="!route.meta.keepAlive" :key="route.fullPath" />
    </RouterView>
    <div v-show="spinning" class="spinner-wrap">
      <Spinner :spinning="spinning" />
    </div>
  </a-layout-content>
</template>

<script setup lang="ts">
import Spinner from '@/components/spinner/spinner.vue';
import { useContentSpinner } from '@/composables/use-content-spinner';

defineOptions({
  name: 'AppMain'
});

const { spinning } = useContentSpinner();
</script>

<style scoped lang="less">
.app-layout__content {
  position: relative;
  flex: 1;
  min-height: 0;
  min-width: 0;
  width: 100%;
  padding: 16px;
  overflow: auto;
  overscroll-behavior: contain;
}

.spinner-wrap {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
}
</style>
