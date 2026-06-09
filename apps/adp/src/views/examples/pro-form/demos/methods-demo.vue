<template>
  <div class="flex flex-col gap-4">
    <a-space wrap>
      <a-button @click="onFill">setValues 填充</a-button>
      <a-button @click="onGet">getValues 取值</a-button>
      <a-button @click="onValidate">validate 校验</a-button>
      <a-button @click="onUpdateSchema">updateSchema 改 label</a-button>
      <a-button @click="onToggleDisabled">setState 切换禁用</a-button>
    </a-space>
    <ProForm />
  </div>
</template>

<script setup lang="ts">
import { message } from 'antdv-next';
import { useProForm } from '@owl/components';

const [ProForm, formApi] = useProForm({
  labelWidth: 90,
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'name',
      label: '姓名',
      component: 'Input',
      rules: 'required',
      componentProps: { placeholder: '请输入姓名' }
    },
    {
      fieldName: 'age',
      label: '年龄',
      component: 'InputNumber',
      componentProps: { min: 0, max: 150 }
    },
    {
      fieldName: 'gender',
      label: '性别',
      component: 'RadioGroup',
      defaultValue: 'male',
      componentProps: {
        options: [
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ]
      }
    }
  ]
});

function onFill() {
  formApi.setValues({ name: '张三', age: 28, gender: 'female' });
  message.success('已通过 setValues 填充');
}

async function onGet() {
  const values = await formApi.getValues();
  message.info(JSON.stringify(values));
}

async function onValidate() {
  try {
    await formApi.validate();
    message.success('校验通过');
  } catch {
    message.error('校验未通过');
  }
}

function onUpdateSchema() {
  formApi.updateSchema([
    { fieldName: 'name', label: '真实姓名', componentProps: { placeholder: '改过 label 了' } }
  ]);
  message.success('已通过 updateSchema 修改「姓名」label');
}

function onToggleDisabled() {
  formApi.setState((prev) => ({ disabled: !prev.disabled }));
  message.info('已通过 setState 切换整表禁用');
}
</script>
