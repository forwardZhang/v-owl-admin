export const APP_TITLE = 'V Owl Admin';

export const APP_SUBTITLE = '面向中后台场景的企业级管理控制台';

export const LOGIN_PATH = '/login';

export const HOME_PATH = '/dashboard';

export const WHITE_LIST = [LOGIN_PATH];

export const DEFAULT_THEME = {
  name: 'aurora',
  primaryColor: '#1677ff',
  primaryHoverColor: '#4096ff',
  primaryActiveColor: '#0958d9',
  primaryRgb: '22, 119, 255'
} as const;

export const THEME_COLOR_PRESETS = [
  '#1677ff',
  '#13c2c2',
  '#2f54eb',
  '#eb2f96',
  '#fa8c16',
  '#52c41a',
  '#722ed1',
  '#f5222d'
] as const;
