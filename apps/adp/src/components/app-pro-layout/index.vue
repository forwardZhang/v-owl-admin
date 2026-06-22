<template>
  <PageLayout
    v-bind="$attrs"
    :title="computedTitle"
    :hide-header="hideHeader"
    :query-key="queryKey"
    :tabs="processedTabs"
  >
    <template v-if="$slots.title" #title="slotProps">
      <slot name="title" v-bind="slotProps || {}"> </slot>
    </template>
    <template v-if="$slots.leftExtra" #leftExtra="slotProps">
      <slot name="leftExtra" v-bind="slotProps || {}"></slot>
    </template>
    <template v-if="$slots.extra" #extra="slotProps">
      <slot name="extra" v-bind="slotProps || {}"></slot>
    </template>
    <template #default="slotProps">
      <!-- 如果使用者传入了默认插槽内容（如单页面），包裹一层静态背景容器 -->
      <div v-if="$slots.default" class="min-h-full" :class="contentClass">
        <slot name="default" v-bind="slotProps || {}"></slot>
      </div>

      <!-- 如果没有传默认插槽（如 tab 页面），则背景容器需要包裹在 transition 内部 -->
      <transition v-else name="fade-slide" mode="out-in">
        <div
          v-if="getTabComponent(slotProps.activeTab)"
          :key="slotProps.activeTab"
          class="min-h-full"
          :class="contentClass"
        >
          <component :is="getTabComponent(slotProps.activeTab)" />
        </div>
      </transition>
    </template>
  </PageLayout>
</template>

<script lang="ts">
import type { PageLayoutTabItem } from '@owl/components';
import type { Component } from 'vue';

export interface AppProLayoutTabItem extends PageLayoutTabItem {
  component?: Component;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useAccessStore } from '@/store/modules/access';
import { useRoute, type RouteRecordRaw } from 'vue-router';
import { PageLayout } from '@owl/components';

defineOptions({
  name: 'AppProLayout'
});

const props = withDefaults(
  defineProps<{
    title?: string;
    hideHeader?: boolean;
    contentClass?: any;
    tabs?: AppProLayoutTabItem[];
    queryKey?: string;
  }>(),
  {
    hideHeader: false,
    // 默认透明：让页面内容（ProPage 等）自行控制背景与卡片，
    // 避免外层白卡与内部白卡嵌套。单页内容可显式传入 contentClass。
    contentClass: '',
    tabs: () => [],
    queryKey: 'tab'
  }
);

defineSlots<{
  title?: (props: Record<string, never>) => any;
  extra?: (props: Record<string, never>) => any;
  leftExtra?: (props: Record<string, never>) => any;
  default?: (props: { activeTab: string }) => any;
}>();

const accessStore = useAccessStore();
const route = useRoute();

/**
 * 计算页面标题：
 * 1. 如果手动传入了 title，则优先级最高。
 * 2. 如果没有 tabs，则默认提取当前路由 (远程数据) 的 meta.title。
 */
const computedTitle = computed(() => {
  if (props.title) return props.title;
  if (!props.tabs || props.tabs.length === 0) {
    return (route.meta?.title as string) || '';
  }
  return '';
});

/**
 * 递归查找路由树中是否存在指定 name 的路由，并返回该路由对象
 */
const findRouteByName = (routes: RouteRecordRaw[], name: string): RouteRecordRaw | undefined => {
  for (const route of routes) {
    if (route.name === name) return route;
    if (route.children) {
      const found = findRouteByName(route.children, name);
      if (found) return found;
    }
  }
  return undefined;
};

/**
 * 处理传入的 tabs：
 * 1. 过滤掉没有权限的 tab (依据 tab.auth 在 accessRoutes 中查找)
 * 2. 如果找到了对应路由，将其 meta.title 作为 tab 的 label
 */
const processedTabs = computed(() => {
  return props.tabs
    .map((tab) => {
      // 如果没有配置 auth，默认直接放行
      if (!tab.auth) {
        return tab;
      }

      const route = findRouteByName(accessStore.accessRoutes, tab.auth as string);

      // 没有找到对应路由，说明没有权限
      if (!route) {
        return null;
      }

      // 找到了路由，则使用路由的标题覆盖原来的 label (如果路由有设置 title)
      const routeTitle = route.meta?.title as string | undefined;
      return {
        ...tab,
        label: routeTitle || tab.label
      };
    })
    .filter(Boolean) as AppProLayoutTabItem[];
});

// 获取对应 tab 的组件
const getTabComponent = (key: string) => {
  const tab = props.tabs.find((t) => t.key === key);
  return tab?.component;
};
</script>
