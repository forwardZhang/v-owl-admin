<template>
  <div class="settings">
    <a-button class="settings__trigger" shape="circle" @click="open = true">
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
      <div class="panel">
        <div class="panel__block">
          <div class="panel__heading">
            <bg-colors-outlined />
            <div>
              <strong>品牌主题</strong>
              <span>调整主色，联动按钮、导航和关键操作反馈。</span>
            </div>
          </div>

          <div class="panel__theme-control">
            <a-color-picker
              :value="appStore.primaryColor"
              format="hex"
              show-text
              size="small"
              @change="handleThemeColorChange"
            />
          </div>

          <div class="panel__presets">
            <button
              v-for="color in THEME_COLOR_PRESETS"
              :key="color"
              type="button"
              class="panel__preset"
              :class="{ 'is-active': color === appStore.primaryColor }"
              :style="{ backgroundColor: color }"
              @click="applyThemeColor(color)"
            />
          </div>
        </div>

        <a-divider />

        <div class="panel__block">
          <div class="panel__heading">
            <layout-outlined />
            <div>
              <strong>布局偏好</strong>
              <span>选择当前工作台布局，并保留你的侧边导航习惯。</span>
            </div>
          </div>

          <div class="panel__layout-options">
            <button
              type="button"
              class="panel__layout-option"
              :class="{ 'is-active': appStore.layoutMode === 'vertical' }"
              @click="handleLayoutModeChange('vertical')"
            >
              <span class="panel__layout-preview">
                <span class="panel__layout-preview-sidebar"></span>
                <span class="panel__layout-preview-main">
                  <span class="panel__layout-preview-header"></span>
                  <span class="panel__layout-preview-content"></span>
                </span>
              </span>
              <span class="panel__layout-meta">
                <strong>侧边导航布局</strong>
                <span>导航固定在左侧，适合后台管理的高频操作流。</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { BgColorsOutlined, LayoutOutlined, SettingOutlined } from '@antdv-next/icons';
import { ref } from 'vue';
import { THEME_COLOR_PRESETS } from '@/constants/app';
import { type LayoutMode, useAppStore } from '@/store/modules/app';
import { deriveThemePalette } from '@/utils/theme';

const appStore = useAppStore();
const open = ref(false);

function applyThemeColor(color: string) {
  appStore.setPrimaryColor(deriveThemePalette(color));
}

function handleThemeColorChange(_: unknown, css: string) {
  applyThemeColor(css);
}

function handleLayoutModeChange(mode: LayoutMode) {
  appStore.setLayoutMode(mode);
}
</script>

<style scoped lang="less">
.settings {
  display: flex;
  position: relative;
}

.settings__trigger {
  border-color: transparent;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 10px 26px rgba(18, 36, 61, 0.08);
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.panel__block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel__heading {
  display: flex;
  gap: 10px;
}

.panel__heading > :first-child {
  margin-top: 2px;
  color: var(--app-primary);
  font-size: 16px;
}

.panel__heading strong {
  display: block;
  margin-bottom: 4px;
  color: var(--app-text-primary);
  font-size: 15px;
}

.panel__heading span {
  color: var(--app-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.panel__theme-control {
  display: flex;
}

.panel__presets {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
}

.panel__preset {
  width: 100%;
  aspect-ratio: 1 / 0.72;
  border: 0;
  border-radius: 10px;
  // box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.58);
  cursor: pointer;
}

.panel__preset.is-active {
  box-shadow:
    inset 0 0 0 2px #fff,
    0 0 0 3px rgba(var(--app-primary-rgb), 0.24);
}

.panel__layout-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.panel__layout-option {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(18, 36, 61, 0.08);
  border-radius: 14px;
  background: #fff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;
}

.panel__layout-option:hover {
  transform: translateY(-1px);
  border-color: rgba(var(--app-primary-rgb), 0.3);
}

.panel__layout-option.is-active {
  border-color: rgba(var(--app-primary-rgb), 0.5);
  box-shadow: 0 8px 20px rgba(var(--app-primary-rgb), 0.1);
}

.panel__layout-preview {
  display: flex;
  gap: 5px;
  width: 92px;
  min-width: 92px;
  height: 60px;
  padding: 7px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(244, 247, 252, 0.96) 0%, rgba(236, 241, 249, 0.96) 100%);
}

.panel__layout-preview-sidebar {
  width: 18px;
  border-radius: 7px;
  background: rgba(var(--app-primary-rgb), 0.22);
}

.panel__layout-preview-main {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
}

.panel__layout-preview-header {
  height: 10px;
  border-radius: 999px;
  background: rgba(18, 36, 61, 0.14);
}

.panel__layout-preview-content {
  flex: 1;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.92);
}

.panel__layout-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.panel__layout-meta strong {
  display: block;
  color: var(--app-text-primary);
  font-size: 14px;
}

.panel__layout-meta span {
  color: var(--app-text-secondary);
  font-size: 12px;
  line-height: 1.5;
}
</style>
