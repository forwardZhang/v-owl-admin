<template>
  <div class="flex flex-col gap-4">
    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
      <template #title>
        <div class="flex flex-col gap-1">
          <span class="text-base font-bold text-app-text-primary">Basic / Custom</span>
          <small class="text-xs font-normal text-app-text-secondary">
            基础组件、远程选项、schema 插槽、自定义内容
          </small>
        </div>
      </template>

      <BasicForm>
        <template #test-component="{ schema }">
          <div class="flex min-h-8 items-center gap-2 text-app-text-secondary">
            <strong class="text-app-primary">template slot</strong>
            <span>{{ schema.fieldName }} 由 schema.slot 显式声明后渲染。</span>
          </div>
        </template>

        <template #action="{ api }">
          <a-form-item>
            <div class="flex w-full justify-end">
              <a-space wrap>
                <a-button @click="api.resetForm()">重置</a-button>
                <a-button :loading="submitting" type="primary" @click="api.submitForm()">
                  提交基础表单
                </a-button>
              </a-space>
            </div>
          </a-form-item>
        </template>
      </BasicForm>
    </a-card>

    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
      <template #title>
        <div class="flex flex-col gap-1">
          <span class="text-base font-bold text-app-text-primary">Dynamic</span>
          <small class="text-xs font-normal text-app-text-secondary">
            if / show / disabled / required / componentProps / trigger
          </small>
        </div>
      </template>

      <DynamicForm />
    </a-card>

    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
      <template #title>
        <div class="flex flex-col gap-1">
          <span class="text-base font-bold text-app-text-primary">Form API</span>
          <small class="text-xs font-normal text-app-text-secondary">
            setState、updateSchema、removeSchemaByFields、按钮状态
          </small>
        </div>
      </template>

      <a-space class="mb-4" wrap>
        <a-button
          v-for="item in apiActions"
          :key="item.action"
          @click="handleApiAction(item.action)"
        >
          {{ item.label }}
        </a-button>
      </a-space>

      <ApiForm />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import type { ApiComponentOptionsItem, UseProFormOptions } from '@owl/components';

import { h, ref } from 'vue';
import { cloneDeep, pick } from 'lodash-es';
import { message } from 'antdv-next';
import { useProForm } from '@owl/components';
import { fetchProFormInsightsApi, fetchProFormProductOptionsApi } from '@/api/examples';
import type {
  ProFormInsightPayload,
  ProFormInsightResult,
  ProFormProductOptionsParams
} from '@/api/examples';
import ScenarioSwitch from './scenario-switch.vue';

type ProFormValues = ProFormInsightPayload & Record<string, unknown>;
type ApiAction =
  | 'addSchema'
  | 'disable'
  | 'enable'
  | 'hideActions'
  | 'labelWidth'
  | 'removeSchema'
  | 'resetLabelWidth'
  | 'reverseActions'
  | 'showActions'
  | 'updateSchema';

const emit = defineEmits<{
  'submit-result': [result: ProFormInsightResult];
  'submitting-change': [submitting: boolean];
  'values-change': [values: ProFormInsightPayload];
}>();

const submitting = ref(false);
const actionButtonsReverse = ref(false);

const apiActions: Array<{ action: ApiAction; label: string }> = [
  { action: 'updateSchema', label: '更新下拉选项' },
  { action: 'labelWidth', label: 'labelWidth 160' },
  { action: 'resetLabelWidth', label: '还原 labelWidth' },
  { action: 'disable', label: '禁用表单' },
  { action: 'enable', label: '解除禁用' },
  { action: 'reverseActions', label: '翻转按钮' },
  { action: 'hideActions', label: '隐藏按钮' },
  { action: 'showActions', label: '显示按钮' },
  { action: 'addSchema', label: '添加字段' },
  { action: 'removeSchema', label: '删除字段' }
];

const slotPillClass =
  'inline-flex h-5 items-center rounded-ant-sm bg-[rgba(var(--app-primary-rgb),0.1)] px-1.5 text-[11px] leading-5 text-app-primary';
