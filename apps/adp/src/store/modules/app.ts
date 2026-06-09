import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
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
  progressBar: boolean;
}

const defaultSettings: AppSettings = {
  layoutMode: 'sidebar',
  colorScheme: 'light',
  sidebarCollapsed: false,
  primaryColor: DEFAULT_PRIMARY_COLOR,
  progressBar: true
};

/** 把主色与配色方案落到 :root 上：主色 CSS 变量 + html.dark 开关 */
function applyTheme(settings: AppSettings) {
  const root = document.documentElement;

  root.style.setProperty('--app-primary', settings.primaryColor);
  root.style.setProperty('--app-primary-rgb', toRgbTriple(settings.primaryColor));

  const isDark = settings.colorScheme === 'dark';
  root.classList.toggle('dark', isDark);
  root.style.colorScheme = settings.colorScheme;
}

export const useAppStore = defineStore('app', () => {
  // 合并默认值，历史残留 / 缺失字段都能被规整
  const settings = ref<AppSettings>({
    ...defaultSettings,
    ...getStorage<Partial<AppSettings>>(APP_STORAGE_KEY, {})
  });
  const booting = ref(true);

  const isBooting = computed(() => booting.value);
  const layoutMode = computed(() => settings.value.layoutMode);
  const colorScheme = computed(() => settings.value.colorScheme);
  const isDark = computed(() => settings.value.colorScheme === 'dark');
  const sidebarCollapsed = computed(() => settings.value.sidebarCollapsed);
  const primaryColor = computed(() => settings.value.primaryColor);
  const progressBar = computed(() => settings.value.progressBar);

  function persistSettings() {
    setStorage(APP_STORAGE_KEY, settings.value);
  }

  function bootstrap() {
    applyTheme(settings.value);
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
    applyTheme(settings.value);
    persistSettings();
  }

  function toggleColorScheme() {
    setColorScheme(settings.value.colorScheme === 'dark' ? 'light' : 'dark');
  }

  function setPrimaryColor(color: string) {
    settings.value.primaryColor = color;
    applyTheme(settings.value);
    persistSettings();
  }

  function setProgressBar(value: boolean) {
    settings.value.progressBar = value;
    persistSettings();
  }

  /** 恢复全部偏好为默认值，并重新落地主题 */
  function resetSettings() {
    settings.value = { ...defaultSettings };
    applyTheme(settings.value);
    persistSettings();
  }

  return {
    booting: isBooting,
    layoutMode,
    colorScheme,
    isDark,
    primaryColor,
    progressBar,
    sidebarCollapsed,
    bootstrap,
    setBooting,
    setColorScheme,
    setLayoutMode,
    setPrimaryColor,
    setProgressBar,
    setSidebarCollapsed,
    toggleColorScheme,
    resetSettings
  };
});
