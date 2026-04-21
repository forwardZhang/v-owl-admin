<template>
  <div class="not-found">
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

<style scoped lang="less">
.not-found {
  display: grid;
  place-items: center;
  min-height: calc(100vh - 180px);
  padding: 24px;
}
</style>
