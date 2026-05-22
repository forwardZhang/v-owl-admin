<template>
  <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
    <span class="text-xs font-bold uppercase text-app-primary">Capability Map</span>
    <h3 class="mb-[18px] mt-2 text-[22px] text-app-text-primary">ProForm 当前支持能力一览</h3>

    <div class="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="item in capabilities"
        :key="item.title"
        class="min-h-[156px] rounded-ant-lg border border-app-border bg-white/80 p-4"
      >
        <a-tag :color="item.color">{{ item.group }}</a-tag>
        <strong class="mt-3 block text-base text-app-text-primary">{{ item.title }}</strong>
        <p class="mt-2.5 leading-[1.8] text-app-text-secondary">{{ item.description }}</p>
      </div>
    </div>
  </a-card>
</template>

<script setup lang="ts">
const capabilities = [
  {
    color: 'blue',
    description:
      'Input、InputPassword、InputNumber、AutoComplete、Select、Radio、RadioGroup、Checkbox、CheckboxGroup、Switch、TextArea、DatePicker、RangePicker、TimePicker、Cascader、TreeSelect。',
    group: 'Field Matrix',
    title: '内置组件'
  },
  {
    color: 'cyan',
    description:
      'ApiSelect、ApiCascader、ApiTreeSelect 支持 api、params、labelFn、autoSelect、shouldFetch、childrenField、optionsPropName。',
    group: 'Remote Options',
    title: '远程数据源'
  },
  {
    color: 'purple',
    description:
      'componentSlots 用于透传字段组件插槽；type=custom + component 接入自定义组件；type=custom + slot 交给父级 template 渲染。',
    group: 'Custom Render',
    title: '自定义渲染'
  },
  {
    color: 'geekblue',
    description:
      'fieldName 支持字符串、数字、数组路径；defaultValue 会和 initialValues 合并，重置时也会恢复。',
    group: 'Value Model',
    title: '值路径和默认值'
  },
  {
    color: 'orange',
    description:
      'dependencies 覆盖 if、show、disabled、required、rules、componentProps、trigger，triggerFields 明确声明联动来源。',
    group: 'Dynamic',
    title: '动态联动'
  },
  {
    color: 'green',
    description:
      'wrapperClass 适合 Tailwind grid；rowProps + colProps 适合 Ant Row/Col；commonConfig 可统一配置 disabled、hideLabel、labelWidth、formItemProps。',
    group: 'Layout',
    title: '布局和通用配置'
  },
  {
    color: 'volcano',
    description:
      '默认按钮支持 showDefaultActions、actionPosition、actionButtonsReverse、submitButtonOptions、resetButtonOptions，也可以用 action slot 完全接管。',
    group: 'Actions',
    title: '操作区'
  },
  {
    color: 'gold',
    description:
      'FormApi 支持 setValues、setFieldValue、setState、updateSchema、removeSchemaByFields、validate、validateField、submitForm、resetForm。',
    group: 'FormApi',
    title: '编程式控制'
  }
];
</script>
