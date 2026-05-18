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
          System / Users
        </span>
        <h1 class="mb-2.5 mt-3.5 text-3xl text-app-text-primary">用户管理</h1>
        <p class="max-w-[640px] leading-[1.8] text-app-text-secondary">
          统一管理后台账号、角色归属和登录状态，方便平台协作与权限治理。
        </p>
      </div>

      <a-space wrap>
        <a-button type="primary">新增用户</a-button>
        <a-button ghost type="primary">批量导出</a-button>
      </a-space>
    </a-card>

    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
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
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
