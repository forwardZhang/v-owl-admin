<template>
  <div class="playground-pane flex flex-col">
    <a-row :gutter="[18, 18]">
      <a-col :xs="24" :lg="14">
        <a-card class="h-full rounded-ant-lg shadow-app-soft" variant="borderless">
          <span
            class="inline-flex h-6 items-center rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-2.5 text-xs font-bold text-app-primary"
          >
            Scenario
          </span>
          <h3 class="mb-2.5 mt-3 text-xl text-app-text-primary">适合接住二级页面内容</h3>
          <p class="leading-[1.8] text-app-text-secondary">
            比如“用户详情”“角色配置”“策略中心”这类页面，外层是多
            tabs，内层某个面板依然可以保持统一的标题和操作区。
          </p>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="10">
        <a-card class="h-full rounded-ant-lg shadow-app-soft" variant="borderless">
          <span
            class="inline-flex h-6 items-center rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-2.5 text-xs font-bold text-app-primary"
          >
            Strategy
          </span>
          <h3 class="mb-2.5 mt-3 text-xl text-app-text-primary">组合而不是耦合</h3>
          <p class="leading-[1.8] text-app-text-secondary">
            `ProPage`
            不抢业务状态，只负责结构。真正的列表、表单、详情组件可以继续各写各的，边界很清爽。
          </p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.playground-pane :deep(.pro-page__header) {
  box-shadow: none;
  background:
    radial-gradient(circle at top left, rgba(var(--app-primary-rgb), 0.12) 0%, transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(246, 249, 255, 0.96) 100%);
}
</style>