const remoteSlotPillClass =
  'inline-flex h-5 items-center rounded-ant-sm bg-[rgba(82,196,26,0.12)] px-1.5 text-[11px] leading-5 text-[#389e0d]';
const formGridClass = 'grid-cols-1 md:grid-cols-12 gap-y-0';
const formItemThirdClass = 'md:col-span-6 xl:col-span-4';
const formItemQuarterClass = 'md:col-span-6 xl:col-span-3';
const formItemFullClass = 'md:col-span-12';

function renderLabel(text: string, badge?: string) {
  return h('span', { class: 'inline-flex items-center gap-1.5' }, [
    h('span', text),
    badge
      ? h(
          'small',
          {
            class: slotPillClass
          },
          badge
        )
      : null
  ]);
}

function normalizeProductParams(
  params?: Record<string, unknown>
): ProFormProductOptionsParams & Record<string, unknown> {
  return {
    bizLine: String(params?.bizLine || 'commerce'),
    scenario: String(params?.scenario || 'growth')
  };
}

function renderProductLabel(item: ApiComponentOptionsItem) {
  const stage = typeof item.stage === 'string' ? item.stage : '默认';

  return `${item.label} · ${stage}`;
}

function syncLatestValues(values: ProFormValues) {
  emit('values-change', cloneDeep(values));
}

const basicSchema: UseProFormOptions<ProFormValues>['schema'] = [
  {
    formItemClass: formItemThirdClass,
    type: 'Input',
    componentProps: {
      placeholder: '请输入项目名称'
    },
    componentSlots: {
      prefix: () => h('span', { class: slotPillClass }, 'P')
    },
    fieldName: 'projectName',
    label: renderLabel('项目名称', 'required'),
    required: true
  },
  {
    formItemClass: formItemThirdClass,
    type: 'InputPassword',
    componentProps: {
      autocomplete: 'current-password',
      placeholder: '请输入访问密钥'
    },
    fieldName: 'accessKey',
    label: '访问密钥'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'RadioGroup',
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
    label: '业务线',
    required: true
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Select',
    componentProps: {
      allowClear: true,
      options: [
        { label: '增长转化', value: 'growth' },
        { label: '风险控制', value: 'risk' },
        { label: '交付效率', value: 'delivery' }
      ],
      showSearch: true
    },
    fieldName: 'scenario',
    label: '业务场景',
    required: true
  },
  {
    formItemClass: formItemThirdClass,
    type: 'ApiSelect',
    componentProps: ({ values }) => ({
      api: async (params?: Record<string, unknown>) => {
        const options = await fetchProFormProductOptionsApi(normalizeProductParams(params));

        return options.map((item) => ({ ...item }));
      },
      labelFn: renderProductLabel,
      params: normalizeProductParams(pick(values, ['bizLine', 'scenario'])),
      placeholder: '远程加载产品候选'
    }),
    componentSlots: {
      suffixIcon: () => h('span', { class: remoteSlotPillClass }, 'API')
    },
    dependencies: {
      trigger: ({ api }) => {
        api.setFieldValue('productId', undefined);
      },
      triggerFields: ['bizLine', 'scenario']
    },
    fieldName: 'productId',
    help: '切换业务线或场景时，下拉会重新请求不同候选。',
    label: renderLabel('产品候选', 'ApiSelect'),
    required: true
  },
  {
    formItemClass: formItemThirdClass,
    type: 'InputNumber',
    componentProps: {
      max: 100,
      min: 0,
      placeholder: '请输入预算',
      style: { width: '100%' }
    },
    componentSlots: {
      suffix: () => h('span', { class: slotPillClass }, '万')
    },
    fieldName: 'budget',
    label: '预算'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'CheckboxGroup',
    componentProps: {
      options: [
        { label: '站内消息', value: 'site' },
        { label: '短信', value: 'sms' },
        { label: '邮件', value: 'mail' }
      ]
    },
    fieldName: 'channels',
    label: '触达渠道'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Switch',
    fieldName: 'enableAdvance',
    help: ({ values }) => (values.enableAdvance ? '高级配置已开启。' : '关闭后仍可提交基础信息。'),
    label: '高级配置'
  },
  {
    formItemClass: formItemFullClass,
    type: 'custom',
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
    componentSlots: {
      note: ({ schema }) =>
        h('span', { class: slotPillClass }, `${String(schema?.fieldName)} componentSlots`)
    },
    fieldName: 'strategyTone',
    help: ({ values }) => (values.scenario === 'risk' ? '风险场景下策略倾向被锁定。' : undefined),
    label: renderLabel('策略倾向', 'custom')
  },
  {
    formItemClass: formItemFullClass,
    fieldName: 'templateSlot',
    label: '模板内容',
    slot: 'test-component',
    type: 'custom'
  },
  {
    formItemClass: formItemFullClass,
    type: 'TextArea',
    componentProps: {
      autoSize: { minRows: 3, maxRows: 5 },
      placeholder: '补充业务背景、约束或风险点'
    },
    fieldName: 'remark',
    label: '备注'
  }
] satisfies UseProFormOptions<ProFormValues>['schema'];

