<template>
  <a-card class="form-workbench" variant="borderless">
    <div class="form-workbench__head">
      <div>
        <span class="form-workbench__eyebrow">ProForm Workbench</span>
        <h3>条件化方案生成表单</h3>
      </div>
      <a-tag color="processing">Vue 3.5 + TypeScript</a-tag>
    </div>

    <SearchForm>
      <template #action="{ api }">
        <a-form-item>
          <div class="form-workbench__actions">
            <a-space wrap>
              <a-button @click="api.resetForm()">重置</a-button>
              <a-button :loading="submitting" type="primary" @click="api.submitForm()">
                生成远程方案
              </a-button>
            </a-space>
          </div>
        </a-form-item>
      </template>
    </SearchForm>
  </a-card>
</template>

<script setup lang="ts">
import { h, ref } from 'vue';
import { cloneDeep, pick } from 'lodash-es';
import { useProForm } from '@owl/components';
import type { ApiComponentOptionsItem, FormSchema, UseProFormOptions } from '@owl/components';
import { fetchProFormInsightsApi, fetchProFormProductOptionsApi } from '@/api/examples';
import type {
  ProFormInsightPayload,
  ProFormInsightResult,
  ProFormProductOptionsParams
} from '@/api/examples';
import ScenarioSwitch from './scenario-switch.vue';

type ProFormValues = ProFormInsightPayload & Record<string, unknown>;

const emit = defineEmits<{
  'submit-result': [result: ProFormInsightResult];
  'submitting-change': [submitting: boolean];
  'values-change': [values: ProFormInsightPayload];
}>();

const submitting = ref(false);

function renderLabel(text: string, badge?: string) {
  return h('span', { class: 'pro-form-demo-label' }, [
    h('span', text),
    badge ? h('small', badge) : null
  ]);
}

function normalizeProductParams(params?: Record<string, unknown>): ProFormProductOptionsParams {
  return {
    bizLine: String(params?.bizLine || 'commerce'),
    scenario: String(params?.scenario || 'growth')
  };
}

function renderProductLabel(item: ApiComponentOptionsItem) {
  const stage = typeof item.stage === 'string' ? item.stage : '默认';

  return `${item.label} · ${stage}`;
}

