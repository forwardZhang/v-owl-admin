import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { DEFAULT_THEME } from '@/constants/app';
import { APP_STORAGE_KEY } from '@/constants/storage';
import { getStorage, setStorage } from '@/utils/storage';

interface AppSettings {
  sidebarCollapsed: boolean;
  mobileMenuVisible: boolean;
  primaryColor: string;
  primaryHoverColor: string;
  primaryActiveColor: string;
  primaryRgb: string;
}

const defaultSettings: AppSettings = {
  sidebarCollapsed: false,
  mobileMenuVisible: false,
  primaryColor: DEFAULT_THEME.primaryColor,
  primaryHoverColor: DEFAULT_THEME.primaryHoverColor,
  primaryActiveColor: DEFAULT_THEME.primaryActiveColor,
  primaryRgb: DEFAULT_THEME.primaryRgb
};

function applyThemeVariables(settings: AppSettings) {
  const root = document.documentElement;

  root.style.setProperty('--app-primary', settings.primaryColor);
  root.style.setProperty('--app-primary-hover', settings.primaryHoverColor);
  root.style.setProperty('--app-primary-active', settings.primaryActiveColor);
  root.style.setProperty('--app-primary-rgb', settings.primaryRgb);
}

export const useAppStore = defineStore('app', () => {
  const settings = ref<AppSettings>(getStorage(APP_STORAGE_KEY, defaultSettings));

  const sidebarCollapsed = computed(() => settings.value.sidebarCollapsed);
  const mobileMenuVisible = computed(() => settings.value.mobileMenuVisible);
  const primaryColor = computed(() => settings.value.primaryColor);

  function persistSettings() {
    setStorage(APP_STORAGE_KEY, settings.value);
  }

  function bootstrap() {
    applyThemeVariables(settings.value);
  }

  function toggleSidebar() {
    settings.value.sidebarCollapsed = !settings.value.sidebarCollapsed;
    persistSettings();
  }

  function setMobileMenuVisible(visible: boolean) {
    settings.value.mobileMenuVisible = visible;
    persistSettings();
  }

  function setPrimaryColor(
    payload: Pick<
      AppSettings,
      'primaryColor' | 'primaryHoverColor' | 'primaryActiveColor' | 'primaryRgb'
    >
  ) {
    settings.value = {
      ...settings.value,
      ...payload
    };

    applyThemeVariables(settings.value);
    persistSettings();
  }

  return {
    mobileMenuVisible,
    primaryColor,
    sidebarCollapsed,
    bootstrap,
    setMobileMenuVisible,
    setPrimaryColor,
    toggleSidebar
  };
});