const [BasicForm] = useProForm<ProFormValues>({
  handleSubmit: async (values) => {
    submitting.value = true;
    emit('submitting-change', true);

    try {
      const result = await fetchProFormInsightsApi(values);

      emit('submit-result', result);
      message.success('基础表单已提交，远程结果已生成。');
    } finally {
      submitting.value = false;
      emit('submitting-change', false);
    }
  },
  handleValuesChange: syncLatestValues,
  initialValues: {
    bizLine: 'commerce',
    budget: 30,
    channels: ['site'],
    enableAdvance: false,
    projectName: '增长实验计划',
    scenario: 'growth',
    strategyTone: 'balance'
  },
  layout: 'vertical',
  schema: basicSchema,
  showDefaultActions: false,
  wrapperClass: formGridClass
});

const dynamicSchema: UseProFormOptions<ProFormValues>['schema'] = [
  {
    formItemClass: formItemQuarterClass,
    type: 'Switch',
    fieldName: 'field1Switch',
    help: '通过 if 销毁字段。',
    label: '显示字段1'
  },
  {
    formItemClass: formItemQuarterClass,
    type: 'Switch',
    fieldName: 'field2Switch',
    help: '通过 show 控制显示。',
    label: '显示字段2'
  },
  {
    formItemClass: formItemQuarterClass,
    type: 'Switch',
    fieldName: 'field3Switch',
    label: '禁用字段3'
  },
  {
    formItemClass: formItemQuarterClass,
    type: 'Switch',
    fieldName: 'field4Switch',
    label: '字段4必填'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Input',
    dependencies: {
      if: ({ values }) => Boolean(values.field1Switch),
      triggerFields: ['field1Switch']
    },
    fieldName: 'field1',
    label: '字段1'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Input',
    dependencies: {
      show: ({ values }) => Boolean(values.field2Switch),
      triggerFields: ['field2Switch']
    },
    fieldName: 'field2',
    help: '输入 123 后，动态配置下拉会追加选项。',
    label: '字段2'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Input',
    dependencies: {
      disabled: ({ values }) => Boolean(values.field3Switch),
      triggerFields: ['field3Switch']
    },
    fieldName: 'field3',
    label: '字段3'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Input',
    dependencies: {
      required: ({ values }) => Boolean(values.field4Switch),
      triggerFields: ['field4Switch']
    },
    fieldName: 'field4',
    label: '字段4'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Select',
    componentProps: {
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' }
      ]
    },
    dependencies: {
      componentProps: ({ values }) =>
        values.field2 === '123'
          ? {
              options: [
                { label: '选项1', value: '1' },
                { label: '选项2', value: '2' },
                { label: '选项3', value: '3' }
              ]
            }
          : {},
      triggerFields: ['field2']
    },
    fieldName: 'dynamicOptions',
    label: '动态配置'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Input',
    dependencies: {
      trigger: ({ api, values }) => {
        api.setFieldValue('syncTarget', values.syncSource);
      },
      triggerFields: ['syncSource']
    },
    fieldName: 'syncSource',
    label: '同步源'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Input',
    componentProps: {
      disabled: true
    },
    fieldName: 'syncTarget',
    label: '同步目标'
  }
] satisfies UseProFormOptions<ProFormValues>['schema'];

