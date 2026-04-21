<template>
  <div class="app-header">
    <a-space class="app-header__left" :size="16">
      <a-breadcrumb :items="breadcrumbItems" />
    </a-space>

    <a-space class="app-header__right" :size="14">
      <a-button shape="circle" @click="themeDrawerOpen = true">
        <template #icon>
          <setting-outlined />
        </template>
      </a-button>

      <a-dropdown
        :menu="{ items: profileMenuItems }"
        placement="bottomRight"
        :trigger="['click']"
        @menu-click="handleProfileMenuClick"
      >
        <a-space class="app-header__profile" :size="12">
          <a-avatar class="app-header__avatar" :size="30">
            {{ userStore.profile?.avatar || 'VA' }}
          </a-avatar>
          <div class="app-header__meta">
            <strong>{{ userStore.profile?.nickname || '访客' }}</strong>
            <span>{{ userStore.profile?.department || '未设置部门' }}</span>
          </div>
          <down-outlined class="app-header__profile-arrow" />
        </a-space>
      </a-dropdown>
    </a-space>

    <a-drawer
      v-model:open="themeDrawerOpen"
      destroy-on-hidden
      placement="right"
      size="default"
      title="主题设置"
    >
      <div class="theme-panel">
        <div class="theme-panel__section">
          <strong>主色定制</strong>
          <span>修改后会同步影响导航高亮、按钮语义和全局品牌色。</span>
        </div>

        <a-color-picker
          :value="appStore.primaryColor"
          format="hex"
          show-text
          @change="handleThemeColorChange"
        />

        <a-divider />

        <div class="theme-panel__section">
          <strong>预设色板</strong>
          <span>选一个顺眼的，先让后台别那么“默认蓝”。</span>
        </div>

        <div class="theme-panel__presets">
          <button
            v-for="color in THEME_COLOR_PRESETS"
            :key="color"
            type="button"
            class="theme-panel__preset"
            :class="{ 'is-active': color === appStore.primaryColor }"
            :style="{ backgroundColor: color }"
            @click="applyThemeColor(color)"
          />
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { DownOutlined, SettingOutlined } from '@antdv-next/icons';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { message } from 'antdv-next';
import { LOGIN_PATH, THEME_COLOR_PRESETS } from '@/constants/app';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';
import { usePermissionStore } from '@/store/modules/permission';
import { useUserStore } from '@/store/modules/user';
import { deriveThemePalette } from '@/utils/theme';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const userStore = useUserStore();
const permissionStore = usePermissionStore();
const themeDrawerOpen = ref(false);
const isMobile = ref(false);

const breadcrumbItems = computed(() =>
  route.matched
    .filter((item) => item.meta?.title && item.path !== '/')
    .map((item) => ({
      key: item.path,
      title: item.meta.title as string
    }))
);

const profileMenuItems = computed(() => [
  {
    disabled: true,
    key: 'summary',
    label: `${userStore.profile?.nickname || '访客'} · ${userStore.profile?.position || '未设置岗位'}`
  },
  {
    key: 'logout',
    label: '退出登录'
  }
]);

function syncViewportState() {
  isMobile.value = window.innerWidth <= 960;
}

function applyThemeColor(color: string) {
  appStore.setPrimaryColor(deriveThemePalette(color));
}

function handleThemeColorChange(_: unknown, css: string) {
  applyThemeColor(css);
}

async function handleProfileMenuClick(info: { key: string }) {
  if (info.key !== 'logout') {
    return;
  }

  await handleLogout();
}

async function handleLogout() {
  await userStore.logout();
  permissionStore.resetPermissions();
  message.success('已安全退出登录');
  router.replace(LOGIN_PATH);
}

onMounted(() => {
  syncViewportState();
  window.addEventListener('resize', syncViewportState);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncViewportState);
});
</script>

<style scoped lang="less">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  min-height: 55px;
  padding: 0 24px;
  border-bottom: 1px solid var(--app-border);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(18px);
  flex: none;
}

.app-header__profile {
  display: flex;
  align-items: center;
  padding: 6px 10px 6px 6px;
  border-radius: 999px;
  background: var(--app-surface-subtle);
  cursor: pointer;
}

.app-header__profile-arrow {
  color: var(--app-text-quaternary);
  font-size: 12px;
}

.app-header__avatar {
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--app-primary) 0%, #67d7ff 100%);
}

.app-header__meta {
  display: flex;
  flex-direction: column;
  padding-right: 8px;
}

.app-header__meta strong {
  color: var(--app-text-primary);
  font-size: 14px;
}

.app-header__meta span {
  color: var(--app-text-tertiary);
  font-size: 12px;
}

.theme-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.theme-panel__section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.theme-panel__section strong {
  color: var(--app-text-primary);
  font-size: 16px;
}

.theme-panel__section span {
  color: var(--app-text-secondary);
  line-height: 1.7;
}

.theme-panel__presets {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.theme-panel__preset {
  width: 100%;
  aspect-ratio: 1;
  border: 0;
  border-radius: 18px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.58);
  cursor: pointer;
}

.theme-panel__preset.is-active {
  box-shadow:
    inset 0 0 0 2px #fff,
    0 0 0 3px rgba(var(--app-primary-rgb), 0.24);
}

@media (max-width: 960px) {
  .app-header {
    flex-wrap: wrap;
    min-height: auto;
    padding: 14px 18px;
  }

  .app-header__right {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
