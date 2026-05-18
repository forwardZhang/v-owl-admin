<template>
  <div class="slot-pane">
    <a-row :gutter="[16, 16]">
      <a-col v-for="item in displaySlots" :key="item.name" :xs="24" :lg="8">
        <a-card class="min-h-[178px] rounded-ant-lg shadow-app-soft" variant="borderless">
          <span class="text-xs font-bold text-app-primary">{{ item.name }}</span>
          <strong class="mb-2.5 mt-3 block text-xl text-app-text-primary">{{ item.title }}</strong>
          <p class="m-0 leading-[1.8] text-app-text-secondary">{{ item.description }}</p>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
interface SlotDemoItem {
  description: string;
  name: string;
  title: string;
}

const props = withDefaults(
  defineProps<{
    slots?: SlotDemoItem[];
  }>(),
  {
    slots: () => [
      {
        description: '覆盖页签标题，适合加状态、徽标或轻量统计。',
        name: 'tab-label-[key]',
        title: '自定义标签'
      },
      {
        description: '覆盖指定页签内容，复杂业务页可以拆成独立组件。',
        name: 'tab-[key]',
        title: '自定义内容'
      },
      {
        description: '统一承载页面级操作，避免每个业务区自己摆按钮。',
        name: 'extra',
        title: '右侧操作'
      }
    ]
  }
);

const displaySlots = props.slots;
</script>
