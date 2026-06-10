<template>
  <div class="pro-page h-full flex flex-col bg-[#f0f2f5] dark:bg-black">
    <!-- Header Area -->
    <div v-if="!hideHeader" class="bg-white dark:bg-[#141414] px-6 shadow-sm flex-shrink-0 z-10">
      <div
        v-if="authorizedTabs.length === 0"
        class="flex justify-between items-center min-h-[45px]"
      >
        <div class="flex-1 flex items-center gap-3">
          <slot name="title">
            <div v-if="title" class="text-[14px] font-medium text-app-text-primary m-0">
              {{ title }}
            </div>
          </slot>
        </div>
        <div class="ml-4 flex-shrink-0">
          <slot name="extra"></slot>
        </div>
      </div>

      <!-- Tabs -->
      <a-tabs
        v-if="authorizedTabs.length > 0"
        :active-key="currentTab"
        class="pro-page-tabs -mb-[1px]"
        @change="handleTabChange"
      >
        <a-tab-pane v-for="tab in authorizedTabs" :key="tab.key" :tab="tab.label" />
        <template v-if="$slots.leftExtra" #leftExtra>
          <div class="mr-4 flex items-center">
            <slot name="leftExtra"></slot>
          </div>
        </template>
        <template v-if="$slots.extra" #rightExtra>
          <slot name="extra"></slot>
        </template>
      </a-tabs>
    </div>

    <!-- Content Area -->
    <div class="flex-1 min-h-0 overflow-y-auto p-3">
      <slot :active-tab="currentTab"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { ProPageTabItem } from './types';

defineOptions({
  name: 'ProPage'
});

const props = withDefaults(
  defineProps<{
    title?: string;
    hideHeader?: boolean;
    tabs?: ProPageTabItem[];
    queryKey?: string;
    hasTabAccess?: (tab: ProPageTabItem) => boolean;
  }>(),
  {
    hideHeader: false,
    tabs: () => [],
    queryKey: 'tab',
    hasTabAccess: () => true
  }
);

defineSlots<{
  title?: (props: Record<string, never>) => any;
  extra?: (props: Record<string, never>) => any;
  leftExtra?: (props: Record<string, never>) => any;
  default?: (props: { activeTab: string }) => any;
}>();

const route = useRoute();
const router = useRouter();

/**
 * 过滤出有权限的 tabs
 */
const authorizedTabs = computed(() => {
  if (!props.tabs || props.tabs.length === 0) return [];
  return props.tabs.filter((tab) => props.hasTabAccess(tab));
});

/**
 * 获取当前 URL 中的 tab 值，如果没有或非法，则回退到第一个有权限的 tab
 */
const currentTab = computed(() => {
  const queryVal = route.query[props.queryKey] as string;

  // 当 tabs 尚未加载时，直接信任 query，防止被 watch 机制意外清空
  if (authorizedTabs.value.length === 0) {
    return queryVal || '';
  }

  const isAuthorized = authorizedTabs.value.some((t) => t.key === queryVal);

  if (isAuthorized) {
    return queryVal;
  }

  return authorizedTabs.value[0].key;
});

/**
 * 监听 currentTab 变化，当不符合预期时自动更正 URL
 */
watch(
  currentTab,
  (newVal) => {
    // 只有在有了授权 tab 数据的前提下，才去纠正 URL
    if (authorizedTabs.value.length === 0) return;

    const queryVal = route.query[props.queryKey] as string;
    if (newVal && newVal !== queryVal) {
      router.replace({
        query: {
          ...route.query,
          [props.queryKey]: newVal
        }
      });
    }
  },
  { immediate: true }
);

const emit = defineEmits<{
  (e: 'tab-change', key: string): void;
}>();

/**
 * 切换 Tab 时，更新 URL query
 */
const handleTabChange = (key: any) => {
  router.replace({
    query: {
      ...route.query,
      [props.queryKey]: key as string
    }
  });
  emit('tab-change', key as string);
};
</script>

<style scoped>
.pro-page-tabs :deep(.ant-tabs-nav) {
  margin-bottom: 0;
}
.pro-page-tabs :deep(.ant-tabs-nav::before) {
  border-bottom: 1px solid transparent;
}
.pro-page-tabs :deep(.ant-tabs-tab) {
  font-size: 14px;
}
</style>
