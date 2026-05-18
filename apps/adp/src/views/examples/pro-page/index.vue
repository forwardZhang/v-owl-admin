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

    <template #tab-label-empty>
      空状态
      <a-tag color="default">Fallback</a-tag>
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
    title: '组件复用',
    props: {
      slots: [
        {
          description: '同一个组件可以通过 tabs.props 注入不同数据，不需要额外写 tab 插槽。',
          name: 'props',
          title: 'Props 驱动'
        },
        {
          description: '适合概览、详情、审计记录这类布局相似但数据不同的页面区块。',
          name: 'component',
          title: '组件渲染'
        },
        {
          description: '业务页只维护组件自身状态，ProPage 负责顶部导航和内容容器。',
          name: 'container',
          title: '容器托管'
        }
      ]
    }
  },
  {
    component: OperationPane,
    key: 'props',
    props: {
      description: '这个标签页直接通过 tabs.props 改变组件内容，验证配置化组件渲染路径。',
      metrics: [
        {
          label: '接入页面',
          trend: '配置复用',
          value: '6'
        },
        {
          label: '插槽覆盖',
          trend: 'label + content',
          value: '2'
        },
        {
          label: '空态兜底',
          trend: '自动呈现',
          value: '1'
        }
      ],
      statusColor: 'success',
      statusText: 'Props',
      title: 'Props 驱动渲染'
    },
    title: 'Props 渲染'
  },
  {
    key: 'empty',
    title: '空状态'
  }
];
</script>
