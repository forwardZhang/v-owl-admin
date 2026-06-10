<template>
  <a-dropdown
    :open="open"
    overlay-class-name="profile-dropdown"
    placement="bottomRight"
    :trigger="['click']"
    @open-change="handleOpenChange"
  >
    <button type="button" class="profile-trigger">
      <div class="user-avatar">
        {{ initials }}
      </div>
      <div class="flex min-w-0 flex-col gap-[2px] text-left">
        <strong class="whitespace-nowrap text-[13px] leading-tight text-app-text-primary">
          {{ userStore.userInfo?.nickname || '访客' }}
        </strong>
        <span class="whitespace-nowrap text-[11px] leading-tight text-app-text-tertiary">
          {{ userStore.userInfo?.department || '未设置部门' }}
        </span>
      </div>
    </button>

    <template #popupRender>
      <div class="profile-panel w-60 rounded-ant-lg border border-app-border py-3.5">
        <div class="flex gap-3.5 px-3 pb-3">
          <div class="relative flex-none">
            <a-avatar class="bg-app-avatar-gradient text-sm font-bold" :size="38">
              {{ initials }}
            </a-avatar>
            <span class="profile-status absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full" />
          </div>

          <div class="flex min-w-0 flex-1 flex-col justify-center gap-1">
            <div class="flex items-center gap-2.5">
              <strong class="text-sm text-app-text-primary">
                {{ userStore.userInfo?.nickname || '访客' }}
              </strong>
              <a-tag color="success">Pro</a-tag>
            </div>
            <em
              class="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] not-italic text-app-text-secondary"
            >
              {{ userStore.userInfo?.position || '未设置岗位' }}
            </em>
          </div>
        </div>

        <div class="flex flex-col gap-0.5 px-2">
          <button
            v-for="item in primaryActions"
            :key="item.key"
            type="button"
            class="profile-action flex min-h-[30px] w-full cursor-pointer items-center gap-3.5 rounded-ant-lg border-0 bg-transparent px-3 py-2 text-[13px] text-app-text-primary"
            @click="handleAction(item.key)"
          >
            <component :is="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </div>

        <a-divider size="small" />

        <div class="flex flex-col gap-0.5 px-2">
          <button
            type="button"
            class="profile-logout flex min-h-[30px] w-full cursor-pointer items-center gap-3.5 rounded-ant-lg border-0 bg-transparent px-3 py-2 text-[13px] text-app-text-primary"
            @click="handleAction('logout')"
          >
            <logout-outlined />
            <span>退出登录</span>
          </button>
        </div>
      </div>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import {
  BookOutlined,
  DownOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  UserOutlined
} from '@antdv-next/icons';
import type { Component } from 'vue';
import { computed, ref } from 'vue';
import { message } from 'antdv-next';
import { LOGIN_PATH } from '@/constants/app';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/modules/auth';
import { useUserStore } from '@/store/modules/user';

interface ActionItem {
  key: 'profile' | 'docs' | 'help';
  label: string;
  icon: Component;
}

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const open = ref(false);

const primaryActions: ActionItem[] = [
  {
    icon: UserOutlined,
    key: 'profile',
    label: '个人中心'
  },
  {
    icon: BookOutlined,
    key: 'docs',
    label: '文档'
  },
  {
    icon: QuestionCircleOutlined,
    key: 'help',
    label: '问题 & 帮助'
  }
];

const initials = computed(
  () => userStore.userInfo?.avatar || userStore.userInfo?.nickname?.slice(0, 1) || 'VA'
);

function handleOpenChange(value: boolean) {
  open.value = value;
}

async function handleAction(action: ActionItem['key'] | 'logout') {
  open.value = false;

  switch (action) {
    case 'profile':
      message.info('个人中心页已经给你留出入口，后面可以直接接真实资料页。');
      return;
    case 'docs':
      window.open('https://github.com/antdv-next/antdv-next', '_blank', 'noopener,noreferrer');
      return;
    case 'help':
      window.open(
        'https://github.com/antdv-next/antdv-next/issues',
        '_blank',
        'noopener,noreferrer'
      );
      return;
    case 'logout':
      await handleLogout();
      return;
  }
}

async function handleLogout() {
  await authStore.logout();
  message.success('已安全退出登录');
  router.replace(LOGIN_PATH);
}
</script>

<style scoped lang="less">
:deep(.profile-dropdown) {
  padding: 4px 0;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: none;
  background: transparent;
  padding: 0;
  border-radius: 8px;
}

.user-avatar {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-size: 13px;
  font-weight: 800;
  background: linear-gradient(135deg, #172033, #415371);
}

.profile-panel {
  background: var(--app-surface-strong);
  box-shadow: var(--app-shadow-medium);
}

.profile-status {
  border: 2px solid var(--app-surface-strong);
  background: #52c41a;
}

.profile-action {
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(var(--app-primary-rgb), 0.08);
  }
}

.profile-logout {
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    color: #cf1322;
    background: rgba(207, 19, 34, 0.08);
  }
}
</style>
