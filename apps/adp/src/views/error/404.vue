<template>
  <div class="grid min-h-[calc(100vh-180px)] place-items-center p-6">
    <a-result
      status="404"
      title="页面走丢了"
      sub-title="当前地址没有匹配到可访问页面，你可以返回工作台继续推进业务。"
    >
      <template #extra>
        <RouterLink to="/dashboard">
          <a-button type="primary">返回 Dashboard</a-button>
        </RouterLink>
      </template>
    </a-result>
  </div>
</template>

<script setup lang="ts"></script>
