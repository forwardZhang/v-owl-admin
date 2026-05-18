<template>
  <div class="relative flex">
    <a-button
      class="border-transparent bg-white/85 shadow-[0_10px_26px_rgba(18,36,61,0.08)]"
      shape="circle"
      @click="open = true"
    >
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
      <div class="flex flex-col gap-0.5">
        <div class="flex flex-col gap-3">
          <div class="flex gap-2.5">
            <bg-colors-outlined class="mt-0.5 text-base text-app-primary" />
            <div>
              <strong class="mb-1 block text-[15px] text-app-text-primary">品牌主题</strong>
              <span class="text-[13px] leading-normal text-app-text-secondary">
                调整主色，联动按钮、导航和关键操作反馈。
              </span>
            </div>
          </div>

          <div class="flex">
            <a-color-picker
              :value="appStore.primaryColor"
              format="hex"
              show-text
              size="small"
              @change="handleThemeColorChange"
            />
          </div>

          <div class="grid grid-cols-6 gap-2">
            <button
              v-for="color in THEME_COLOR_PRESETS"
              :key="color"
              type="button"
              class="aspect-[1/0.72] w-full cursor-pointer rounded-[10px] border-0"
              :class="{
                'shadow-[inset_0_0_0_2px_#fff,0_0_0_3px_rgba(var(--app-primary-rgb),0.24)]':
                  color === appStore.primaryColor
              }"
              :style="{ backgroundColor: color }"
              @click="applyThemeColor(color)"
            />
          </div>
        </div>

        <a-divider />

        <div class="flex flex-col gap-3">
          <div class="flex gap-2.5">
            <layout-outlined class="mt-0.5 text-base text-app-primary" />
            <div>
              <strong class="mb-1 block text-[15px] text-app-text-primary">布局偏好</strong>
              <span class="text-[13px] leading-normal text-app-text-secondary">
                选择当前工作台布局，并保留你的侧边导航习惯。
              </span>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <button
              type="button"
              class="flex w-full cursor-pointer items-center gap-3 rounded-[14px] border border-app-border bg-white p-2.5 transition duration-200 hover:-translate-y-px hover:border-[rgba(var(--app-primary-rgb),0.3)]"
              :class="{
                'border-[rgba(var(--app-primary-rgb),0.5)] shadow-[0_8px_20px_rgba(var(--app-primary-rgb),0.1)]':
                  appStore.layoutMode === 'vertical'
              }"
              @click="handleLayoutModeChange('vertical')"
            >
              <span
                class="flex h-[60px] w-[92px] min-w-[92px] gap-[5px] rounded-xl bg-[linear-gradient(180deg,rgba(244,247,252,0.96)_0%,rgba(236,241,249,0.96)_100%)] p-[7px]"
              >
                <span class="w-[18px] rounded-[7px] bg-[rgba(var(--app-primary-rgb),0.22)]"></span>
                <span class="flex flex-1 flex-col gap-[5px]">
                  <span class="h-2.5 rounded-full bg-[rgba(18,36,61,0.14)]"></span>
                  <span class="flex-1 rounded-lg bg-white/90"></span>
                </span>
              </span>
              <span class="flex flex-col gap-1 text-left">
                <strong class="block text-sm text-app-text-primary">侧边导航布局</strong>
                <span class="text-xs leading-normal text-app-text-secondary">
                  导航固定在左侧，适合后台管理的高频操作流。
                </span>
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
