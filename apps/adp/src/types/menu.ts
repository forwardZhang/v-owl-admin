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
