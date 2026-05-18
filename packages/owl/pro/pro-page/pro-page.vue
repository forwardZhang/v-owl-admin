<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden">
    <div
      v-if="showHeader"
      class="pro-page__header flex-none overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(var(--app-primary-rgb),0.16)_0%,transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(243,248,255,0.96)_100%)] px-3 shadow-app-soft"
    >
      <div class="flex justify-between">
        <Tabs
          :active-key="mergedActiveKey"
          class="pro-page__tabs min-w-0 flex-1"
          @update:active-key="handleTabChange"
        >
          <TabPane v-for="tab in normalizedTabs" :key="tab.key">
            <template #tab>
              <slot :name="`tab-label-${tab.key}`" :tab="tab">
                {{ tab.title }}
              </slot>
            </template>
          </TabPane>
        </Tabs>

        <div v-if="$slots.extra" class="ml-auto flex flex-none items-center gap-3">
          <slot name="extra" />
        </div>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain p-3">
      <template v-if="hasTabs && activeTab">
        <slot :name="`tab-${activeTab.key}`" :tab="activeTab">
          <component
            :is="activeTab.component"
            v-if="activeTab.component"
            v-bind="activeTab.props"
          />
          <Empty v-else description="当前标签页暂未配置内容" />
        </slot>
      </template>

      <slot v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { find } from 'lodash-es';
import { Empty, TabPane, Tabs } from 'antdv-next';
import { computed, ref, watch } from 'vue';
import type { ProPageTabItem } from './types';

defineOptions({
  name: 'ProPage'
});

const props = withDefaults(
  defineProps<{
    activeKey?: string;
    description?: string;
    tabs?: ProPageTabItem[];
    title?: string;
  }>(),
  {
    activeKey: undefined,
    description: '',
    tabs: () => [],
    title: ''
  }
);

const emit = defineEmits<{
  change: [activeKey: string, tab?: ProPageTabItem];
  'update:activeKey': [activeKey: string];
}>();

const innerActiveKey = ref(props.activeKey ?? props.tabs[0]?.key ?? '');

const normalizedTabs = computed(() => {
  return props.tabs.filter((item) => Boolean(item.key && item.title));
});

const hasTabs = computed(() => normalizedTabs.value.length > 0);

const mergedActiveKey = computed(() => {
  if (!hasTabs.value) {
    return '';
  }

  const currentKey = props.activeKey ?? innerActiveKey.value;

  return find(normalizedTabs.value, { key: currentKey })?.key ?? normalizedTabs.value[0].key;
});

const activeTab = computed(() => {
  if (!hasTabs.value) {
    return undefined;
  }

  return find(normalizedTabs.value, { key: mergedActiveKey.value }) ?? normalizedTabs.value[0];
});

const showHeader = computed(() => {
  return hasTabs.value;
});

watch(
  normalizedTabs,
  (tabs) => {
    if (props.activeKey) {
      return;
    }

    if (!tabs.length) {
      innerActiveKey.value = '';
      return;
    }

    if (!find(tabs, { key: innerActiveKey.value })) {
      innerActiveKey.value = tabs[0].key;
    }
  },
  {
    immediate: true
  }
);

function handleTabChange(nextActiveKey: string) {
  innerActiveKey.value = nextActiveKey;

  const nextTab = find(normalizedTabs.value, { key: nextActiveKey });

  emit('update:activeKey', nextActiveKey);
  emit('change', nextActiveKey, nextTab);
}
</script>

<style scoped lang="less">
.pro-page__tabs :deep(.ant-tabs-nav) {
  margin: 0;
}

.pro-page__tabs :deep(.ant-tabs-tab) {
  font-size: 13px;
  font-weight: 600;
}

.pro-page__tabs :deep(.ant-tabs-tab-btn) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.pro-page__tabs :deep(.ant-tabs-content-holder) {
  display: none;
}
</style>
