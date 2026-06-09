<template>
  <div class="flex flex-col gap-4">
    <a-alert
      type="info"
      show-icon
      message="演示：栅格布局（每行 3 列）+ 展开/收起，收起时只显示 1 行"
    />
    <a-card variant="borderless" class="rounded-ant-lg">
      <ProForm />
    </a-card>
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
  // 开启栅格 + 折叠
  grid: true,
  colProps: { span: 8 },
  showCollapseButton: true,
  collapsedRows: 1,
  defaultCollapsed: true,
  labelWidth: 80,
  submitButtonOptions: { content: '查询' },
  schema: [
    {
      fieldName: 'keyword',
      label: '关键词',
      component: 'Input',
      componentProps: { placeholder: '名称 / 编号', allowClear: true }
    },
    {
      fieldName: 'role',
      label: '角色',
      component: 'ApiSelect',
      componentProps: { placeholder: '全部', allowClear: true, request: { api: fetchRoles } }
    },
    {
      fieldName: 'status',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '全部',
        allowClear: true,
        options: [
          { label: '启用', value: 1 },
          { label: '停用', value: 0 }
        ]
      }
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      // 单独占满整行
      colProps: { span: 16 }
    },
    {
      fieldName: 'amountMin',
      label: '最小额度',
      component: 'InputNumber',
      componentProps: { min: 0 }
    },
    {
      fieldName: 'amountMax',
      label: '最大额度',
      component: 'InputNumber',
      componentProps: { min: 0 }
    }
  ],
  fieldMappingTime: [['createTime', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  handleSubmit: (values) => {
    query.value = JSON.stringify(values, null, 2);
  },
  handleReset: () => {
    query.value = '{}';
  }
});
</script>
