<template>
  <div class="flex flex-col gap-5">
    <a-card
      class="flex items-center justify-between gap-6 rounded-ant-lg bg-[radial-gradient(circle_at_top_left,rgba(var(--app-primary-rgb),0.14)_0%,transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(243,248,255,0.94)_100%)] shadow-app-soft"
      variant="borderless"
    >
      <div>
        <span
          class="inline-flex h-7 items-center rounded-ant-lg bg-[rgba(var(--app-primary-rgb),0.1)] px-3 text-xs font-bold uppercase tracking-[0.08em] text-app-primary"
        >
          System / Menus
        </span>
        <h1 class="mb-2.5 mt-3.5 text-3xl text-app-text-primary">菜单管理</h1>
        <p class="max-w-[640px] leading-[1.8] text-app-text-secondary">
          维护导航结构、组件映射与按钮权限，确保服务端菜单和前端路由保持一致。
        </p>
      </div>

      <a-space wrap>
        <a-button type="primary">新增菜单</a-button>
        <a-button ghost type="primary">同步路由结构</a-button>
      </a-space>
    </a-card>

    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
      <a-table
        :columns="columns"
        :data-source="menus"
        :loading="loading"
        :pagination="false"
        row-key="id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag :color="getMenuTypeColor(record.type)">
              {{ getMenuTypeLabel(record.type) }}
            </a-tag>
          </template>

          <template v-else-if="column.key === 'status'">
            <a-switch :checked="record.status === 'enabled'" disabled />
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchSystemMenusApi } from '@/api/system';
import type { SystemMenuRecord } from '@/types/system';

const loading = ref(false);
const menus = ref<SystemMenuRecord[]>([]);

const columns = [
  {
    dataIndex: 'title',
    key: 'title',
    title: '名称'
  },
  {
    key: 'type',
    title: '类型'
  },
  {
    dataIndex: 'path',
    key: 'path',
    title: '路由路径'
  },
  {
    dataIndex: 'component',
    key: 'component',
    title: '组件映射'
  },
  {
    dataIndex: 'permission',
    key: 'permission',
    title: '权限标识'
  },
  {
    dataIndex: 'order',
    key: 'order',
    title: '排序'
  },
  {
    key: 'status',
    title: '启用'
  }
];

const menuTypeLabelMap = {
  button: '按钮',
  directory: '目录',
  menu: '菜单'
} as const;

const menuTypeColorMap = {
  button: 'default',
  directory: 'processing',
  menu: 'success'
} as const;

function getMenuTypeLabel(type: SystemMenuRecord['type']) {
  return menuTypeLabelMap[type];
}

function getMenuTypeColor(type: SystemMenuRecord['type']) {
  return menuTypeColorMap[type];
}

onMounted(async () => {
  loading.value = true;

  try {
    menus.value = await fetchSystemMenusApi();
  } finally {
    loading.value = false;
  }
});
</script>
