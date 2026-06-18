<template>
  <div class="flex flex-col gap-4">
    <a-alert type="info" show-icon message="演示：本地数据、原生属性透传、顶部 action 插槽" />

    <pro-table :table="tableApi" :columns="columns" :pagination="false" bordered size="middle">
      <template #action>
        <a-button type="primary">新增用户</a-button>
      </template>
      <template #extra> </template>
    </pro-table>
  </div>
</template>

<script setup lang="ts">
import { createProTable, ProTable } from '@owl/components';

interface UserRow {
  id: number;
  name: string;
  dept: string;
  status: string;
}

const columns = [
  { title: '姓名', dataIndex: 'name' },
  { title: '部门', dataIndex: 'dept' },
  { title: '状态', dataIndex: 'status' }
];

const rows: UserRow[] = [
  { id: 1, name: 'Alice', dept: '研发', status: '启用' },
  { id: 2, name: 'Bob', dept: '产品', status: '停用' },
  { id: 3, name: 'Cindy', dept: '设计', status: '启用' }
];

const [, tableApi] = createProTable<UserRow>({
  initialData: rows
});
</script>
