<template>
  <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
    <span class="text-xs font-bold uppercase text-app-primary">Capabilities</span>
    <h3 class="mb-[18px] mt-2 text-[22px] text-app-text-primary">
      参考 test-components/form 重新整理的能力地图
    </h3>

    <div class="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="item in capabilities"
        :key="item.title"
        class="min-h-[156px] rounded-ant-lg border border-app-border bg-white/80 p-4"
      >
        <a-tag :color="item.color">{{ item.group }}</a-tag>
        <strong class="mt-3 block text-base text-app-text-primary">{{ item.title }}</strong>
        <p class="mt-2.5 leading-[1.8] text-app-text-secondary">{{ item.description }}</p>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
const capabilities = [
  {
    color: 'blue',
    description: '覆盖 Input、InputPassword、Select、RadioGroup、CheckboxGroup、Switch、TextArea。',
    group: 'basic.vue',
    title: '基础组件矩阵'
  },
  {
    color: 'cyan',
    description: 'ApiSelect 根据业务线和场景重新请求产品候选，展示远程参数联动。',
    group: 'basic.vue',
    title: '远程选项'
  },
  {
    color: 'purple',
    description: 'componentSlots 直接声明组件内部插槽，type=custom + slot 声明模板内容。',
    group: 'custom.vue',
    title: '组件插槽'
  },
  {
    color: 'geekblue',
    description: 'ScenarioSwitch 使用 custom 组件接入，默认按 modelValue 同步表单值。',
    group: 'custom.vue',
    title: '自定义组件'
  },
  {
    color: 'orange',
    description: '通过 dependencies 演示 if、show、disabled、required、componentProps 和 trigger。',
    group: 'dynamic.vue',
    title: '动态联动'
  },
  {
    color: 'green',
    description: '使用 setState、updateSchema、removeSchemaByFields 调整 schema、按钮和全局配置。',
    group: 'api.vue',
    title: 'FormApi 操作'
  }
];
</script>
