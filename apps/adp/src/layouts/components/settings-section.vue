<template>
  <div class="mb-3 flex gap-2.5">
    <component :is="icon" class="mt-0.5 text-base text-app-primary" />
    <div>
      <strong class="mb-1 block text-[15px] text-app-text-primary">{{ title }}</strong>
      <span class="text-[13px] leading-normal text-app-text-secondary">{{ desc }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{
  icon: Component;
  title: string;
  desc: string;
}>();
</script>
