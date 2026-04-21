export interface SystemUserRecord {
  department: string;
  id: string;
  lastLoginAt: string;
  nickname: string;
  phone: string;
  roleName: string;
  status: 'enabled' | 'disabled';
  username: string;
}

export interface SystemMenuRecord {
  component: string;
  id: string;
  order: number;
  path: string;
  permission: string;
  status: 'enabled' | 'disabled';
  title: string;
  type: 'directory' | 'menu' | 'button';
}

export interface SystemRoleRecord {
  code: string;
  dataScope: string;
  description: string;
  id: string;
  name: string;
  permissionTags: string[];
  status: 'enabled' | 'disabled';
  userCount: number;
}
