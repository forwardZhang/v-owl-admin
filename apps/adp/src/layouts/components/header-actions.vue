<template>
  <a-space :size="16" class="flex items-center">
    <!-- 租户切换 -->
    <a-dropdown :trigger="['click']" placement="bottom">
      <button
        type="button"
        class="tenant-btn flex items-center gap-1.5 px-2.5 py-1.5 border border-app-border rounded-lg text-app-text-secondary hover:text-app-primary transition-all text-xs bg-app-surface cursor-pointer select-none"
      >
        <apartment-outlined class="text-[13px]" />
        <span class="font-medium">{{ currentTenant }}</span>
        <down-outlined class="text-[8px] text-app-text-tertiary" />
      </button>
      <template #popupRender>
        <a-menu @click="handleTenantChange">
          <a-menu-item key="默认租户">
            <apartment-outlined class="mr-2 text-xs" />默认租户
          </a-menu-item>
          <a-menu-item key="上海分公司">
            <apartment-outlined class="mr-2 text-xs" />上海分公司
          </a-menu-item>
          <a-menu-item key="北京总部">
            <apartment-outlined class="mr-2 text-xs" />北京总部
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <!-- 主题一键切换 -->
    <a-tooltip title="切换主题">
      <button
        type="button"
        class="icon-btn flex items-center justify-center rounded-lg text-app-text-secondary hover:text-app-primary hover:bg-app-surface-soft transition-all p-1.5 cursor-pointer border-0 bg-transparent"
        @click="appStore.toggleColorScheme()"
      >
        <sun-outlined v-if="appStore.colorScheme === 'dark'" class="text-[15px]" />
        <moon-outlined v-else class="text-[15px]" />
      </button>
    </a-tooltip>

    <!-- 网页全屏 -->
    <a-tooltip title="全屏切换">
      <button
        type="button"
        class="icon-btn flex items-center justify-center rounded-lg text-app-text-secondary hover:text-app-primary hover:bg-app-surface-soft transition-all p-1.5 cursor-pointer border-0 bg-transparent"
        @click="toggleFullscreen"
      >
        <fullscreen-exit-outlined v-if="isFullscreen" class="text-[15px]" />
        <fullscreen-outlined v-else class="text-[15px]" />
      </button>
    </a-tooltip>

    <!-- 偏好设置 -->
    <Settings />

    <!-- 个人下拉 -->
    <Profile />
  </a-space>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  ApartmentOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SunOutlined,
  MoonOutlined,
  DownOutlined
} from '@antdv-next/icons';
import { useAppStore } from '@/store/modules/app';
import Profile from './profile.vue';
import Settings from './settings.vue';

defineOptions({
  name: 'HeaderActions'
});

const appStore = useAppStore();

// 租户状态
const currentTenant = ref('默认租户');

/**
 * 切换租户
 *
 * @param {object} info 下拉菜单选择信息
 * @param {string} info.key 选中的租户名键
 */
function handleTenantChange(info: { key: string }) {
  currentTenant.value = info.key;
}

// 全屏状态
const isFullscreen = ref(false);

/**
 * 切换全屏状态
 */
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement
      .requestFullscreen()
      .then(() => {
        isFullscreen.value = true;
      })
      .catch((err) => {
        console.error(`全屏切换失败: ${err.message}`);
      });
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
}

/**
 * 监听浏览器全屏事件，同步状态
 */
function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<style scoped lang="less">
.icon-btn {
  width: 32px;
  height: 32px;
}
.tenant-btn {
  height: 32px;
}
</style>
