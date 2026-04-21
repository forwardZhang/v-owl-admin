import type { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { cloneDeep, sortBy } from 'lodash-es';
import { computed, ref } from 'vue';
import { fetchMenuTreeApi } from '@/api/menu';
import { transformMenusToRoutes } from '@/router/route-map';
import type { MenuRecord } from '@/types/menu';

function sortMenus(menus: MenuRecord[]): MenuRecord[] {
  return sortBy(cloneDeep(menus), (menu) => menu.meta.order ?? 0).map((menu) => ({
    ...menu,
    children: menu.children?.length ? sortMenus(menu.children) : undefined
  }));
}

export const usePermissionStore = defineStore('permission', () => {
  const menus = ref<MenuRecord[]>([]);
  const dynamicRoutes = ref<RouteRecordRaw[]>([]);
  const routesReady = ref(false);

  const visibleMenus = computed(() => menus.value.filter((menu) => !menu.meta.hidden));

  async function generatePermissions() {
    const menuTree = await fetchMenuTreeApi();
    const sortedMenus = sortMenus(menuTree);

    menus.value = sortedMenus;
    dynamicRoutes.value = transformMenusToRoutes(sortedMenus);
    routesReady.value = false;

    return dynamicRoutes.value;
  }

  function markRoutesReady(ready: boolean) {
    routesReady.value = ready;
  }

  function resetPermissions() {
    menus.value = [];
    dynamicRoutes.value = [];
    routesReady.value = false;
  }

  return {
    dynamicRoutes,
    menus,
    routesReady,
    visibleMenus,
    generatePermissions,
    markRoutesReady,
    resetPermissions
  };
});
