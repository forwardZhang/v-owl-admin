import type { MenuProps } from 'antdv-next';
import { h } from 'vue';
import type { MenuRecordRaw } from '@/types/menu';
import { resolveNavIcon } from './nav-icons';

export type MenuItem = Exclude<MenuProps['items'], undefined>[number];

/** 渲染单个菜单项的图标：命中图标库用图标，否则用首字/缩写占位块 */
export function renderMenuIcon(item: MenuRecordRaw) {
  const iconComponent = resolveNavIcon(item.icon ?? '');

  if (iconComponent) {
    return h(iconComponent, { class: 'text-sm text-app-primary' });
  }

  return h(
    'span',
    {
      class:
        'inline-grid h-6 w-6 place-items-center rounded-ant-lg bg-[rgba(var(--app-primary-rgb),0.12)] text-[11px] font-bold text-app-primary'
    },
    item.icon || item.title.slice(0, 2)
  );
}

/** 把菜单树转为 antd Menu items（递归，含图标） */
export function transformMenusToItems(menus: MenuRecordRaw[]): MenuItem[] {
  return menus.map((item) => ({
    children: item.children?.length ? transformMenusToItems(item.children) : undefined,
    icon: renderMenuIcon(item),
    key: item.path,
    label: item.title
  }));
}

/** 把菜单树转为「单层」antd Menu items（不含 children，用于顶部一级横向菜单） */
export function transformMenusToFlatItems(menus: MenuRecordRaw[]): MenuItem[] {
  return menus.map((item) => ({
    icon: renderMenuIcon(item),
    key: item.path,
    label: item.title
  }));
}

/** 找到 targetPath 在菜单树中的所有父级 path（用于展开 openKeys） */
export function collectParentPaths(
  menus: MenuRecordRaw[],
  targetPath: string,
  parents: string[] = []
): string[] {
  for (const item of menus) {
    if (item.path === targetPath) {
      return parents;
    }

    if (item.children?.length) {
      const result = collectParentPaths(item.children, targetPath, [...parents, item.path]);

      if (result.length) {
        return result;
      }
    }
  }

  return [];
}

/** 递归取第一个可跳转叶子节点的 path（用于点击一级菜单时落到具体页面） */
export function resolveFirstLeafPath(menu: MenuRecordRaw): string {
  if (menu.children?.length) {
    return resolveFirstLeafPath(menu.children[0]);
  }

  return menu.path;
}

/** 根据当前路由匹配命中的一级菜单 */
export function findActiveRoot(roots: MenuRecordRaw[], path: string): MenuRecordRaw | undefined {
  return roots.find((root) => path === root.path || path.startsWith(`${root.path}/`));
}
