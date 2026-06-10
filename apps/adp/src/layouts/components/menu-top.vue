<template>
  <div class="menu-top min-w-0 flex-1">
    <a-menu mode="horizontal" :items="items" :selected-keys="selectedKeys" @click="handleClick" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MenuRecordRaw } from '@/types/menu';
import { transformMenusToFlatItems } from './menu-shared';

const props = defineProps<{
  menus: MenuRecordRaw[];
  activeKey: string;
}>();

const emit = defineEmits<{
  select: [key: string];
}>();

const items = computed(() => transformMenusToFlatItems(props.menus));
const selectedKeys = computed(() => [props.activeKey]);

function handleClick(info: { key: string }) {
  emit('select', String(info.key));
}
</script>

<style scoped lang="less">
.menu-top :deep(.ant-menu) {
  font-size: 13px;
  line-height: 40px;
  background: transparent;
  border-bottom: 0;
}

.menu-top :deep(.ant-menu-item) {
  border-radius: var(--ant-border-radius-lg, 8px);
}

.menu-top :deep(.ant-menu-item-selected) {
  background: var(--app-primary-soft);
  color: var(--app-primary);
  font-weight: 700;
}
</style>
