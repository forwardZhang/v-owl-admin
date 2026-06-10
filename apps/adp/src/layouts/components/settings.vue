<template>
  <div class="relative flex">
    <button class="settings-trigger" type="button" @click="open = true">
      <setting-outlined />
    </button>

    <a-drawer
      v-model:open="open"
      destroy-on-hidden
      placement="right"
      size="default"
      title="偏好设置"
    >
      <a-flex vertical :gap="28">
        <!-- 主题 -->
        <section>
          <SectionTitle
            :icon="BulbOutlined"
            title="主题与外观"
            desc="自定义系统主题颜色及深浅模式。"
          />

          <a-flex vertical :gap="20">
            <!-- 外观模式 -->
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="item in colorSchemeOptions"
                :key="item.value"
                class="flex flex-col items-center gap-1.5 cursor-pointer"
                @click="handleColorSchemeChange(item.value)"
              >
                <div
                  class="theme-swatch-box flex h-12 w-full items-center justify-center rounded-lg border transition-all"
                  :class="
                    item.value === appStore.colorScheme
                      ? 'is-active'
                      : 'border-app-border hover:border-app-primary'
                  "
                >
                  <component
                    :is="item.icon"
                    class="text-xl"
                    :class="
                      item.value === appStore.colorScheme
                        ? 'text-app-primary'
                        : 'text-app-text-secondary'
                    "
                  />
                </div>
                <span class="text-xs text-app-text-secondary">{{ item.label }}</span>
              </div>
            </div>

            <!-- 主题色 -->
            <div>
              <div class="mb-3 text-xs text-app-text-tertiary">品牌主色</div>
              <div class="flex flex-wrap items-center gap-3">
                <!-- 自定义颜色选择器 -->
                <a-color-picker
                  :value="appStore.primaryColor"
                  format="hex"
                  size="small"
                  @change="handleColorChange"
                />

                <!-- 预设颜色 -->
                <a-tooltip
                  v-for="preset in THEME_COLOR_PRESETS"
                  :key="preset.color"
                  :title="preset.label"
                >
                  <div
                    class="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded transition-transform hover:scale-110"
                    :style="{ backgroundColor: preset.color }"
                    @click="appStore.setPrimaryColor(preset.color)"
                  >
                    <check-outlined
                      v-if="preset.color === appStore.primaryColor"
                      class="text-white text-[10px]"
                    />
                  </div>
                </a-tooltip>
              </div>
            </div>
          </a-flex>
        </section>

        <!-- 布局 -->
        <section>
          <SectionTitle
            :icon="LayoutOutlined"
            title="布局模式"
            desc="选择导航排布方式，偏好会被记住。"
          />
          <a-flex vertical :gap="10">
            <button
              v-for="item in layoutOptions"
              :key="item.value"
              type="button"
              class="layout-option"
              :class="{ 'is-active': appStore.layoutMode === item.value }"
              @click="appStore.setLayoutMode(item.value)"
            >
              <span class="layout-preview" :class="`layout-preview--${item.value}`">
                <span class="layout-preview__bar" />
                <span class="layout-preview__bar2" />
                <span class="layout-preview__body" />
              </span>
              <span class="flex flex-col gap-1 text-left">
                <strong class="text-sm text-app-text-primary">{{ item.label }}</strong>
                <span class="text-xs leading-normal text-app-text-secondary">{{ item.desc }}</span>
              </span>
              <check-circle-filled v-if="appStore.layoutMode === item.value" class="layout-check" />
            </button>
          </a-flex>
        </section>
      </a-flex>

      <template #footer>
        <a-button block @click="handleReset">
          <template #icon>
            <reload-outlined />
          </template>
          重置
        </a-button>
      </template>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import {
  BulbOutlined,
  CheckCircleFilled,
  CheckOutlined,
  DesktopOutlined,
  LayoutOutlined,
  MoonOutlined,
  ReloadOutlined,
  SettingOutlined,
  SunOutlined
} from '@antdv-next/icons';
import { message } from 'antdv-next';
import { ref } from 'vue';
import { THEME_COLOR_PRESETS } from '@/constants/app';
import type { ColorScheme, LayoutMode } from '@/layouts/types';
import { useAppStore } from '@/store/modules/app';
import SectionTitle from './settings-section.vue';

const appStore = useAppStore();
const open = ref(false);

const colorSchemeOptions = [
  { label: '浅色', value: 'light', icon: SunOutlined },
  { label: '深色', value: 'dark', icon: MoonOutlined },
  { label: '跟随系统', value: 'auto', icon: DesktopOutlined }
];

const layoutOptions: { value: LayoutMode; label: string; desc: string }[] = [
  { value: 'sidebar', label: '侧边导航', desc: '导航固定左侧，适合高频后台操作。' },
  { value: 'mixed', label: '顶部 + 侧边', desc: '顶部通栏放品牌与操作，左侧聚焦菜单。' },
  { value: 'two-column', label: '双列导航', desc: '左侧图标轨道切换分组，第二列展开子菜单。' }
];

function handleColorSchemeChange(value: string | number) {
  appStore.setColorScheme(value as ColorScheme);
}

function handleColorChange(_: unknown, css: string) {
  appStore.setPrimaryColor(css);
}

function handleReset() {
  appStore.resetSettings();
  message.success('已恢复默认设置');
}
</script>

<style scoped lang="less">
.settings-trigger {
  display: grid;
  width: 36px;
  height: 36px;
  cursor: pointer;
  place-items: center;
  border: 1px solid var(--app-border);
  border-radius: 8px;
  color: var(--app-text-secondary);
  background: var(--app-surface);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;

  &:hover {
    color: var(--app-primary);
    background: var(--app-surface-soft);
  }
}

.theme-swatch-box {
  background: var(--app-surface-subtle);

  &.is-active {
    border-color: var(--app-primary);
    box-shadow: 0 0 0 1px var(--app-primary);
  }
}

.layout-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px;
  cursor: pointer;
  background: var(--app-surface-strong);
  border: 1px solid var(--app-border);
  border-radius: 14px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(var(--app-primary-rgb), 0.3);
  }

  &.is-active {
    border-color: rgba(var(--app-primary-rgb), 0.5);
    box-shadow: 0 8px 20px rgba(var(--app-primary-rgb), 0.12);
  }
}

.layout-check {
  position: absolute;
  top: 10px;
  right: 10px;
  color: var(--app-primary);
}

.layout-preview {
  display: flex;
  width: 92px;
  min-width: 92px;
  height: 60px;
  gap: 5px;
  padding: 7px;
  border-radius: 12px;
  background: var(--app-surface-subtle);
}

.layout-preview__bar {
  border-radius: 7px;
  background: rgba(var(--app-primary-rgb), 0.3);
}

.layout-preview__bar2 {
  display: none;
  border-radius: 7px;
  background: rgba(var(--app-primary-rgb), 0.16);
}

.layout-preview__body {
  flex: 1;
  border-radius: 8px;
  background: var(--app-surface-strong);
}

.layout-preview--sidebar {
  flex-direction: row;

  .layout-preview__bar {
    width: 18px;
  }
}

.layout-preview--mixed {
  flex-direction: column;

  .layout-preview__bar {
    height: 12px;
  }
}

.layout-preview--two-column {
  flex-direction: row;

  .layout-preview__bar {
    width: 10px;
  }

  .layout-preview__bar2 {
    display: block;
    width: 16px;
  }
}
</style>
