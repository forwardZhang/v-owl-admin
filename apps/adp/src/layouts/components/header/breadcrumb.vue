<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="item in items" :key="item.key">
      <a-space :size="6">
        <component :is="item.icon" v-if="item.icon" class="breadcrumb__icon" />
        <span>{{ item.title }}</span>
      </a-space>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { resolveNavIcon } from '../shared/nav-icons';

interface BreadcrumbItem {
  key: string;
  title: string;
  icon: Component | null;
}

const route = useRoute();

const items = computed<BreadcrumbItem[]>(() =>
  route.matched
    .filter((item) => item.meta?.title && item.path !== '/')
    .map((item) => ({
      icon: resolveNavIcon(typeof item.meta.icon === 'string' ? item.meta.icon : ''),
      key: item.path,
      title: item.meta.title as string
    }))
);
</script>

<style scoped lang="less">
.breadcrumb {
  min-width: 0;
}

.breadcrumb__icon {
  font-size: 14px;
}
</style>
