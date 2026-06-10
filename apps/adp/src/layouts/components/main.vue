<template>
  <a-layout-content class="relative min-h-0 min-w-0 flex-1 overflow-hidden overscroll-contain">
    <RouterView v-slot="{ Component, route }">
      <transition name="fade-slide" mode="out-in" appear>
        <KeepAlive v-if="route.meta.keepAlive">
          <component :is="Component" :key="route.path" />
        </KeepAlive>
        <component :is="Component" v-else :key="route.path" />
      </transition>
    </RouterView>
    <Spinner class-name="absolute inset-0 z-[9999]" :spinning="spinning" />
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
