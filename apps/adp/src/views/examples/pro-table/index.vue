<template>
  <AppProLayout title="ProTable 示例">
    <a-tabs v-model:active-key="active">
      <a-tab-pane key="basic" tab="基础 / 透传">
        <BasicDemo />
      </a-tab-pane>
      <a-tab-pane key="request" tab="远程请求 / 分页">
        <RequestDemo />
      </a-tab-pane>
      <a-tab-pane key="batch" tab="多选 / 批量区">
        <BatchDemo />
      </a-tab-pane>
    </a-tabs>
  </AppProLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppProLayout from '@/components/app-pro-layout/index.vue';
import BatchDemo from './demos/batch-demo.vue';
import BasicDemo from './demos/basic-demo.vue';
import RequestDemo from './demos/request-demo.vue';

const active = ref('basic');
</script>
