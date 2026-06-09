<template>
  <div class="flex flex-col gap-4">
    <pro-form :form="formApi" label-width="110">
      <pro-input path="name" label="名称" required :field-props="{ allowClear: true }" />

      <pro-select
        path="accountType"
        label="账号类型"
        :field-props="{ options: accountTypeOptions }"
      />

      <!-- 联动：直接使用 createProForm 返回的 formData -->
      <pro-input
        v-if="formData.accountType === 'company'"
        path="companyName"
        label="企业名称"
        required
      />

      <!-- 动态 label：依赖 formData 实时显示当前额度 -->
      <pro-number
        path="amount"
        :label="`额度（当前 ${formData.amount ?? 0}）`"
        :field-props="{ min: 0, step: 100 }"
      />

      <pro-switch path="enabled" label="是否启用" />

      <pro-range-picker path="rangeTime" label="有效期" required />

      <pro-textarea path="remark" label="备注" placeholder="可选" :field-props="{ rows: 3 }" />

      <a-space>
        <a-button html-type="reset">重置</a-button>
        <a-button type="primary" html-type="submit" :loading="formApi.submitting.value"
          >提交</a-button
        >
      </a-space>
    </pro-form>

    <a-alert v-if="submitted" type="success" show-icon>
      <template #message>提交结果（rangeTime 已映射为 startTime / endTime）</template>
      <template #description>
        <pre class="m-0 text-[13px] leading-[1.7]">{{ submitted }}</pre>
      </template>
    </a-alert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'antdv-next';
import {
  createProForm,
  ProForm,
  ProInput,
  ProNumber,
  ProRangePicker,
  ProSelect,
  ProSwitch,
  ProTextarea
} from '@owl/components';

const submitted = ref('');

const accountTypeOptions = [
  { label: '个人', value: 'personal' },
  { label: '企业', value: 'company' }
];

const [formData, formApi] = createProForm({
  initialValues: { accountType: 'personal', amount: 1000, enabled: true },
  fieldMappingTime: [['rangeTime', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  onSubmit: (formData) => {
    submitted.value = JSON.stringify(formData, null, 2);
    message.success('提交成功');
  },
  onReset: () => {
    submitted.value = '';
  }
});
</script>
