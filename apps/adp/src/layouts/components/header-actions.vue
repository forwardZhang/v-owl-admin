<template>
  <a-space :size="12">
    <Settings />
    <Profile />
  </a-space>
</template>

<script setup lang="ts">
import Profile from './profile.vue';
import Settings from './settings.vue';
</script>
