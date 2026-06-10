import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { usePreferredDark } from '@vueuse/core';
import { DEFAULT_PRIMARY_COLOR } from '@/constants/app';
import { APP_STORAGE_KEY } from '@/constants/storage';
import type { ColorScheme, LayoutMode } from '@/layouts/types';
import { getStorage, setStorage } from '@/utils/storage';
import { toRgbTriple } from '@/utils/theme';

interface AppSettings {
  layoutMode: LayoutMode;
  colorScheme: ColorScheme;
  sidebarCollapsed: boolean;
  primaryColor: string;
}

const defaultSettings: AppSettings = {
  layoutMode: 'sidebar',
  colorScheme: 'light',
  sidebarCollapsed: false,
  primaryColor: DEFAULT_PRIMARY_COLOR
};

function applyTheme(settings: AppSettings, isDarkTheme: boolean) {
  const root = document.documentElement;

  root.style.setProperty('--app-primary', settings.primaryColor);
  root.style.setProperty('--app-primary-rgb', toRgbTriple(settings.primaryColor));

  root.classList.toggle('dark', isDarkTheme);
  root.style.colorScheme = isDarkTheme ? 'dark' : 'light';
}

export const useAppStore = defineStore('app', () => {
  const settings = ref<AppSettings>({
    ...defaultSettings,
    ...getStorage<Partial<AppSettings>>(APP_STORAGE_KEY, {})
  });
  const booting = ref(true);
  const preferredDark = usePreferredDark();

  const isBooting = computed(() => booting.value);
  const layoutMode = computed(() => settings.value.layoutMode);
  const colorScheme = computed(() => settings.value.colorScheme);
  const isDark = computed(() => {
    if (settings.value.colorScheme === 'auto') return preferredDark.value;
    return settings.value.colorScheme === 'dark';
  });
  const sidebarCollapsed = computed(() => settings.value.sidebarCollapsed);
  const primaryColor = computed(() => settings.value.primaryColor);

  function persistSettings() {
    setStorage(APP_STORAGE_KEY, settings.value);
  }

  // 监听主题变化，自动应用到 DOM
  watch(
    [settings, isDark],
    () => {
      applyTheme(settings.value, isDark.value);
    },
    { deep: true }
  );

  function bootstrap() {
    applyTheme(settings.value, isDark.value);
  }

  function setBooting(value: boolean) {
    booting.value = value;
  }

  function setLayoutMode(mode: LayoutMode) {
    settings.value.layoutMode = mode;
    persistSettings();
  }

  function setSidebarCollapsed(collapsed: boolean) {
    settings.value.sidebarCollapsed = collapsed;
    persistSettings();
  }

  function setColorScheme(scheme: ColorScheme) {
    settings.value.colorScheme = scheme;
    persistSettings();
  }

  function toggleColorScheme() {
    setColorScheme(settings.value.colorScheme === 'dark' ? 'light' : 'dark');
  }

  function setPrimaryColor(color: string) {
    settings.value.primaryColor = color;
    persistSettings();
  }

  function resetSettings() {
    settings.value = { ...defaultSettings };
    persistSettings();
  }

  return {
    booting: isBooting,
    layoutMode,
    colorScheme,
    isDark,
    primaryColor,
    sidebarCollapsed,
    bootstrap,
    setBooting,
    setColorScheme,
    setLayoutMode,
    setPrimaryColor,
    setSidebarCollapsed,
    toggleColorScheme,
    resetSettings
  };
});
