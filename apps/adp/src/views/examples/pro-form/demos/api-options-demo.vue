<template>
  <div class="flex flex-col gap-4">
    <a-alert
      type="info"
      show-icon
      message="演示：data 配置（数组 / Promise / 函数 + 字段别名）、城市随省份变化重新请求"
    />
    <pro-form :form="formApi" label-width="90">
      <pro-select
        path="province"
        label="省份"
        required
        :field-props="{ allowClear: true }"
        :source="{
          data: fetchProvinces,
          resultField: 'data.list',
          labelField: 'name',
          valueField: 'code'
        }"
      />

      <!-- 依赖请求：data 用函数，内部读 formData.province，变化即重新请求 -->
      <pro-select
        path="city"
        label="城市"
        required
        :disabled="!formData.province"
        :field-props="{ allowClear: true }"
        :source="{
          data: () => (formData.province ? fetchCities(formData.province) : []),
          resultField: 'data.list',
          labelField: 'name',
          valueField: 'code'
        }"
      />

      <!-- 直接传函数（返回 Promise<数组>），后端已是 label/value -->
      <pro-select
        path="role"
        label="角色"
        :field-props="{ mode: 'multiple' }"
        :source="fetchRoles"
      />

      <pro-tree-select
        path="dept"
        label="部门"
        :field-props="{ allowClear: true, treeDefaultExpandAll: true }"
        :source="{ data: fetchDeptTree, resultField: 'data' }"
      />

      <a-space>
        <a-button type="primary" html-type="submit">提交</a-button>
      </a-space>
    </pro-form>
  </div>
</template>

<script setup lang="ts">
import { message } from 'antdv-next';
import { createProForm, ProForm, ProSelect, ProTreeSelect } from '@owl/components';
import { fetchCities, fetchDeptTree, fetchProvinces, fetchRoles } from '../mock-api';

const [formData, formApi] = createProForm({
  // 省份变化时清空已选城市，避免脏数据
  onValuesChange: (_formData, changed) => {
    if (changed.includes('province')) {
      formApi.setFieldValue('city', undefined);
    }
  },
  onSubmit: (formData) => {
    message.success(`提交：${JSON.stringify(formData)}`);
  }
});
</script>
