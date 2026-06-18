<template>
  <AppProLayout title="菜单管理">
    <ProPage :body-card="false">
      <template #search>
        <ProForm :form="searchApi" grid :cols="4" label-width="80" submit-text="查询">
          <ProInput path="keyword" label="关键词" placeholder="名称 / 路径 / 权限" allow-clear />
          <ProSelect
            path="type"
            label="类型"
            placeholder="全部"
            allow-clear
            :options="typeOptions"
          />
        </ProForm>
      </template>

      <template #main>
        <ProTable :table="tableApi" :columns="columns" :pagination="false">
          <template #action>
            <a-space wrap>
              <a-button type="primary">新增菜单</a-button>
              <a-button ghost type="primary">同步路由结构</a-button>
            </a-space>
          </template>

          <template #extra>
            <a-tag color="processing">共 {{ filteredMenus.length }} 个节点</a-tag>
          </template>

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
        </ProTable>
      </template>
    </ProPage>
  </AppProLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  createProForm,
  createProTable,
  ProForm,
  ProInput,
  ProPage,
  ProSelect,
  ProTable
} from '@owl/components';
import AppProLayout from '@/components/app-pro-layout/index.vue';
import { fetchSystemMenusApi } from '@/api/system';
import type { SystemMenuRecord } from '@/types/system';

interface MenuSearchForm {
  keyword?: string;
  type?: SystemMenuRecord['type'];
}

const menus = ref<SystemMenuRecord[]>([]);
const searchState = ref<MenuSearchForm>({});

const columns = [
  { dataIndex: 'title', key: 'title', title: '名称' },
  { key: 'type', title: '类型' },
  { dataIndex: 'path', key: 'path', title: '路由路径' },
  { dataIndex: 'component', key: 'component', title: '组件映射' },
  { dataIndex: 'permission', key: 'permission', title: '权限标识' },
  { dataIndex: 'order', key: 'order', title: '排序' },
  { key: 'status', title: '启用' }
];

const typeOptions = [
  { label: '目录', value: 'directory' },
  { label: '菜单', value: 'menu' },
  { label: '按钮', value: 'button' }
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

const [, searchApi] = createProForm<MenuSearchForm>({
  onSubmit: (formData) => {
    searchState.value = formData;
  },
  onReset: () => {
    searchState.value = {};
  }
});

const filteredMenus = computed(() => {
  const keyword = searchState.value.keyword?.trim().toLowerCase();
  const type = searchState.value.type;

  return menus.value.filter((item) => {
    const keywordMatched =
      !keyword ||
      [item.component, item.path, item.permission, item.title].some((field) =>
        field.toLowerCase().includes(keyword)
      );
    const typeMatched = !type || item.type === type;

    return keywordMatched && typeMatched;
  });
});

const [, tableApi] = createProTable<SystemMenuRecord>({
  rowKey: 'id',
  manual: true
});

watch(filteredMenus, (next) => tableApi.setData(next));

function getMenuTypeLabel(type: SystemMenuRecord['type']) {
  return menuTypeLabelMap[type];
}

function getMenuTypeColor(type: SystemMenuRecord['type']) {
  return menuTypeColorMap[type];
}

onMounted(async () => {
  menus.value = await fetchSystemMenusApi();
});
</script>
