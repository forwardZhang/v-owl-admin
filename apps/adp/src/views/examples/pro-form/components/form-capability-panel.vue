<template>
  <a-card class="form-capability-panel" variant="borderless">
    <span class="form-capability-panel__eyebrow">Capabilities</span>
    <h3>这个示例覆盖的 ProForm 能力</h3>

    <div class="form-capability-panel__grid">
      <div v-for="item in capabilities" :key="item.title" class="form-capability-panel__item">
        <strong>{{ item.title }}</strong>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
const capabilities = [
  {
    description: '产品下拉会跟随业务线和场景变化发起远程请求，返回结果不是固定列表。',
    title: '条件化远程请求'
  },
  {
    description: 'rowProps 和 colProps 共同控制桌面三列、移动端单列的响应式布局。',
    title: '响应式栅格'
  },
  {
    description: '策略倾向字段使用业务自定义组件，并通过组件插槽注入提示和标签。',
    title: '自定义组件与插槽'
  },
  {
    description: '高级配置、预算、负责人等字段会根据开关和紧急程度动态出现、必填或禁用。',
    title: '动态属性'
  }
];
</script>

<style scoped lang="less">
.form-capability-panel {
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.form-capability-panel__eyebrow {
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.form-capability-panel h3 {
  margin: 8px 0 18px;
  color: var(--app-text-primary);
  font-size: 22px;
}

.form-capability-panel__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.form-capability-panel__item {
  min-height: 128px;
  padding: 16px;
  border: 1px solid var(--app-border);
  border-radius: var(--ant-border-radius-lg);
  background: rgba(255, 255, 255, 0.82);
}

.form-capability-panel__item strong {
  color: var(--app-text-primary);
  font-size: 16px;
}

.form-capability-panel__item p {
  margin: 10px 0 0;
  color: var(--app-text-secondary);
  line-height: 1.8;
}

@media (max-width: 768px) {
  .form-capability-panel__grid {
    grid-template-columns: 1fr;
  }
}
</style>
