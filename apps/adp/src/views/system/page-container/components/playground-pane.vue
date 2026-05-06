<template>
  <div class="playground-pane">
    <a-row :gutter="[18, 18]">
      <a-col :xs="24" :lg="14">
        <a-card class="playground-pane__card" variant="borderless">
          <span class="playground-pane__eyebrow">Scenario</span>
          <h3>适合接住二级页面内容</h3>
          <p>
            比如“用户详情”“角色配置”“策略中心”这类页面，外层是多
            tabs，内层某个面板依然可以保持统一的标题和操作区。
          </p>
        </a-card>
      </a-col>

      <a-col :xs="24" :lg="10">
        <a-card class="playground-pane__card" variant="borderless">
          <span class="playground-pane__eyebrow">Strategy</span>
          <h3>组合而不是耦合</h3>
          <p>
            `PageContainer`
            不抢业务状态，只负责结构。真正的列表、表单、详情组件可以继续各写各的，边界很清爽。
          </p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.playground-pane {
  display: flex;
  flex-direction: column;
}

.playground-pane :deep(.owl-page-container__header) {
  box-shadow: none;
  background:
    radial-gradient(circle at top left, rgba(var(--app-primary-rgb), 0.12) 0%, transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(246, 249, 255, 0.96) 100%);
}

.playground-pane__card {
  height: 100%;
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.playground-pane__eyebrow {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
  background: rgba(var(--app-primary-rgb), 0.1);
}

.playground-pane__card h3 {
  margin: 12px 0 10px;
  color: var(--app-text-primary);
  font-size: 20px;
}

.playground-pane__card p {
  margin: 0;
  color: var(--app-text-secondary);
  line-height: 1.8;
}
</style>
