<template>
  <a-dropdown
    :open="open"
    overlay-class-name="profile-dropdown"
    placement="bottomRight"
    :trigger="['click']"
    @open-change="handleOpenChange"
  >
    <button type="button" class="profile__trigger">
      <a-avatar class="profile__avatar" :size="38">
        {{ initials }}
      </a-avatar>
      <div class="profile__meta">
        <strong>{{ userStore.profile?.nickname || '访客' }}</strong>
        <span>{{ userStore.profile?.department || '未设置部门' }}</span>
      </div>
      <down-outlined class="profile__arrow" />
    </button>

    <template #popupRender>
      <div class="panel">
        <div class="panel__summary">
          <div class="panel__avatar-wrap">
            <a-avatar class="panel__avatar" :size="48">
              {{ initials }}
            </a-avatar>
            <span class="panel__status"></span>
          </div>

          <div class="panel__identity">
            <div class="panel__headline">
              <strong>{{ userStore.profile?.nickname || '访客' }}</strong>
              <a-tag color="success">Pro</a-tag>
            </div>
            <em>{{ userStore.profile?.position || '未设置岗位' }}</em>
          </div>
        </div>

        <div class="panel__section">
          <button
            v-for="item in primaryActions"
            :key="item.key"
            type="button"
            class="panel__action"
            @click="handleAction(item.key)"
          >
            <component :is="item.icon" />
            <span>{{ item.label }}</span>
          </button>
        </div>

        <a-divider size="small" />

        <div class="panel__section">
          <button type="button" class="panel__action is-danger" @click="handleAction('logout')">
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
.profile__trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  padding: 8px 10px 8px 8px;
  border: 0;
  border-radius: var(--ant-border-radius-lg);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 10px 26px rgba(18, 36, 61, 0.08);
  cursor: pointer;
}

.profile__avatar,
.panel__avatar {
  font-size: 15px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--app-primary) 0%, #67d7ff 100%);
}

.profile__meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-align: left;
  gap: 2px;
}

.profile__meta strong,
.panel__identity strong {
  color: var(--app-text-primary);
}

.profile__meta strong {
  font-size: 14px;
  white-space: nowrap;
}

.profile__meta span {
  color: var(--app-text-tertiary);
  font-size: 12px;
  white-space: nowrap;
}

.profile__arrow {
  color: var(--app-text-quaternary);
  font-size: 12px;
}

.panel {
  width: 240px;
  padding: 14px 0;
  border: 1px solid rgba(18, 36, 61, 0.08);
  border-radius: var(--ant-border-radius-lg);
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 18px 42px rgba(18, 36, 61, 0.14);
}

.panel__summary {
  display: flex;
  gap: 14px;
  padding: 0 18px 16px;
}

.panel__avatar-wrap {
  position: relative;
  flex: none;
}

.panel__status {
  position: absolute;
  right: 2px;
  bottom: 2px;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-radius: 50%;
  background: #52c41a;
}

.panel__identity {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  gap: 4px;
}

.panel__headline {
  display: flex;
  align-items: center;
  gap: 10px;
}

.panel__headline strong {
  font-size: 18px;
}

.panel__identity span,
.panel__identity em {
  overflow: hidden;
  color: var(--app-text-secondary);
  font-size: 13px;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.panel__section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 8px;
}

.panel__divider {
  height: 1px;
  margin: 10px 0;
  background: rgba(18, 36, 61, 0.08);
}

.panel__action {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-height: 30px;
  padding: 8px 12px;
  border: 0;
  border-radius: var(--ant-border-radius-lg);
  color: var(--app-text-primary);
  font-size: 14px;
  background: transparent;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.panel__action:hover {
  background: rgba(var(--app-primary-rgb), 0.08);
}

.panel__action.is-danger:hover {
  color: #cf1322;
  background: rgba(207, 19, 34, 0.08);
}

:deep(.profile-dropdown) {
  padding: 4px 0;
}
</style>
