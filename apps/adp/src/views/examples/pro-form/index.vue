<template>
  <AppProLayout title="ProForm 示例">
    <a-tabs v-model:active-key="active">
      <a-tab-pane key="basic" tab="基础 / 联动 / 时间映射">
        <BasicDemo />
      </a-tab-pane>
      <a-tab-pane key="api" tab="异步 options / 依赖请求">
        <ApiOptionsDemo />
      </a-tab-pane>
      <a-tab-pane key="search" tab="行内查询表单">
        <SearchFormDemo />
      </a-tab-pane>
      <a-tab-pane key="grid" tab="栅格 / 折叠搜索">
        <GridSearchDemo />
      </a-tab-pane>
      <a-tab-pane key="methods" tab="formApi 方法">
        <MethodsDemo />
      </a-tab-pane>
    </a-tabs>
  </AppProLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppProLayout from '@/components/app-pro-layout/index.vue';
import ApiOptionsDemo from './demos/api-options-demo.vue';
import BasicDemo from './demos/basic-demo.vue';
import GridSearchDemo from './demos/grid-search-demo.vue';
import MethodsDemo from './demos/methods-demo.vue';
import SearchFormDemo from './demos/search-form-demo.vue';

const active = ref('basic');
</script>

<style scoped lang="less"></style>
