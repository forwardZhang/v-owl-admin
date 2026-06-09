<template>
  <div class="flex h-screen w-full overflow-hidden bg-transparent">
    <!-- 第一列：一级图标轨道 -->
    <MenuRail :menus="roots" :active-key="activeRootPath" @select="handleSelect" />

    <!-- 第二列：当前一级的子菜单 -->
    <aside
      v-if="sideMenus.length"
      class="two-col-sub flex w-[210px] flex-none flex-col border-r border-app-border"
    >
      <div class="flex min-h-app-header items-center border-b border-app-border px-5">
        <strong class="truncate text-sm font-bold text-app-text-primary">
          {{ activeRoot?.title || 'Owl Admin' }}
        </strong>
      </div>
      <Menu class="pt-3" :menus="sideMenus" :collapsed="false" />
    </aside>

    <!-- 内容区 -->
    <a-layout class="flex h-screen min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-transparent">
      <header
        class="app-shell-header flex min-h-app-header flex-none items-center justify-between gap-[18px] border-b border-app-border px-4"
      >
        <div class="min-w-0 flex-1">
          <Breadcrumb />
        </div>
        <HeaderActions />
      </header>
      <Main />
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Breadcrumb from '../components/breadcrumb.vue';
import HeaderActions from '../components/header-actions.vue';
import Main from '../components/main.vue';
import Menu from '../components/menu.vue';
import MenuRail from '../components/menu-rail.vue';
import { findActiveRoot, resolveFirstLeafPath } from '../components/menu-shared';
import { useAccessStore } from '@/store/modules/access';

const route = useRoute();
const router = useRouter();
const accessStore = useAccessStore();

const roots = computed(() => accessStore.accessMenus);
const activeRoot = computed(() => findActiveRoot(roots.value, route.path) ?? roots.value[0]);
const activeRootPath = computed(() => activeRoot.value?.path ?? '');
const sideMenus = computed(() => activeRoot.value?.children ?? []);

function handleSelect(key: string) {
  const root = roots.value.find((item) => item.path === key);

  if (root) {
    router.push(resolveFirstLeafPath(root));
  }
}
</script>

<style scoped lang="less">
.two-col-sub {
  background: var(--app-surface);
  backdrop-filter: blur(18px);
}
</style>
