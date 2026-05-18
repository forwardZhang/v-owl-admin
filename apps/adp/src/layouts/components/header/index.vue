<template>
  <div
    class="flex min-h-[var(--app-header-height)] flex-none items-center justify-between gap-[18px] border-b border-app-border bg-white/80 px-4 backdrop-blur-[18px]"
  >
    <div class="min-w-0 flex-1">
      <Breadcrumb />
    </div>
    <div class="flex-none">
      <a-space :size="12">
        <Settings />
        <Profile />
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb.vue';
import Profile from './profile.vue';
import Settings from './settings.vue';
</script>
