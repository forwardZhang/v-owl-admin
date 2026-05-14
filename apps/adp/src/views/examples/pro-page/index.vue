<template>
  <ProPage v-model:active-key="activeKey" :tabs="tabs">
    <template #extra>
      <a-space wrap>
        <a-tag color="success">packages/owl/pro/pro-page</a-tag>
        <a-button>查看文档</a-button>
        <a-button type="primary">复制模板</a-button>
      </a-space>
    </template>

    <template #tab-label-slots>
      插槽组合
      <a-tag color="blue">Slot</a-tag>
    </template>

    <template #tab-slots>
      <SlotPane />
    </template>
  </ProPage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ProPage } from '@owl/components';
import type { ProPageTabItem } from '@owl/components';
import OperationPane from './components/operation-pane.vue';
import SlotPane from './components/slot-pane.vue';

const activeKey = ref('operation');

const tabs: ProPageTabItem[] = [
  {
    component: OperationPane,
    key: 'operation',
    title: '页面骨架'
  },
  {
    key: 'slots',
    title: '插槽组合'
  },
  {
    component: SlotPane,
    key: 'reuse',
    title: '组件复用'
  }
];
</script>