const [DynamicForm] = useProForm<ProFormValues>({
  handleSubmit: (values) => {
    syncLatestValues(values);
    message.success('动态联动表单提交成功。');
  },
  handleValuesChange: syncLatestValues,
  initialValues: {
    field1Switch: true,
    field2Switch: true,
    field3Switch: false,
    field4Switch: false
  },
  layout: 'vertical',
  schema: dynamicSchema,
  submitButtonOptions: {
    text: '提交动态表单'
  },
  wrapperClass: formGridClass
});

const apiSchema: UseProFormOptions<ProFormValues>['schema'] = [
  {
    formItemClass: formItemThirdClass,
    type: 'Input',
    componentProps: {
      placeholder: '请输入操作人'
    },
    fieldName: 'operator',
    label: '操作人',
    required: true
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Select',
    componentProps: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '运行中', value: 'running' }
      ]
    },
    fieldName: 'status',
    label: '状态'
  },
  {
    formItemClass: formItemThirdClass,
    type: 'Input',
    componentProps: {
      placeholder: '这个字段会被 removeSchemaByFields 删除'
    },
    fieldName: 'removable',
    label: '可删除字段'
  }
] satisfies UseProFormOptions<ProFormValues>['schema'];

const [ApiForm, apiFormApi] = useProForm<ProFormValues>({
  actionPosition: 'right',
  handleSubmit: (values) => {
    syncLatestValues(values);
    message.success('API 操作表单提交成功。');
  },
  handleValuesChange: syncLatestValues,
  layout: 'vertical',
  schema: apiSchema,
  submitButtonOptions: {
    text: '提交 API 表单'
  },
  wrapperClass: formGridClass
});

function handleApiAction(action: ApiAction) {
  switch (action) {
    case 'updateSchema':
      apiFormApi.updateSchema([
        {
          componentProps: {
            options: [
              { label: '草稿', value: 'draft' },
              { label: '运行中', value: 'running' },
              { label: '已发布', value: 'published' }
            ]
          },
          fieldName: 'status'
        }
      ]);
      message.success('status 下拉选项已更新。');
      break;
    case 'labelWidth':
      apiFormApi.setState({ commonConfig: { labelWidth: 160 } });
      break;
    case 'resetLabelWidth':
      apiFormApi.setState({ commonConfig: { labelWidth: undefined } });
      break;
    case 'disable':
      apiFormApi.setState({ commonConfig: { disabled: true } });
      break;
    case 'enable':
      apiFormApi.setState({ commonConfig: { disabled: false } });
      break;
    case 'reverseActions':
      actionButtonsReverse.value = !actionButtonsReverse.value;
      apiFormApi.setState({ actionButtonsReverse: actionButtonsReverse.value });
      break;
    case 'hideActions':
      apiFormApi.setState({ showDefaultActions: false });
      break;
    case 'showActions':
      apiFormApi.setState({ showDefaultActions: true });
      break;
    case 'addSchema':
      apiFormApi.setState((prev) => ({
        schema: [
          ...(prev.schema ?? []),
          {
            formItemClass: formItemThirdClass,
            type: 'Input',
            componentProps: {
              placeholder: '动态添加字段'
            },
            fieldName: `extraField${Date.now()}`,
            label: '新增字段'
          }
        ]
      }));
      break;
    case 'removeSchema':
      apiFormApi.removeSchemaByFields(['removable']);
      break;
  }
}
</script>
