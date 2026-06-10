<template>
  <div>
    <h3 class="text-lg mb-4 font-medium text-app-text-primary">概览内容</h3>
    <p class="text-app-text-tertiary">
      这是 Overview 面板的内容，只有拥有 /examples/pro-page/overview 路由权限才会看到此 Tab。
    </p>
    <div
      class="mt-6 p-4 border border-dashed border-app-border rounded text-app-text-tertiary"
      style="height: 1000px"
    >
      （模拟超长内容，测试 ProPage 内部滚动是否正常）
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 概览面板组件
 * @description 可以在此添加该 Tab 专属的请求逻辑与局部状态
 */
</script>
