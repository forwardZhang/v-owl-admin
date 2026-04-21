<template>
  <a-space class="app-logo" :class="{ 'is-collapsed': collapsed }" :size="14">
    <a-avatar class="app-logo__mark" :size="40">VO</a-avatar>
    <div v-if="!collapsed" class="app-logo__meta">
      <strong>Owl Admin</strong>
      <span>Enterprise Center</span>
    </div>
  </a-space>
</template>

<script setup lang="ts">
defineProps<{
  collapsed: boolean;
}>();
</script>

<style scoped lang="less">
.app-logo {
  display: flex;
  align-items: center;
  min-height: 55px;
  padding: 0 20px;
  border-bottom: 1px solid var(--app-border);
}

.app-logo__mark {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, var(--app-primary) 0%, #43c4ff 100%);
  box-shadow: 0 18px 30px rgba(var(--app-primary-rgb), 0.22);
}

.app-logo__meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-logo__meta strong {
  color: var(--app-text-primary);
  font-size: 16px;
  font-weight: 700;
}

.app-logo__meta span {
  color: var(--app-text-tertiary);
  font-size: 12px;
}

.app-logo.is-collapsed {
  justify-content: center;
  padding-inline: 0;
}
</style>