const schema: UseProFormOptions<ProFormValues>['schema'] = [
  {
    colProps: { lg: 8, md: 12, xs: 24 },
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      optionType: 'button',
      options: [
        { label: '电商', value: 'commerce' },
        { label: '金融', value: 'finance' },
        { label: '供应链', value: 'supply' }
      ]
    },
    fieldName: 'bizLine',
    label: renderLabel('业务线', '自定义 label'),
    required: true
  },
  {
    colProps: { lg: 8, md: 12, xs: 24 },
    component: 'Select',
    componentProps: {
      options: [
        { label: '增长转化', value: 'growth' },
        { label: '风险控制', value: 'risk' },
        { label: '交付效率', value: 'delivery' }
      ]
    },
    fieldName: 'scenario',
    label: '业务场景',
    required: true
  },
  {
    colProps: { lg: 8, md: 12, xs: 24 },
    component: 'ApiSelect',
    componentProps: ({ values }) => ({
      api: (params?: Record<string, unknown>) =>
        fetchProFormProductOptionsApi(normalizeProductParams(params)),
      labelFn: renderProductLabel,
      params: normalizeProductParams(pick(values, ['bizLine', 'scenario'])),
      placeholder: '远程加载产品候选'
    }),
    dependencies: {
      trigger: ({ api }) => {
        api.setFieldValue('productId', undefined);
      },
      triggerFields: ['bizLine', 'scenario']
    },
    fieldName: 'productId',
    help: '切换业务线或场景时，这个下拉会重新请求不同候选。',
    label: renderLabel('产品候选', '远程'),
    renderComponentContent: () => ({
      suffixIcon: () => h('span', { class: 'pro-form-demo-slot' }, 'API')
    }),
    required: true
  },
  {
    colProps: { lg: 8, md: 12, xs: 24 },
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      optionType: 'button',
      options: [
        { label: '常规', value: 'normal' },
        { label: '加急', value: 'urgent' }
      ]
    },
    fieldName: 'urgency',
    label: '紧急程度'
  },
  {
    colProps: { lg: 8, md: 12, xs: 24 },
    component: 'Switch',
    fieldName: 'enableAdvance',
    help: ({ values }) =>
      values.enableAdvance ? '高级字段已展开。' : '关闭后会隐藏预算和负责人。',
    label: '高级配置'
  },
  {
    colProps: { lg: 8, md: 12, xs: 24 },
    component: 'InputNumber',
    dependencies: {
      componentProps: ({ values }) => ({
        addonAfter: '万',
        max: 100,
        min: 0,
        placeholder: values.urgency === 'urgent' ? '加急建议 >= 80' : '请输入预算',
        style: { width: '100%' }
      }),
      if: ({ values }) => Boolean(values.enableAdvance),
      required: ({ values }) => values.urgency === 'urgent',
      triggerFields: ['enableAdvance', 'urgency']
    },
    fieldName: 'budget',
    label: '预算'
  },
  {
    colProps: { lg: 8, md: 12, xs: 24 },
    component: 'Input',
    componentProps: ({ values }) => ({
      placeholder: values.urgency === 'urgent' ? '加急场景建议填写 owner' : '请输入负责人'
    }),
    dependencies: {
      required: ({ values }) => Boolean(values.enableAdvance),
      show: ({ values }) => Boolean(values.enableAdvance),
      triggerFields: ['enableAdvance']
    },
    fieldName: 'owner',
    label: '负责人'
  },
  {
    colProps: { xs: 24 },
    component: ScenarioSwitch,
    componentProps: ({ values }) => ({
      disabled: values.scenario === 'risk',
      options: [
        {
          description: '更快拿结果，适合小范围灰度。',
          label: '效率优先',
          value: 'speed'
        },
        {
          description: '兼顾收益和稳定性，默认推荐。',
          label: '均衡推进',
          value: 'balance'
        },
        {
          description: '更严格的准入和复盘节点。',
          label: '稳态控制',
          value: 'stable'
        }
      ]
    }),
    fieldName: 'strategyTone',
    help: ({ values }) =>
      values.scenario === 'risk' ? '风险场景下策略倾向被锁定，避免误操作。' : undefined,
    label: renderLabel('策略倾向', '自定义组件'),
    modelPropName: 'modelValue',
    renderComponentContent: () => ({
      action: () => h('span', { class: 'pro-form-demo-pill' }, 'slot: action'),
      note: () => h('span', '这里来自 schema.renderComponentContent 自定义插槽。')
    })
  }
] satisfies FormSchema[];

const [SearchForm] = useProForm<ProFormValues>({
  handleSubmit: async (values) => {
    submitting.value = true;
    emit('submitting-change', true);

    try {
      const result = await fetchProFormInsightsApi(values);

      emit('submit-result', result);
    } finally {
      submitting.value = false;
      emit('submitting-change', false);
    }
  },
  handleValuesChange: (values) => {
    emit('values-change', cloneDeep(values));
  },
  initialValues: {
    bizLine: 'commerce',
    budget: 30,
    enableAdvance: false,
    scenario: 'growth',
    strategyTone: 'balance',
    urgency: 'normal'
  },
  layout: 'vertical',
  rowProps: {
    gutter: [16, 2]
  },
  schema,
  showDefaultActions: false
});
</script>

<style scoped lang="less">
.form-workbench {
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.form-workbench__head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.form-workbench__eyebrow {
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.form-workbench h3 {
  margin: 8px 0 0;
  color: var(--app-text-primary);
  font-size: 22px;
}

.form-workbench__actions {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}

:deep(.pro-form-demo-label) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

:deep(.pro-form-demo-label small),
:deep(.pro-form-demo-pill),
:deep(.pro-form-demo-slot) {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  border-radius: var(--ant-border-radius-sm);
  color: var(--app-primary);
  font-size: 11px;
  line-height: 20px;
  background: rgba(var(--app-primary-rgb), 0.1);
}
</style>
