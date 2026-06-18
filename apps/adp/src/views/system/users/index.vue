<template>
  <AppProLayout title="用户管理">
    <ProPage :body-card="false">
      <template #search>
        <ProForm :form="searchApi" grid :cols="4" label-width="80" submit-text="查询">
          <ProInput path="keyword" label="关键词" placeholder="用户名 / 昵称 / 部门" allow-clear />
          <ProSelect
            path="status"
            label="状态"
            placeholder="全部"
            allow-clear
            :options="statusOptions"
          />
        </ProForm>
      </template>

      <template #main>
        <ProTable
          :table="tableApi"
          :columns="columns"
          :row-selection="{ type: 'checkbox' }"
          :hide-on-single-page="false"
        >
          <template #action>
            <a-space wrap>
              <a-button type="primary">新增用户</a-button>
              <a-button>导入用户</a-button>
            </a-space>
          </template>

          <template #extra>
            <a-tag color="processing">共 {{ filteredUsers.length }} 位成员</a-tag>
          </template>

          <template #batch="{ selectedRows, clearSelection }">
            <a-space wrap>
              <a-tag color="blue">已选 {{ selectedRows.length }} 位成员</a-tag>
              <a-button ghost type="primary" @click="onBatchExport(selectedRows, clearSelection)">
                批量导出
              </a-button>
              <a-button danger @click="onBatchDisable(selectedRows, clearSelection)">
                批量停用
              </a-button>
              <a-button @click="clearSelection">取消选择</a-button>
            </a-space>
          </template>

          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <a-tag :color="record.status === 'enabled' ? 'success' : 'default'">
                {{ record.status === 'enabled' ? '启用中' : '已停用' }}
              </a-tag>
            </template>

            <template v-else-if="column.key === 'action'">
              <a-space :size="8">
                <a-button size="small" type="link">编辑</a-button>
                <a-button size="small" type="link">重置密码</a-button>
              </a-space>
            </template>
          </template>
        </ProTable>
      </template>
    </ProPage>
  </AppProLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { message } from 'antdv-next';
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
import { fetchSystemUsersApi } from '@/api/system';
import type { SystemUserRecord } from '@/types/system';

interface UserSearchForm {
  keyword?: string;
  status?: SystemUserRecord['status'];
}

const users = ref<SystemUserRecord[]>([]);
const searchState = ref<UserSearchForm>({});

const statusOptions = [
  { label: '启用中', value: 'enabled' },
  { label: '已停用', value: 'disabled' }
];

const columns = [
  { dataIndex: 'username', key: 'username', title: '用户名' },
  { dataIndex: 'nickname', key: 'nickname', title: '昵称' },
  { dataIndex: 'department', key: 'department', title: '所属部门' },
  { dataIndex: 'roleName', key: 'roleName', title: '角色' },
  { dataIndex: 'phone', key: 'phone', title: '手机号' },
  { key: 'status', title: '状态' },
  { dataIndex: 'lastLoginAt', key: 'lastLoginAt', title: '最近登录' },
  { key: 'action', title: '操作', width: 150 }
];

const [, searchApi] = createProForm<UserSearchForm>({
  onSubmit: (formData) => {
    searchState.value = formData;
  },
  onReset: () => {
    searchState.value = {};
  }
});

const filteredUsers = computed(() => {
  const keyword = searchState.value.keyword?.trim().toLowerCase();
  const status = searchState.value.status;

  return users.value.filter((item) => {
    const keywordMatched =
      !keyword ||
      [item.department, item.nickname, item.username].some((field) =>
        field.toLowerCase().includes(keyword)
      );
    const statusMatched = !status || item.status === status;

    return keywordMatched && statusMatched;
  });
});

// 本地模式：controller 不发请求，数据由外部 watch 推入
const [, tableApi] = createProTable<SystemUserRecord>({
  rowKey: 'id',
  manual: true
});

watch(filteredUsers, (next) => tableApi.setData(next));

function onBatchExport(selectedRows: SystemUserRecord[], clearSelection: () => void) {
  message.success(`已导出 ${selectedRows.length} 位成员`);
  clearSelection();
}

function onBatchDisable(selectedRows: SystemUserRecord[], clearSelection: () => void) {
  message.warning(`已提交停用 ${selectedRows.length} 位成员的操作`);
  clearSelection();
}

onMounted(async () => {
  users.value = await fetchSystemUsersApi();
});
</script>
