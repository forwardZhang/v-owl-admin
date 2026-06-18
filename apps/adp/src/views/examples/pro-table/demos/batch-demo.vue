<template>
  <div class="flex flex-col gap-4">
    <a-alert type="info" show-icon message="演示：多选、批量区插槽、批量操作" />

    <pro-table :table="tableApi" :columns="columns" :row-selection="{ type: 'checkbox' }">
      <template #action>
        <a-tag color="green">批量操作区</a-tag>
      </template>
      <template #batch="{ selectedRows, clearSelection }">
        <a-space>
          <a-tag color="blue">已选 {{ selectedRows.length }} 项</a-tag>
          <a-button danger @click="onBatchDelete(selectedRows, clearSelection)">批量删除</a-button>
          <a-button @click="clearSelection">清空选择</a-button>
        </a-space>
      </template>
      <template #extra>
        <a-button type="primary">新增</a-button>
      </template>
    </pro-table>
  </div>
</template>

<script setup lang="ts">
import { message } from 'antdv-next';
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
  { id: 3, name: 'Cindy', dept: '设计', status: '启用' },
  { id: 4, name: 'David', dept: '测试', status: '启用' }
];

const [, tableApi] = createProTable<UserRow>({
  rowKey: 'id',
  initialData: rows
});

function onBatchDelete(selectedRows: Array<{ name: string }>, clearSelection: () => void) {
  message.success(`准备删除 ${selectedRows.map((item) => item.name).join('、')}`);
  clearSelection();
}
</script>
