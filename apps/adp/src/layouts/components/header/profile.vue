<template>
  <a-dropdown
    :open="open"
    overlay-class-name="profile-dropdown"
    placement="bottomRight"
    :trigger="['click']"
    @open-change="handleOpenChange"
  >
    <button
      type="button"
      class="flex min-w-0 cursor-pointer items-center gap-3 rounded-ant-lg border-0 bg-white/85 p-1.5 shadow-[0_10px_26px_rgba(18,36,61,0.08)]"
    >
      <a-avatar class="bg-app-avatar-gradient text-sm font-bold" size="small">
        {{ initials }}
      </a-avatar>
      <div class="flex min-w-0 flex-col gap-0.5 text-left">
        <strong class="whitespace-nowrap text-[13px] text-app-text-primary">
          {{ userStore.profile?.nickname || '访客' }}
        </strong>
        <span class="whitespace-nowrap text-xs text-app-text-tertiary">
          {{ userStore.profile?.department || '未设置部门' }}
        </span>
      </div>
      <down-outlined class="text-xs text-app-text-quaternary" />
    </button>

    <template #popupRender>
      <div
        class="w-60 rounded-ant-lg border border-app-border bg-white/95 py-3.5 shadow-[0_18px_42px_rgba(18,36,61,0.14)]"
      >
        <div class="flex gap-3.5 px-3 pb-3">
          <div class="relative flex-none">
            <a-avatar class="bg-app-avatar-gradient text-sm font-bold" :size="38">
              {{ initials }}
            </a-avatar>
            <span
              class="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#52c41a]"
            ></span>
          </div>

          <div class="flex min-w-0 flex-1 flex-col justify-center gap-1">
            <div class="flex items-center gap-2.5">
              <strong class="text-sm text-app-text-primary">
                {{ userStore.profile?.nickname || '访客' }}
              </strong>
              <a-tag color="success">Pro</a-tag>
            </div>
            <em
              class="overflow-hidden text-ellipsis whitespace-nowrap text-[13px] not-italic text-app-text-secondary"
            >
              {{ userStore.profile?.position || '未设置岗位' }}
            </em>
          </div>
        </div>

        <div class="flex flex-col gap-0.5 px-2">
          <button
            v-for="item in primaryActions"
            :key="item.key"
            type="button"
            class="flex min-h-[30px] w-full cursor-pointer items-center gap-3.5 rounded-ant-lg border-0 bg-transparent px-3 py-2 text-[13px] text-app-text-primary transition duration-200 hover:bg-[rgba(var(--app-primary-rgb),0.08)]"
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
            class="flex min-h-[30px] w-full cursor-pointer items-center gap-3.5 rounded-ant-lg border-0 bg-transparent px-3 py-2 text-[13px] text-app-text-primary transition duration-200 hover:bg-[rgba(207,19,34,0.08)] hover:text-[#cf1322]"
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
import { usePermissionStore } from '@/store/modules/permission';
import { useUserStore } from '@/store/modules/user';

interface ActionItem {
  key: 'profile' | 'docs' | 'help';
  label: string;
  icon: Component;
}

const router = useRouter();
const userStore = useUserStore();
const permissionStore = usePermissionStore();
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
  () => userStore.profile?.avatar || userStore.profile?.nickname?.slice(0, 1) || 'VA'
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
  await userStore.logout();
  permissionStore.resetPermissions();
  message.success('已安全退出登录');
  router.replace(LOGIN_PATH);
}
</script>

<style scoped lang="less">
:deep(.profile-dropdown) {
  padding: 4px 0;
}
</style>
