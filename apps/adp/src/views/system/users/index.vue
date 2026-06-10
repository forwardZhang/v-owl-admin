<template>
  <AppProPage title="用户管理">
    <template #extra>
      <a-space wrap>
        <a-button type="primary">新增用户</a-button>
        <a-button ghost type="primary">批量导出</a-button>
      </a-space>
    </template>

    <div class="mb-[18px] flex items-center justify-between gap-4">
      <a-input
        v-model:value="keyword"
        allow-clear
        class="max-w-xs"
        placeholder="搜索用户名 / 昵称 / 部门"
      />
      <a-tag color="processing">共 {{ filteredUsers.length }} 位成员</a-tag>
    </div>

    <a-table
      :columns="columns"
      :data-source="filteredUsers"
      :loading="loading"
      :pagination="{ pageSize: 5, showSizeChanger: false }"
      row-key="id"
    >
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
    </a-table>
  </AppProPage>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import AppProPage from '@/components/app-pro-page/index.vue';
import { fetchSystemUsersApi } from '@/api/system';
import type { SystemUserRecord } from '@/types/system';

const loading = ref(false);
const keyword = ref('');
const users = ref<SystemUserRecord[]>([]);

const columns = [
  {
    dataIndex: 'username',
    key: 'username',
    title: '用户名'
  },
  {
    dataIndex: 'nickname',
    key: 'nickname',
    title: '昵称'
  },
  {
    dataIndex: 'department',
    key: 'department',
    title: '所属部门'
  },
  {
    dataIndex: 'roleName',
    key: 'roleName',
    title: '角色'
  },
  {
    dataIndex: 'phone',
    key: 'phone',
    title: '手机号'
  },
  {
    key: 'status',
    title: '状态'
  },
  {
    dataIndex: 'lastLoginAt',
    key: 'lastLoginAt',
    title: '最近登录'
  },
  {
    key: 'action',
    title: '操作'
  }
];

const filteredUsers = computed(() => {
  if (!keyword.value) {
    return users.value;
  }

  const normalizedKeyword = keyword.value.toLowerCase();

  return users.value.filter((item) =>
    [item.department, item.nickname, item.username].some((field) =>
      field.toLowerCase().includes(normalizedKeyword)
    )
  );
});

onMounted(async () => {
  loading.value = true;

  try {
    users.value = await fetchSystemUsersApi();
  } finally {
    loading.value = false;
  }
});
</script>
