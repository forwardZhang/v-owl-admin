<template>
  <AppProLayout content-class="bg-white dark:bg-[#141414] p-4 rounded-lg min-h-full">
    <template #extra>
      <a-button type="primary">操作按钮</a-button>
    </template>

    <div class="h-full">
      <h3 class="text-lg mb-4 font-medium text-app-text-primary">页面内容区</h3>
      <p class="text-app-text-tertiary mb-6">
        这是一个没有配置 Tabs 的单页面 ProPage 容器，可以用来展示普通的详情、表单或者列表等内容。
      </p>
      <div
        class="p-4 border border-dashed border-app-border rounded text-app-text-tertiary flex items-center justify-center bg-gray-50/50 dark:bg-[#1f1f1f]/50"
        style="min-height: 400px"
      >
        内容区域占位
      </div>
    </div>
  </AppProLayout>
</template>

<script setup lang="ts">
import AppProLayout from '@/components/app-pro-layout/index.vue';
</script>
