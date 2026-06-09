<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue';
import type { Component } from 'vue';
import type { LayoutMode } from './types';
import MixedLayout from './modes/mixed-layout.vue';
import SidebarLayout from './modes/sidebar-layout.vue';
import TwoColumnLayout from './modes/two-column-layout.vue';
import { useAppStore } from '@/store/modules/app';

const appStore = useAppStore();

const layoutMap: Record<LayoutMode, Component> = {
  sidebar: markRaw(SidebarLayout),
  mixed: markRaw(MixedLayout),
  'two-column': markRaw(TwoColumnLayout)
};

const layoutComponent = computed(() => layoutMap[appStore.layoutMode] ?? layoutMap.sidebar);
</script>
