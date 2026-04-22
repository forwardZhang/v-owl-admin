<template>
  <div class="view-page">
    <a-card class="view-page__hero" variant="borderless">
      <div>
        <span class="view-page__eyebrow">System / Users</span>
        <h1>用户管理</h1>
        <p>统一管理后台账号、角色归属和登录状态，方便平台协作与权限治理。</p>
      </div>

      <a-space wrap>
        <a-button type="primary">新增用户</a-button>
        <a-button ghost type="primary">批量导出</a-button>
      </a-space>
    </a-card>

    <a-card class="view-page__card" variant="borderless">
      <div class="view-page__toolbar">
        <a-input
          v-model:value="keyword"
          allow-clear
          class="view-page__search"
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

.view-page__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.view-page__search {
  max-width: 320px;
}
</style>
