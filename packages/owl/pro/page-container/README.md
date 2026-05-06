# PageContainer

用于统一页面顶部结构，支持单标题模式和整顶栏 `Tabs` 模式。

## 特性

- 单内容模式支持 `title`、`description`、`header`、`title`、`extra` 插槽
- 多内容模式由 `tabs` 驱动整个顶部
- 每个 tab 支持独立 `title`、`component`、`props`
- tab 内容优先级：`#tab-[key]` 插槽 > `tab.component` > 空状态
- tab 标题支持 `#tab-label-[key]` 动态插槽
- 支持 `v-model:activeKey`

## 基础用法

```vue
<script setup lang="ts">
import { PageContainer } from '@owl/components';
</script>

<template>
  <PageContainer title="用户管理" description="统一管理后台账号与权限协作。">
    <template #extra>
      <a-button type="primary">新增用户</a-button>
    </template>

    <a-card variant="borderless">这里是页面内容</a-card>
  </PageContainer>
</template>
```

## Tabs 用法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { PageContainer } from '@owl/components';
import type { PageContainerTabItem } from '@owl/components';

const activeKey = ref('users');

const tabs: PageContainerTabItem[] = [
  { key: 'users', title: '用户列表', component: UsersPane },
  { key: 'roles', title: '角色权限', component: RolesPane }
];
</script>

<template>
  <PageContainer v-model:activeKey="activeKey" :tabs="tabs">
    <template #extra>
      <a-button>刷新</a-button>
    </template>

    <template #tab-label-roles>
      角色权限
      <a-tag color="processing">Beta</a-tag>
    </template>

    <template #tab-users>
      <UsersPane />
    </template>
  </PageContainer>
</template>
```

## Props

| 属性          | 类型                     | 默认值      | 说明                                   |
| ------------- | ------------------------ | ----------- | -------------------------------------- |
| `title`       | `string`                 | `''`        | 单内容模式标题                         |
| `description` | `string`                 | `''`        | 单内容模式描述文案                     |
| `tabs`        | `PageContainerTabItem[]` | `[]`        | 顶部 tabs 配置                         |
| `activeKey`   | `string`                 | `undefined` | 当前激活 tab，支持 `v-model:activeKey` |

## TabItem

| 属性        | 类型                      | 说明                    |
| ----------- | ------------------------- | ----------------------- |
| `key`       | `string`                  | tab 唯一标识            |
| `title`     | `string`                  | tab 默认标题            |
| `component` | `Component`               | tab 内容组件            |
| `props`     | `Record<string, unknown>` | 传给 `component` 的参数 |

## Slots

| 插槽              | 说明                         |
| ----------------- | ---------------------------- |
| `default`         | 单内容模式的主体内容         |
| `header`          | 单内容模式左侧头部整体自定义 |
| `title`           | 单内容模式标题区域自定义     |
| `extra`           | 顶部右侧操作区               |
| `tab-[key]`       | 指定 tab 内容插槽            |
| `tab-label-[key]` | 指定 tab 标题插槽            |
