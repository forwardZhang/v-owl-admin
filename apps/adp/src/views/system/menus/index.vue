<template>
  <AppProLayout title="菜单管理">
    <ProPage>
      <template #toolbar>
        <a-space wrap>
          <a-button type="primary">新增菜单</a-button>
          <a-button ghost type="primary">同步路由结构</a-button>
        </a-space>
      </template>

      <template #main>
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
      </template>
    </ProPage>
  </AppProLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ProPage } from '@owl/components';
import AppProLayout from '@/components/app-pro-layout/index.vue';
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
