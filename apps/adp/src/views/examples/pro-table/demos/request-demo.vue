<template>
  <div class="flex flex-col gap-4">
    <a-alert type="info" show-icon message="演示：远程请求、分页、刷新，分页条固定可见" />

    <pro-table
      :columns="columns"
      :request="requestTable"
      :default-page-size="5"
      :hide-on-single-page="false"
      row-key="id"
    />
  </div>
</template>

<script setup lang="ts">
import { ProTable } from '@owl/components';
import { request } from '@/utils/request';

interface TableRow {
  id: number;
  name: string;
  role: string;
  status: string;
}

interface TableRequestQuery {
  pagination: {
    current: number;
    pageSize: number;
  };
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

const requestTable = async ({ pagination }: TableRequestQuery) => {
  const res = await request.get<TableRequestResult>('/examples/pro-table/users', {
    params: {
      current: pagination.current,
      pageSize: pagination.pageSize
    }
  });

  return res;
};
</script>
