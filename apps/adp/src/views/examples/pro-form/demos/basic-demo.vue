<template>
  <div class="flex flex-col gap-4">
    <ProForm />
    <a-alert v-if="submitted" type="success" show-icon>
      <template #message>提交结果（rangeTime 已映射为 startTime / endTime）</template>
      <template #description>
        <pre class="m-0 text-[13px] leading-[1.7]">{{ submitted }}</pre>
      </template>
    </a-alert>
  </div>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { message } from 'antdv-next';
import { useProForm } from '@owl/components';

const submitted = ref('');

const [ProForm] = useProForm({
  layout: 'horizontal',
  labelWidth: 110,
  fieldMappingTime: [['rangeTime', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  schema: [
    {
      fieldName: 'name',
      label: '名称',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入名称', allowClear: true }
    },
    {
      fieldName: 'accountType',
      label: '账号类型',
      component: 'Select',
      defaultValue: 'personal',
      componentProps: {
        placeholder: '请选择账号类型',
        options: [
          { label: '个人', value: 'personal' },
          { label: '企业', value: 'company' }
        ]
      }
    },
    {
      // 字段联动：仅当账号类型为「企业」时显示且必填
      fieldName: 'companyName',
      label: '企业名称',
      component: 'Input',
      componentProps: { placeholder: '请输入企业名称' },
      dependencies: {
        triggerFields: ['accountType'],
        show: (values) => values.accountType === 'company',
        required: (values) => values.accountType === 'company'
      }
    },
    {
      fieldName: 'amount',
      // label 自定义渲染 + 依赖表单值：实时显示当前额度
      label: (values) =>
        h('span', [
          '额度',
          h(
            'span',
            { style: 'color:#999;margin-left:4px;font-size:12px' },
            `（当前 ${values.amount ?? 0}）`
          )
        ]),
      component: 'InputNumber',
      defaultValue: 1000,
      componentProps: { min: 0, step: 100 }
    },
    {
      fieldName: 'enabled',
      label: '是否启用',
      component: 'Switch',
      defaultValue: true
    },
    {
      fieldName: 'rangeTime',
      label: '有效期',
      component: 'RangePicker',
      rules: 'required'
    },
    {
      fieldName: 'remark',
      label: '备注',
      component: 'Textarea',
      componentProps: { rows: 3, placeholder: '可选' }
    }
  ],
  handleSubmit: (values) => {
    submitted.value = JSON.stringify(values, null, 2);
    message.success('提交成功');
  },
  handleReset: () => {
    submitted.value = '';
  }
});
</script>
