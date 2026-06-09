<template>
  <div class="flex flex-col gap-4">
    <a-alert
      type="info"
      show-icon
      message="演示：inline 行内布局、自定义按钮文案、值变化即触发查询"
    />
    <ProForm />
    <a-card size="small" title="当前查询条件">
      <pre class="m-0 text-[13px] leading-[1.7]">{{ query }}</pre>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProForm } from '@owl/components';
import { fetchRoles } from '../mock-api';

const query = ref('{}');

const [ProForm] = useProForm({
  layout: 'inline',
  submitOnChange: true,
  submitButtonOptions: { content: '查询' },
  resetButtonOptions: { content: '重置' },
  schema: [
    {
      fieldName: 'keyword',
      label: '关键词',
      component: 'Input',
      componentProps: { placeholder: '名称/编号', allowClear: true }
    },
    {
      fieldName: 'role',
      label: '角色',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '全部',
        allowClear: true,
        style: { width: '160px' },
        request: { api: fetchRoles }
      }
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '全部',
        allowClear: true,
        style: { width: '140px' },
        options: [
          { label: '启用', value: 1 },
          { label: '停用', value: 0 }
        ]
      }
    }
  ],
  handleValuesChange: (values) => {
    query.value = JSON.stringify(values, null, 2);
  },
  handleSubmit: (values) => {
    query.value = JSON.stringify(values, null, 2);
  }
});
</script>
