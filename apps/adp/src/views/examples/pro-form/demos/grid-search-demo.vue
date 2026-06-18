<template>
  <div class="flex flex-col gap-4">
    <a-alert
      type="info"
      show-icon
      message="演示：栅格配置直接放在 pro-form 上（grid / cols / collapsible），字段自动包列，收起时只显示 1 行"
    />
    <a-card variant="borderless" class="rounded-ant-lg">
      <pro-form
        :form="formApi"
        grid
        :cols="3"
        :gutter="16"
        collapsible
        label-width="80"
        submit-text="查询"
      >
        <pro-input path="keyword" label="关键词" placeholder="名称 / 编号" allow-clear />
        <pro-select path="role" label="角色" placeholder="全部" :source="fetchRoles" allow-clear />
        <pro-select
          path="status"
          label="状态"
          placeholder="全部"
          allow-clear
          :options="[
            { label: '启用', value: 1 },
            { label: '停用', value: 0 }
          ]"
        />
        <!-- 个性化：单独占 2 列（span 为 24 栅格制） -->
        <pro-range-picker path="createTime" label="创建时间" :span="16" />
        <pro-number path="amountMin" label="最小额度" :min="0" />
        <pro-number path="amountMax" label="最大额度" :min="0" />
      </pro-form>
    </a-card>

    <a-card size="small" title="当前查询条件">
      <pre class="m-0 text-[13px] leading-[1.7]">{{ query }}</pre>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  createProForm,
  ProForm,
  ProInput,
  ProNumber,
  ProRangePicker,
  ProSelect
} from '@owl/components';
import { fetchRoles } from '../mock-api';

const query = ref('{}');

const [, formApi] = createProForm({
  fieldMappingTime: [['createTime', ['startTime', 'endTime'], 'YYYY-MM-DD']],
  onSubmit: (formData) => {
    query.value = JSON.stringify(formData, null, 2);
  },
  onReset: () => {
    query.value = '{}';
  }
});
</script>
