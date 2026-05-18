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
          System / Roles
        </span>
        <h1 class="mb-2.5 mt-3.5 text-3xl text-app-text-primary">角色管理</h1>
        <p class="max-w-[640px] leading-[1.8] text-app-text-secondary">
          按角色维度组织菜单与操作权限，方便不同岗位的人在边界内高效工作。
        </p>
      </div>

      <a-space wrap>
        <a-button type="primary">新增角色</a-button>
        <a-button ghost type="primary">导出权限矩阵</a-button>
      </a-space>
    </a-card>

    <a-row :gutter="[18, 18]">
      <a-col v-for="item in roles" :key="item.id" :xs="24" :lg="12">
        <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless" :loading="loading">
          <div class="flex items-start justify-between gap-4">
            <div>
              <strong class="block text-lg text-app-text-primary">{{ item.name }}</strong>
              <span class="text-xs text-app-text-tertiary">{{ item.code }}</span>
            </div>
            <a-tag :color="item.status === 'enabled' ? 'success' : 'default'">
              {{ item.status === 'enabled' ? '启用中' : '已停用' }}
            </a-tag>
          </div>

          <p class="mt-[18px] leading-[1.8] text-app-text-secondary">{{ item.description }}</p>

          <div class="mt-[18px] grid grid-cols-2 gap-4">
            <div>
              <span class="block text-xs text-app-text-tertiary">数据范围</span>
              <strong class="mt-1.5 block text-lg text-app-text-primary">{{
                item.dataScope
              }}</strong>
            </div>
            <div>
              <span class="block text-xs text-app-text-tertiary">成员数量</span>
              <strong class="mt-1.5 block text-lg text-app-text-primary">
                {{ item.userCount }} 人
              </strong>
            </div>
          </div>

          <a-divider />

          <div class="flex flex-wrap gap-2">
            <a-tag v-for="permission in item.permissionTags" :key="permission" color="processing">
              {{ permission }}
            </a-tag>
          </div>

          <a-space class="mt-[18px]" :size="8">
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
