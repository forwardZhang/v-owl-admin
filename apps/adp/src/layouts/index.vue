<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import VerticalLayout from '@/layouts/vertical/index.vue';

const appStore = useAppStore();

const layoutComponentMap = {
  vertical: VerticalLayout
} as const;

const layoutComponent = computed(
  () => layoutComponentMap[appStore.layoutMode] || layoutComponentMap.vertical
);
</script>
