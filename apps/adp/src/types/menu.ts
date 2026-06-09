export interface AppRouteMeta extends Record<PropertyKey, unknown> {
  title: string;
  icon?: string;
  order?: number;
  hidden?: boolean;
  keepAlive?: boolean;
  activeMenu?: string;
  requiresAuth?: boolean;
}

export interface MenuRecord {
  id: string;
  name: string;
  path: string;
  component?: string;
  redirect?: string;
  icon?: string;
  meta: AppRouteMeta;
  children?: MenuRecord[];
}

/**
 * 从可访问路由树派生的 UI 菜单节点（单一数据源）。
 * 区别于 `MenuRecord`（后端下发的路由配置 / 系统菜单 CRUD 实体）：
 * 菜单渲染只关心展示所需字段，meta 已被拍平到顶层。
 */
export interface MenuRecordRaw {
  path: string;
  name: string;
  title: string;
  icon?: string;
  order?: number;
  children?: MenuRecordRaw[];
}
