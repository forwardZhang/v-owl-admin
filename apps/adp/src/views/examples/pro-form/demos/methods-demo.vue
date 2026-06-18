<template>
  <div class="flex flex-col gap-4">
    <a-space wrap>
      <a-button @click="onFill">setFieldsValue 填充</a-button>
      <a-button @click="onGet">getFieldsValue 取值</a-button>
      <a-button @click="onValidate">validate 校验</a-button>
      <a-button @click="resetFields()">resetFields 重置</a-button>
      <a-button @click="disabled = !disabled">切换禁用</a-button>
    </a-space>
    <pro-form :form="formApi" label-width="90" :disabled="disabled">
      <pro-input path="name" label="姓名" required placeholder="请输入姓名" />
      <pro-number path="age" label="年龄" :min="0" :max="150" />
      <pro-radio
        path="gender"
        label="性别"
        :options="[
          { label: '男', value: 'male' },
          { label: '女', value: 'female' }
        ]"
      />
    </pro-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'antdv-next';
import { createProForm, ProForm, ProInput, ProNumber, ProRadio } from '@owl/components';

const disabled = ref(false);

interface MethodsFormData {
  name?: string;
  age?: number;
  gender?: string;
}

const [, formApi] = createProForm<MethodsFormData>({
  initialValues: { gender: 'male' }
});

// 方法均为闭包，可安全解构
const { setFieldsValue, getFieldsValue, validate, resetFields } = formApi;

function onFill() {
  setFieldsValue({ name: '张三', age: 28, gender: 'female' });
  message.success('已通过 setFieldsValue 填充');
}

function onGet() {
  message.info(JSON.stringify(getFieldsValue()));
}

async function onValidate() {
  try {
    await validate();
    message.success('校验通过');
  } catch {
    message.error('校验未通过');
  }
}
</script>
