# ProForm

基于 `antdv-next` `Form` 的轻量增强封装，提供统一的表单控制器与更顺手的重置、提交、校验调用方式。

## 特性

- 基于 `createProForm` 管理表单实例与表单值
- 保持 `antdv-next` `Form` 的原生 `props / events / slots` 使用习惯
- 支持 `submit`、`validate`、`restoreFieldsValue`、`setFieldValue` 等控制方法
- 支持 `onFinish`、`onFinishFailed`、`onReset` 钩子订阅
- 内置 `ProField` 类型映射，首批支持 `input`、`password`、`textarea`、`checkbox`、`checkbox-group`、`radio`、`radio-group`、`select`
- 选项类字段支持 `options / request / dependencies`，可在组件内部自动拉取远程选项

## 基础用法

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { ProForm, createProForm } from '@owl/components';
import type { FormProps } from 'antdv-next';

interface UserFormModel {
  nickname: string;
  status: string;
}

const form = createProForm<UserFormModel>({
  initialValues: {
    nickname: '',
    status: 'active'
  },
  onFinish(values) {
    console.log('submit', values);
  }
});

const rules: FormProps['rules'] = {
  nickname: [
    {
      message: '请输入昵称',
      required: true
    }
  ]
};
</script>

<template>
  <ProForm :form="form" layout="vertical" :rules="rules">
    <a-form-item label="昵称" name="nickname">
      <a-input v-model:value="form.values.nickname" placeholder="请输入昵称" />
    </a-form-item>

    <a-form-item label="状态" name="status">
      <a-select
        v-model:value="form.values.status"
        :options="[
          { label: '启用', value: 'active' },
          { label: '停用', value: 'disabled' }
        ]"
      />
    </a-form-item>

    <a-flex gap="small">
      <a-button type="primary" html-type="submit">提交</a-button>
      <a-button @click="form.restoreFieldsValue()">重置</a-button>
    </a-flex>
  </ProForm>
</template>
```

## ProField

```vue
<script setup lang="ts">
import { ProField, ProForm, createProForm } from '@owl/components';
import type { FormProps } from 'antdv-next';

const form = createProForm({
  initialValues: {
    agree: true,
    nickname: '',
    roles: ['admin'],
    status: 'enabled'
  }
});

const rules: FormProps['rules'] = {
  nickname: [{ message: '请输入昵称', required: true }]
};
</script>

<template>
  <ProForm :form="form" layout="vertical" :rules="rules">
    <ProField name="nickname" label="昵称" type="input" />

    <ProField
      name="status"
      label="状态"
      type="select"
      :field-props="{
        options: [
          { label: '启用', value: 'enabled' },
          { label: '停用', value: 'disabled' }
        ]
      }"
    />

    <ProField
      name="roles"
      label="角色"
      type="checkbox-group"
      :options="[
        { label: '管理员', value: 'admin' },
        { label: '编辑', value: 'editor' }
      ]"
    />

    <ProField name="agree" type="checkbox"> 阅读并同意协议 </ProField>
  </ProForm>
</template>
```

### 远程选项

`select`、`checkbox`、`radio` 这类带选项的字段支持直接在组件内部请求远程数据，并通过 `dependencies` 监听依赖字段变化后自动刷新：

```vue
<script setup lang="ts">
import { ProField } from '@owl/components';

async function queryRoleOptions({ dependencyValues }) {
  const departmentId = dependencyValues.departmentId;

  return [
    { label: `部门 ${departmentId} - 管理员`, value: 'admin' },
    { label: `部门 ${departmentId} - 编辑`, value: 'editor' }
  ];
}
</script>

<template>
  <ProField name="departmentId" label="部门" type="select" />

  <ProField
    name="role"
    label="角色"
    type="radio-group"
    :dependencies="['departmentId']"
    :request="queryRoleOptions"
  />
</template>
```

### 自定义 Label

`ProFormItem` 和 `ProField` 现在都支持单独的 `label` slot：

```vue
<ProField name="nickname" type="input">
  <template #label>
    <span style="display: inline-flex; gap: 6px; align-items: center">
      昵称
      <a-tag color="processing">推荐</a-tag>
    </span>
  </template>
</ProField>
```

## API

### `createProForm(options)`

| 参数             | 类型                  | 说明         |
| ---------------- | --------------------- | ------------ |
| `initialValues`  | `Partial<TValues>`    | 初始值快照   |
| `onFinish`       | `(values) => void`    | 提交成功回调 |
| `onFinishFailed` | `(errorInfo) => void` | 提交失败回调 |
| `onReset`        | `() => void`          | 重置回调     |

### `CreateProFormReturn`

| 属性 / 方法                          | 说明                   |
| ------------------------------------ | ---------------------- |
| `values`                             | 当前表单值对象         |
| `formRef`                            | `FormInstance` 引用    |
| `submit()`                           | 提交表单               |
| `validate()`                         | 校验整个表单           |
| `validateFields(nameList?)`          | 校验指定字段           |
| `setFieldValue(name, value)`         | 设置单字段值           |
| `setFieldsValue(values)`             | 批量设置字段值         |
| `restoreFieldValue(name)`            | 恢复单字段到初始值     |
| `restoreFieldsValue(nameList?)`      | 恢复指定字段或整个表单 |
| `clearValidate(nameList?)`           | 清除校验状态           |
| `setInitialValues(values, options?)` | 更新初始值快照         |
| `onFinish(handler)`                  | 订阅提交成功           |
| `onFinishFailed(handler)`            | 订阅提交失败           |
| `onReset(handler)`                   | 订阅重置事件           |
