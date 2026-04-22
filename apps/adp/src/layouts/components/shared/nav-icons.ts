import {
  AppstoreOutlined,
  DashboardOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined
} from '@antdv-next/icons';
import type { Component } from 'vue';

const navIconMap: Record<string, Component> = {
  dashboard: DashboardOutlined,
  menus: AppstoreOutlined,
  roles: TeamOutlined,
  system: SettingOutlined,
  users: UserOutlined
};

export function resolveNavIcon(iconKey?: string) {
  if (!iconKey) {
    return null;
  }

  return navIconMap[iconKey] || null;
}
