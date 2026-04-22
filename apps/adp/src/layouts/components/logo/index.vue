<template>
  <div class="logo" :class="{ 'is-collapsed': collapsed }">
    <a-avatar class="logo__mark" :size="40">VO</a-avatar>
    <div class="logo__meta-wrap">
      <div class="logo__meta">
        <strong>Owl Admin</strong>
        <span>Enterprise Center</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  collapsed: boolean;
}>();
</script>

<style scoped lang="less">
.logo {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: var(--app-header-height);
  padding: 0 20px;
  border-bottom: 1px solid var(--app-border);
  overflow: hidden;
}

.logo__mark {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, var(--app-primary) 0%, #43c4ff 100%);
  box-shadow: 0 18px 30px rgba(var(--app-primary-rgb), 0.22);
}

.logo__meta {
  display: flex;
  flex-direction: column;
  width: 132px;
  min-width: 0;
}

.logo__meta-wrap {
  width: 132px;
  overflow: hidden;
  opacity: 1;
  transition:
    width 0.24s ease,
    opacity 0.18s ease,
    transform 0.24s ease;
}

.logo__meta strong {
  color: var(--app-text-primary);
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
}

.logo__meta span {
  color: var(--app-text-tertiary);
  font-size: 12px;
  white-space: nowrap;
}

.logo.is-collapsed {
  justify-content: center;
  padding-inline: 0;
}

.logo.is-collapsed .logo__meta-wrap {
  width: 0;
  opacity: 0;
  transform: translateX(-10px);
}
</style>
