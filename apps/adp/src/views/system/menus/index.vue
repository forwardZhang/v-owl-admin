<template>
  <div class="view-page">
    <a-card class="view-page__hero" variant="borderless">
      <div>
        <span class="view-page__eyebrow">System / Menus</span>
        <h1>菜单管理</h1>
        <p>维护导航结构、组件映射与按钮权限，确保服务端菜单和前端路由保持一致。</p>
      </div>

      <a-space wrap>
        <a-button type="primary">新增菜单</a-button>
        <a-button ghost type="primary">同步路由结构</a-button>
      </a-space>
    </a-card>

    <a-card class="view-page__card" variant="borderless">
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

<style scoped lang="less">
.view-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.view-page__hero,
.view-page__card {
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.view-page__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background:
    radial-gradient(circle at top left, rgba(var(--app-primary-rgb), 0.14) 0%, transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(243, 248, 255, 0.94) 100%);
}

.view-page__eyebrow {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: var(--ant-border-radius-lg);
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(var(--app-primary-rgb), 0.1);
}

.view-page__hero h1 {
  margin: 14px 0 10px;
  color: var(--app-text-primary);
  font-size: 30px;
}

.view-page__hero p {
  max-width: 640px;
  margin: 0;
  color: var(--app-text-secondary);
  line-height: 1.8;
}
</style>
