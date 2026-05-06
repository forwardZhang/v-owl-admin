<template>
  <div class="page-container">
    <div v-if="showHeader" class="page-container__header">
      <div class="page-container__tabs-shell">
        <Tabs
          :active-key="mergedActiveKey"
          class="page-container__tabs"
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

        <div v-if="$slots.extra" class="page-container__extra">
          <slot name="extra" />
        </div>
      </div>
    </div>

    <div class="page-container__body">
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
import type { PageContainerTabItem } from './types';

defineOptions({
  name: 'PageContainer'
});

const props = withDefaults(
  defineProps<{
    activeKey?: string;
    description?: string;
    tabs?: PageContainerTabItem[];
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
  change: [activeKey: string, tab?: PageContainerTabItem];
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
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  overflow: hidden;
}

.page-container__header {
  flex: none;
  overflow: hidden;
  border-radius: 0;
  box-shadow: var(--app-shadow-soft);
  background:
    radial-gradient(circle at top left, rgba(var(--app-primary-rgb), 0.16) 0%, transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(243, 248, 255, 0.96) 100%);
  gap: 24px;
  padding: 0 12px;
}

.page-container__tabs-shell {
  display: flex;
  justify-content: space-between;
}

.page-container__tabs {
  min-width: 0;
  flex: 1;
}

.page-container__tabs :deep(.ant-tabs-nav) {
  margin: 0;
}

.page-container__tabs :deep(.ant-tabs-tab) {
  font-size: 13px;
  font-weight: 600;
}

.page-container__tabs :deep(.ant-tabs-tab-btn) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.page-container__tabs :deep(.ant-tabs-content-holder) {
  display: none;
}

.page-container__extra {
  display: flex;
  flex: none;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.page-container__body {
  flex: 1;
  min-height: 0;
  padding: 12px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
}
</style>
