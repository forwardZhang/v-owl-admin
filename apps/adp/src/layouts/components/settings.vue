<template>
  <div class="relative flex">
    <a-button class="settings-trigger border-transparent" shape="circle" @click="open = true">
      <template #icon>
        <setting-outlined />
      </template>
    </a-button>

    <a-drawer
      v-model:open="open"
      destroy-on-hidden
      placement="right"
      size="default"
      title="偏好设置"
    >
      <a-flex vertical :gap="28">
        <!-- 外观 -->
        <section>
          <SectionTitle :icon="BulbOutlined" title="外观模式" desc="在浅色与深色主题之间切换。" />
          <a-segmented
            block
            :value="appStore.colorScheme"
            :options="colorSchemeOptions"
            @change="handleColorSchemeChange"
          />
        </section>

        <!-- 主题色 -->
        <section>
          <SectionTitle
            :icon="BgColorsOutlined"
            title="品牌主题"
            desc="调整主色，联动按钮、导航和关键操作反馈。"
          />
          <a-flex vertical :gap="12">
            <a-color-picker
              :value="appStore.primaryColor"
              format="hex"
              show-text
              size="small"
              @change="handleColorChange"
            />
            <div class="grid grid-cols-8 gap-2">
              <button
                v-for="color in THEME_COLOR_PRESETS"
                :key="color"
                type="button"
                class="theme-swatch aspect-square w-full cursor-pointer rounded-lg border-0"
                :class="{ 'is-active': color === appStore.primaryColor }"
                :style="{ backgroundColor: color }"
                @click="appStore.setPrimaryColor(color)"
              />
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
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import {
  BgColorsOutlined,
  BulbOutlined,
  CheckCircleFilled,
  LayoutOutlined,
  SettingOutlined
} from '@antdv-next/icons';
import { ref } from 'vue';
import { THEME_COLOR_PRESETS } from '@/constants/app';
import type { ColorScheme, LayoutMode } from '@/layouts/types';
import { useAppStore } from '@/store/modules/app';
import SectionTitle from './settings-section.vue';

const appStore = useAppStore();
const open = ref(false);

const colorSchemeOptions = [
  { label: '浅色', value: 'light' },
  { label: '深色', value: 'dark' }
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
</script>

<style scoped lang="less">
.settings-trigger {
  background: var(--app-surface);
  box-shadow: var(--app-shadow-soft);
}

.theme-swatch {
  transition: box-shadow 0.2s ease;

  &.is-active {
    box-shadow:
      inset 0 0 0 2px var(--app-surface-strong),
      0 0 0 3px rgba(var(--app-primary-rgb), 0.4);
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
