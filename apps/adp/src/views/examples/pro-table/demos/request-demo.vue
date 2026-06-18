<template>
  <div class="flex flex-col gap-4">
    <a-alert type="info" show-icon message="演示：远程请求、分页、刷新（外部 controller）" />

    <pro-table :table="tableApi" :columns="columns" :hide-on-single-page="false">
      <template #action>
        <a-space>
          <a-button type="primary" :loading="tableApi.state.loading" @click="tableApi.reload()">
            刷新
          </a-button>
        </a-space>
      </template>
    </pro-table>
  </div>
</template>

<script setup lang="ts">
import { createProTable, ProTable } from '@owl/components';
import type { ProTableQueryState } from '@owl/components';
import { request } from '@/utils/request';

interface TableRow {
  id: number;
  name: string;
  role: string;
  status: string;
}

interface TableRequestResult {
  data: TableRow[];
  total: number;
}

const columns = [
  { title: '编号', dataIndex: 'id', width: 90 },
  { title: '名称', dataIndex: 'name' },
  { title: '角色', dataIndex: 'role' },
  { title: '状态', dataIndex: 'status' }
];

const requestTable = async ({ pagination }: ProTableQueryState) => {
  const res = await request.get<TableRequestResult>('/examples/pro-table/users', {
    params: {
      current: pagination.current,
      pageSize: pagination.pageSize
    }
  });
  return res;
};

const [, tableApi] = createProTable<TableRow>({
  rowKey: 'id',
  pageSize: 5,
  request: requestTable
});
</script>
