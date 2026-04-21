<template>
  <div class="view-page">
    <a-card class="view-page__hero" variant="borderless">
      <div>
        <span class="view-page__eyebrow">System / Roles</span>
        <h1>角色管理</h1>
        <p>按角色维度组织菜单与操作权限，方便不同岗位的人在边界内高效工作。</p>
      </div>

      <a-space wrap>
        <a-button type="primary">新增角色</a-button>
        <a-button ghost type="primary">导出权限矩阵</a-button>
      </a-space>
    </a-card>

    <a-row :gutter="[18, 18]">
      <a-col v-for="item in roles" :key="item.id" :xs="24" :lg="12">
        <a-card class="role-card" variant="borderless" :loading="loading">
          <div class="role-card__head">
            <div>
              <strong>{{ item.name }}</strong>
              <span>{{ item.code }}</span>
            </div>
            <a-tag :color="item.status === 'enabled' ? 'success' : 'default'">
              {{ item.status === 'enabled' ? '启用中' : '已停用' }}
            </a-tag>
          </div>

          <p class="role-card__desc">{{ item.description }}</p>

          <div class="role-card__meta">
            <div>
              <span>数据范围</span>
              <strong>{{ item.dataScope }}</strong>
            </div>
            <div>
              <span>成员数量</span>
              <strong>{{ item.userCount }} 人</strong>
            </div>
          </div>

          <a-divider />

          <div class="role-card__tags">
            <a-tag v-for="permission in item.permissionTags" :key="permission" color="processing">
              {{ permission }}
            </a-tag>
          </div>

          <a-space class="role-card__actions" :size="8">
            <a-button size="small" type="primary">编辑权限</a-button>
            <a-button size="small">查看成员</a-button>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchSystemRolesApi } from '@/api/system';
import type { SystemRoleRecord } from '@/types/system';

const loading = ref(false);
const roles = ref<SystemRoleRecord[]>([]);

onMounted(async () => {
  loading.value = true;

  try {
    roles.value = await fetchSystemRolesApi();
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
.role-card {
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

.role-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.role-card__head strong {
  display: block;
  color: var(--app-text-primary);
  font-size: 18px;
}

.role-card__head span {
  color: var(--app-text-tertiary);
  font-size: 12px;
}

.role-card__desc {
  margin: 18px 0 0;
  color: var(--app-text-secondary);
  line-height: 1.8;
}

.role-card__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 18px;
}

.role-card__meta span {
  display: block;
  color: var(--app-text-tertiary);
  font-size: 12px;
}

.role-card__meta strong {
  display: block;
  margin-top: 6px;
  color: var(--app-text-primary);
  font-size: 18px;
}

.role-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.role-card__actions {
  margin-top: 18px;
}

@media (max-width: 960px) {
  .view-page__hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .role-card__meta {
    grid-template-columns: 1fr;
  }
}
</style>
