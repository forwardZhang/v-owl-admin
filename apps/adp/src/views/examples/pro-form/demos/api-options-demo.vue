<template>
  <div class="flex flex-col gap-4">
    <a-alert
      type="info"
      show-icon
      message="演示：request 配置（api / 参数 / 字段别名）、城市随省份变化重新请求"
    />
    <ProForm />
  </div>
</template>

<script setup lang="ts">
import { message } from 'antdv-next';
import { useProForm } from '@owl/components';
import { fetchCities, fetchDeptTree, fetchProvinces, fetchRoles } from '../mock-api';

const [ProForm, formApi] = useProForm({
  labelWidth: 90,
  schema: [
    {
      fieldName: 'province',
      label: '省份',
      component: 'ApiSelect',
      rules: 'required',
      componentProps: {
        placeholder: '请选择省份',
        allowClear: true,
        // 所有请求相关配置统一放在 request 里：api + 取数路径 + 字段别名
        request: {
          api: fetchProvinces,
          resultField: 'data.list',
          labelField: 'name',
          valueField: 'code'
        }
      }
    },
    {
      fieldName: 'city',
      label: '城市',
      component: 'ApiSelect',
      rules: 'required',
      componentProps: {
        placeholder: '请先选择省份',
        allowClear: true,
        request: {
          api: fetchCities,
          resultField: 'data.list',
          labelField: 'name',
          valueField: 'code',
          immediate: false
        }
      },
      dependencies: {
        triggerFields: ['province'],
        // 依赖字段请求：只需注入 request.params，会与上面的 request 深合并后触发重新请求
        componentProps: (values) => ({
          request: { params: { province: values.province } }
        }),
        disabled: (values) => !values.province
      }
    },
    {
      fieldName: 'role',
      label: '角色',
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择角色',
        mode: 'multiple',
        // 后端直接返回 label/value 数组，无需 resultField / 字段别名
        request: { api: fetchRoles }
      }
    },
    {
      fieldName: 'dept',
      label: '部门',
      component: 'ApiTreeSelect',
      componentProps: {
        placeholder: '请选择部门',
        allowClear: true,
        treeDefaultExpandAll: true,
        // 树形字段别名：title/key -> label/value
        request: {
          api: fetchDeptTree,
          resultField: 'data',
          labelField: 'title',
          valueField: 'key'
        }
      }
    }
  ],
  // 省份变化时清空已选城市，避免脏数据
  handleValuesChange: (_values, changed) => {
    if (changed.includes('province')) {
      formApi.setFieldValue('city', undefined);
    }
  },
  handleSubmit: (values) => {
    message.success(`提交：${JSON.stringify(values)}`);
  }
});
</script>
