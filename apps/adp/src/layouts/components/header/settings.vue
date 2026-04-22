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
              <span>主色会联动按钮、导航高亮和全局品牌氛围。</span>
            </div>
          </div>

          <a-color-picker
            :value="appStore.primaryColor"
            format="hex"
            show-text
            @change="handleThemeColorChange"
          />

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
              <span>这些选项会持续扩展，不会只停留在主题色。</span>
            </div>
          </div>

          <div class="panel__setting">
            <div>
              <strong>默认折叠导航</strong>
              <span>适合更专注内容区的工作习惯。</span>
            </div>
            <a-switch :checked="appStore.sidebarCollapsed" @change="handleSidebarCollapsedChange" />
          </div>
        </div>

        <a-divider />

        <div class="panel__block">
          <div class="panel__heading">
            <bell-outlined />
            <div>
              <strong>后续功能位</strong>
              <span>设置入口后续还会承载更多工作台能力，不只是颜色开关。</span>
            </div>
          </div>

          <div class="panel__roadmap">
            <div class="panel__roadmap-item">
              <span>通知中心</span>
              <a-tag>即将接入</a-tag>
            </div>
            <div class="panel__roadmap-item">
              <span>界面密度</span>
              <a-tag>即将接入</a-tag>
            </div>
            <div class="panel__roadmap-item">
              <span>快捷键中心</span>
              <a-tag>即将接入</a-tag>
            </div>
          </div>
        </div>
      </div>
    </a-drawer>
  </div>
</template>

<script setup lang="ts">
import { BellOutlined, BgColorsOutlined, LayoutOutlined, SettingOutlined } from '@antdv-next/icons';
import { ref } from 'vue';
import { THEME_COLOR_PRESETS } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { deriveThemePalette } from '@/utils/theme';

const appStore = useAppStore();
const open = ref(false);

function applyThemeColor(color: string) {
  appStore.setPrimaryColor(deriveThemePalette(color));
}

function handleThemeColorChange(_: unknown, css: string) {
  applyThemeColor(css);
}

function handleSidebarCollapsedChange(checked: boolean) {
  appStore.setSidebarCollapsed(checked);
}
</script>

<style scoped lang="less">
.settings {
  display: flex;
}

.settings__trigger {
  border-color: transparent;
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 10px 26px rgba(18, 36, 61, 0.08);
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.panel__block {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel__heading {
  display: flex;
  gap: 12px;
}

.panel__heading > :first-child {
  margin-top: 3px;
  color: var(--app-primary);
  font-size: 18px;
}

.panel__heading strong {
  display: block;
  margin-bottom: 6px;
  color: var(--app-text-primary);
  font-size: 16px;
}

.panel__heading span,
.panel__setting span {
  color: var(--app-text-secondary);
  line-height: 1.7;
}

.panel__presets {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.panel__preset {
  width: 100%;
  aspect-ratio: 1;
  border: 0;
  border-radius: var(--ant-border-radius-lg);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.58);
  cursor: pointer;
}

.panel__preset.is-active {
  box-shadow:
    inset 0 0 0 2px #fff,
    0 0 0 3px rgba(var(--app-primary-rgb), 0.24);
}

.panel__setting,
.panel__roadmap-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-radius: var(--ant-border-radius-lg);
  background: var(--app-surface-subtle);
}

.panel__setting strong {
  display: block;
  margin-bottom: 6px;
  color: var(--app-text-primary);
}

.panel__roadmap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
