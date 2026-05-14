<template>
  <ProPage v-model:active-key="activeKey" :tabs="tabs">
    <template #extra>
      <a-space wrap>
        <a-tag color="processing">ProForm</a-tag>
        <a-tag :color="submitting ? 'orange' : 'green'">
          {{ submitting ? '请求中' : '已就绪' }}
        </a-tag>
      </a-space>
    </template>

    <template #tab-form>
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :xl="15">
          <FormWorkbench
            @submit-result="handleSubmitResult"
            @submitting-change="submitting = $event"
            @values-change="latestValues = $event"
          />
        </a-col>
        <a-col :xs="24" :xl="9">
          <FormResultPanel :loading="submitting" :result="latestResult" />
        </a-col>
      </a-row>
    </template>

    <template #tab-result>
      <FormResultPanel :loading="submitting" :result="latestResult" />
    </template>

    <template #tab-capability>
      <FormCapabilityPanel />
    </template>
  </ProPage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ProPage } from '@owl/components';
import type { ProPageTabItem } from '@owl/components';
import type { ProFormInsightPayload, ProFormInsightResult } from '@/api/examples';
import FormCapabilityPanel from './components/form-capability-panel.vue';
import FormResultPanel from './components/form-result-panel.vue';
import FormWorkbench from './components/form-workbench.vue';

const activeKey = ref('form');
const submitting = ref(false);
const latestResult = ref<ProFormInsightResult>();
const latestValues = ref<ProFormInsightPayload>({});

const tabs: ProPageTabItem[] = [
  {
    key: 'form',
    title: '表单工作台'
  },
  {
    key: 'result',
    title: '远程结果'
  },
  {
    key: 'capability',
    title: '能力说明'
  }
];

function handleSubmitResult(result: ProFormInsightResult) {
  latestResult.value = result;
  activeKey.value = 'result';
}
</script>
