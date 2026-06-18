<template>
  <div class="flex flex-col gap-4">
    <a-alert
      type="info"
      show-icon
      message="演示：inline 行内布局、自定义按钮文案、值变化即触发查询"
    />
    <pro-form :form="formApi" layout="inline">
      <pro-input path="keyword" label="关键词" placeholder="名称/编号" allow-clear />
      <pro-select
        path="role"
        label="角色"
        placeholder="全部"
        :source="fetchRoles"
        allow-clear
        :style="{ width: '160px' }"
      />
      <pro-select
        path="status"
        label="状态"
        placeholder="全部"
        allow-clear
        :style="{ width: '140px' }"
      />
      <a-space>
        <a-button type="primary" html-type="submit">查询</a-button>
        <a-button html-type="reset">重置</a-button>
      </a-space>
    </pro-form>

    <a-card size="small" title="当前查询条件">
      <pre class="m-0 text-[13px] leading-[1.7]">{{ query }}</pre>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { createProForm, ProForm, ProInput, ProSelect } from '@owl/components';
import { fetchRoles } from '../mock-api';

const query = ref('{}');

const [, formApi] = createProForm({
  // 值变化即触发查询（搜索表单常用）
  onValuesChange: (formData) => {
    query.value = JSON.stringify(formData, null, 2);
  },
  onSubmit: (formData) => {
    query.value = JSON.stringify(formData, null, 2);
  },
  onReset: () => {
    query.value = '{}';
  }
});
</script>
