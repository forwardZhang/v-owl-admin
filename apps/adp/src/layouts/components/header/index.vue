<template>
  <div class="header">
    <div class="header__left">
      <Breadcrumb />
    </div>
    <div class="header__right">
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

<style scoped lang="less">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: var(--app-header-height);
  padding: 0 24px;
  border-bottom: 1px solid var(--app-border);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  flex: none;
}

.header__left {
  flex: 1;
  min-width: 0;
}

.header__right {
  flex: none;
}

@media (max-width: 960px) {
  .header {
    flex-wrap: wrap;
    min-height: auto;
    padding: 14px 18px;
  }

  .header__right {
    width: 100%;
  }
}
</style>
