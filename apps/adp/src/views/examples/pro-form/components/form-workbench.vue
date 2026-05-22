<template>
  <div class="flex flex-col gap-4">
    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
      <template #title>
        <div class="flex flex-col gap-1">
          <span class="text-base font-bold text-app-text-primary">1. 字段矩阵和自定义渲染</span>
          <small class="text-xs font-normal text-app-text-secondary">
            内置字段、componentSlots、custom component、custom slot、defaultValue
          </small>
        </div>
      </template>

      <FieldMatrixForm>
        <template #slot-note="{ api, schema }">
          <div class="rounded-ant border border-dashed border-app-border bg-white/70 p-3">
            <div class="mb-2 flex items-center justify-between gap-3">
              <span class="text-sm font-semibold text-app-text-primary">schema.slot 示例</span>
              <a-tag color="purple">{{ schema.fieldName }}</a-tag>
            </div>
            <a-input
              :value="String(api.values.slotNote || '')"
              placeholder="这个字段由父级 template 接管渲染"
              @update:value="api.setFieldValue('slotNote', $event)"
            />
          </div>
        </template>
      </FieldMatrixForm>
    </a-card>

    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
      <template #title>
        <div class="flex flex-col gap-1">
          <span class="text-base font-bold text-app-text-primary">2. 远程选项组件</span>
          <small class="text-xs font-normal text-app-text-secondary">
            ApiSelect、ApiCascader、ApiTreeSelect、params、labelFn、autoSelect、shouldFetch
          </small>
        </div>
      </template>

      <RemoteOptionsForm />
    </a-card>

    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
      <template #title>
        <div class="flex flex-col gap-1">
          <span class="text-base font-bold text-app-text-primary">3. 动态依赖</span>
          <small class="text-xs font-normal text-app-text-secondary">
            if、show、hidden、disabled、required、rules、componentProps、trigger
          </small>
        </div>
      </template>

      <DynamicDependencyForm />
    </a-card>

    <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
      <template #title>
        <div class="flex flex-col gap-1">
          <span class="text-base font-bold text-app-text-primary">4. FormApi 控制台</span>
          <small class="text-xs font-normal text-app-text-secondary">
            setValues、setState、updateSchema、removeSchemaByFields、validateField、submitForm
          </small>
        </div>
      </template>

      <a-space class="mb-4" wrap>
        <a-button
          v-for="item in apiActions"
          :key="item.action"
          :type="item.primary ? 'primary' : 'default'"
          @click="handleApiAction(item.action)"
        >
          {{ item.label }}
        </a-button>
      </a-space>

      <ApiControlForm />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import type { ApiComponentOptionsItem, ProFormNamePath, UseProFormOptions } from '@owl/components';

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

interface ProfileValue {
  owner?: string;
}

interface ProFormExampleValues extends ProFormInsightPayload {
  accessKey?: string;
  apiArea?: string[];
  apiProduct?: string;
  apiTeam?: string;
  approvalCode?: string;
  autoKeyword?: string;
  categoryPath?: string[];
  dateRange?: unknown;
  deliveryTime?: unknown;
  dynamicSelect?: string;
  hiddenSwitch?: boolean;
  internalTraceId?: string;
  isPublished?: boolean;
  lockFieldSwitch?: boolean;
  operator?: string;
  profile?: ProfileValue;
  projectName?: string;
  radioConfirm?: boolean;
  removable?: string;
  showAdvancedByIf?: boolean;
  showAdvancedByShow?: boolean;
  slotNote?: string;
  startDate?: unknown;
  status?: string;
  strategyMode?: string;
  syncSource?: string;
  syncTarget?: string;
  treeNode?: string;
  [key: string]: unknown;
}

type ApiAction =
  | 'addSchema'
  | 'centerActions'
  | 'disable'
  | 'enable'
  | 'hideActions'
  | 'hideLabels'
  | 'leftActions'
  | 'removeSchema'
  | 'resetLabels'
  | 'rightActions'
  | 'reverseActions'
  | 'setValues'
  | 'showActions'
  | 'submit'
  | 'updateSchema'
  | 'validateOperator';

const emit = defineEmits<{
  'submit-result': [result: ProFormInsightResult];
  'submitting-change': [submitting: boolean];
  'values-change': [values: ProFormExampleValues];
}>();

const submitting = ref(false);
const actionButtonsReverse = ref(false);

const formGridClass = 'grid-cols-1 md:grid-cols-12 gap-y-0';
const formItemThirdClass = 'md:col-span-6 xl:col-span-4';
const formItemHalfClass = 'md:col-span-6';
const formItemFullClass = 'md:col-span-12';
const pillClass =
  'inline-flex h-5 items-center rounded-ant-sm bg-[rgba(var(--app-primary-rgb),0.1)] px-1.5 text-[11px] leading-5 text-app-primary';

const apiActions: Array<{ action: ApiAction; label: string; primary?: boolean }> = [
  { action: 'setValues', label: '批量设值' },
  { action: 'updateSchema', label: '更新状态选项' },
  { action: 'validateOperator', label: '校验操作人' },
  { action: 'submit', label: '编程提交', primary: true },
  { action: 'disable', label: '禁用表单' },
  { action: 'enable', label: '解除禁用' },
  { action: 'hideLabels', label: '隐藏标签' },
  { action: 'resetLabels', label: '恢复标签' },
  { action: 'leftActions', label: '按钮靠左' },
  { action: 'centerActions', label: '按钮居中' },
  { action: 'rightActions', label: '按钮靠右' },
  { action: 'reverseActions', label: '翻转按钮' },
  { action: 'hideActions', label: '隐藏按钮' },
  { action: 'showActions', label: '显示按钮' },
  { action: 'addSchema', label: '添加字段' },
  { action: 'removeSchema', label: '删除字段' }
];

function syncLatestValues(values: ProFormExampleValues) {
  emit('values-change', cloneDeep(values));
}

function renderLabel(text: string, tag?: string) {
  return h('span', { class: 'inline-flex items-center gap-1.5' }, [
    h('span', text),
    tag ? h('small', { class: pillClass }, tag) : null
  ]);
}

function createOption(label: string, value: string, children?: ApiComponentOptionsItem[]) {
  return {
    children,
    label,
    value
  } satisfies ApiComponentOptionsItem;
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
  const stage = typeof item.stage === 'string' ? item.stage : '默认阶段';

  return `${item.label} · ${stage}`;
}

async function waitForRemoteOptions() {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 220);
  });
}

async function fetchAreaOptions(params?: Record<string, unknown>) {
  await waitForRemoteOptions();
  const bizLine = String(params?.bizLine || 'commerce');

  return [
    createOption('华东', `${bizLine}-east`, [
      createOption('上海', `${bizLine}-shanghai`),
      createOption('杭州', `${bizLine}-hangzhou`)
    ]),
    createOption('华南', `${bizLine}-south`, [
      createOption('广州', `${bizLine}-guangzhou`),
      createOption('深圳', `${bizLine}-shenzhen`)
    ])
  ];
}

async function fetchTeamTreeOptions(params?: Record<string, unknown>) {
  await waitForRemoteOptions();
  const scenario = String(params?.scenario || 'growth');

  return [
    createOption('增长团队', `${scenario}-growth`, [
      createOption('投放小组', `${scenario}-ads`),
      createOption('会员小组', `${scenario}-member`)
    ]),
    createOption('平台团队', `${scenario}-platform`, [
      createOption('体验小组', `${scenario}-ux`),
      createOption('数据小组', `${scenario}-data`)
    ])
  ];
}

async function submitInsight(values: ProFormExampleValues, successText: string) {
  submitting.value = true;
  emit('submitting-change', true);

  try {
    const result = await fetchProFormInsightsApi(values);

    emit('submit-result', result);
    message.success(successText);
  } finally {
    submitting.value = false;
    emit('submitting-change', false);
  }
}

const fieldMatrixSchema: UseProFormOptions<ProFormExampleValues>['schema'] = [
  {
    componentProps: {
      placeholder: '请输入项目名称'
    },
    componentSlots: {
      prefix: () => h('span', { class: pillClass }, 'P')
    },
    fieldName: 'projectName',
    formItemClass: formItemThirdClass,
    label: renderLabel('Input', 'prefix'),
    required: true,
    type: 'Input'
  },
  {
    componentProps: {
      autocomplete: 'current-password',
      placeholder: '请输入访问密钥'
    },
    fieldName: 'accessKey',
    formItemClass: formItemThirdClass,
    label: 'InputPassword',
    type: 'InputPassword'
  },
  {
    componentProps: {
      max: 100,
      min: 0,
      placeholder: '0-100',
      style: { width: '100%' }
    },
    componentSlots: {
      suffix: () => h('span', { class: pillClass }, '万')
    },
    fieldName: 'budget',
    formItemClass: formItemThirdClass,
    label: 'InputNumber',
    type: 'InputNumber'
  },
  {
    componentProps: {
      options: [
        { label: '增长转化', value: 'growth' },
        { label: '风险控制', value: 'risk' },
        { label: '交付效率', value: 'delivery' }
      ],
      placeholder: '输入关键字'
    },
    fieldName: 'autoKeyword',
    formItemClass: formItemThirdClass,
    label: 'AutoComplete',
    type: 'AutoComplete'
  },
  {
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
    formItemClass: formItemThirdClass,
    label: 'RadioGroup',
    required: true,
    type: 'RadioGroup'
  },
  {
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
    formItemClass: formItemThirdClass,
    label: 'Select',
    required: true,
    type: 'Select'
  },
  {
    componentProps: {
      options: [
        { label: '站内消息', value: 'site' },
        { label: '短信', value: 'sms' },
        { label: '邮件', value: 'mail' }
      ]
    },
    fieldName: 'channels',
    formItemClass: formItemThirdClass,
    label: 'CheckboxGroup',
    type: 'CheckboxGroup'
  },
  {
    fieldName: 'isPublished',
    formItemClass: formItemThirdClass,
    label: 'Switch',
    type: 'Switch'
  },
  {
    componentProps: {
      children: '确认单选状态'
    },
    fieldName: 'radioConfirm',
    formItemClass: formItemThirdClass,
    label: 'Radio',
    modelPropName: 'checked',
    type: 'Radio'
  },
  {
    componentProps: {
      children: '勾选后提交'
    },
    fieldName: 'enableAdvance',
    formItemClass: formItemThirdClass,
    label: 'Checkbox',
    type: 'Checkbox'
  },
  {
    componentProps: {
      options: [
        createOption('运营域', 'operation', [
          createOption('会员', 'member'),
          createOption('履约', 'delivery')
        ]),
        createOption('风控域', 'risk', [
          createOption('准入', 'access'),
          createOption('巡检', 'audit')
        ])
      ]
    },
    fieldName: 'categoryPath',
    formItemClass: formItemThirdClass,
    label: 'Cascader',
    type: 'Cascader'
  },
  {
    componentProps: {
      allowClear: true,
      treeData: [
        createOption('组织', 'org', [
          createOption('产品组', 'product'),
          createOption('技术组', 'tech')
        ])
      ]
    },
    fieldName: 'treeNode',
    formItemClass: formItemThirdClass,
    label: 'TreeSelect',
    type: 'TreeSelect'
  },
  {
    fieldName: 'startDate',
    formItemClass: formItemThirdClass,
    label: 'DatePicker',
    type: 'DatePicker'
  },
  {
    fieldName: 'dateRange',
    formItemClass: formItemThirdClass,
    label: 'RangePicker',
    type: 'RangePicker'
  },
  {
    fieldName: 'deliveryTime',
    formItemClass: formItemThirdClass,
    label: 'TimePicker',
    type: 'TimePicker'
  },
  {
    fieldName: ['profile', 'owner'],
    formItemClass: formItemThirdClass,
    label: renderLabel('嵌套字段', 'namePath'),
    type: 'Input'
  },
  {
    component: ScenarioSwitch,
    componentProps: {
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
    },
    componentSlots: {
      note: ({ schema }) => h('span', { class: pillClass }, `${String(schema?.type)} component`)
    },
    fieldName: 'strategyMode',
    formItemClass: formItemFullClass,
    label: renderLabel('Custom Component', 'modelValue'),
    type: 'custom'
  },
  {
    fieldName: 'slotNote',
    formItemClass: formItemFullClass,
    label: renderLabel('Custom Slot', 'schema.slot'),
    slot: 'slot-note',
    type: 'custom'
  },
  {
    componentProps: {
      autoSize: { minRows: 3, maxRows: 5 },
      placeholder: 'TextArea 和 Textarea 均已注册，这里演示 TextArea。'
    },
    fieldName: 'remark',
    formItemClass: formItemFullClass,
    label: 'TextArea',
    type: 'TextArea'
  },
  {
    defaultValue: 'hidden-by-schema-default',
    fieldName: 'internalTraceId',
    hidden: true,
    label: 'Hidden',
    type: 'Input'
  }
] satisfies UseProFormOptions<ProFormExampleValues>['schema'];

const [FieldMatrixForm] = useProForm<ProFormExampleValues>({
  handleSubmit: (values) => submitInsight(values, '字段矩阵已提交，远程结果已生成。'),
  handleValuesChange: syncLatestValues,
  initialValues: {
    bizLine: 'commerce',
    budget: 30,
    channels: ['site'],
    enableAdvance: false,
    projectName: '增长实验计划',
    radioConfirm: true,
    scenario: 'growth',
    slotNote: '父级插槽渲染的内容',
    strategyMode: 'balance'
  },
  layout: 'vertical',
  schema: fieldMatrixSchema,
  submitButtonOptions: {
    text: '提交字段矩阵'
  },
  wrapperClass: formGridClass
});

const remoteOptionsSchema: UseProFormOptions<ProFormExampleValues>['schema'] = [
  {
    colProps: { lg: 8, md: 12, xs: 24 },
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
    label: '请求参数：业务线',
    type: 'RadioGroup'
  },
  {
    colProps: { lg: 8, md: 12, xs: 24 },
    componentProps: {
      options: [
        { label: '增长转化', value: 'growth' },
        { label: '风险控制', value: 'risk' },
        { label: '交付效率', value: 'delivery' }
      ]
    },
    fieldName: 'scenario',
    label: '请求参数：场景',
    type: 'Select'
  },
  {
    colProps: { lg: 8, md: 12, xs: 24 },
    componentProps: ({ values }) => ({
      api: async (params?: Record<string, unknown>) => {
        const products = await fetchProFormProductOptionsApi(normalizeProductParams(params));
        const options: ApiComponentOptionsItem[] = products.map((item) => ({ ...item }));

        return options;
      },
      autoSelect: 'first',
      labelFn: renderProductLabel,
      params: normalizeProductParams(pick(values, ['bizLine', 'scenario'])),
      placeholder: '打开或切换参数后加载',
      showSearch: true
    }),
    componentSlots: {
      notFoundContent: () => h('span', { class: 'text-xs text-app-text-secondary' }, '暂无候选')
    },
    dependencies: {
      trigger: ({ api }) => {
        api.setFieldValue('apiProduct', undefined);
      },
      triggerFields: ['bizLine', 'scenario']
    },
    fieldName: 'apiProduct',
    help: 'ApiSelect 使用真实 mock 接口，并用 labelFn 拼接阶段信息。',
    label: renderLabel('ApiSelect', 'remote'),
    required: true,
    type: 'ApiSelect'
  },
  {
    colProps: { lg: 12, xs: 24 },
    componentProps: ({ values }) => ({
      api: fetchAreaOptions,
      params: pick(values, ['bizLine']),
      placeholder: '业务线变化后重新拉取区域树'
    }),
    dependencies: {
      trigger: ({ api }) => {
        api.setFieldValue('apiArea', undefined);
      },
      triggerFields: ['bizLine']
    },
    fieldName: 'apiArea',
    label: renderLabel('ApiCascader', 'children'),
    type: 'ApiCascader'
  },
  {
    colProps: { lg: 12, xs: 24 },
    componentProps: ({ values }) => ({
      api: fetchTeamTreeOptions,
      params: pick(values, ['scenario']),
      placeholder: '选择远程团队',
      shouldFetch: (params: Record<string, unknown>) => Boolean(params.scenario),
      treeDefaultExpandAll: true
    }),
    dependencies: {
      triggerFields: ['scenario']
    },
    fieldName: 'apiTeam',
    label: renderLabel('ApiTreeSelect', 'shouldFetch'),
    type: 'ApiTreeSelect'
  }
] satisfies UseProFormOptions<ProFormExampleValues>['schema'];

const [RemoteOptionsForm] = useProForm<ProFormExampleValues>({
  handleSubmit: (values) => {
    syncLatestValues(values);
    message.success('远程选项表单提交成功。');
  },
  handleValuesChange: syncLatestValues,
  initialValues: {
    bizLine: 'commerce',
    scenario: 'growth'
  },
  layout: 'vertical',
  rowProps: {
    gutter: [16, 0]
  },
  schema: remoteOptionsSchema,
  submitButtonOptions: {
    text: '提交远程选项'
  }
});

const dynamicSchema: UseProFormOptions<ProFormExampleValues>['schema'] = [
  {
    fieldName: 'showAdvancedByIf',
    formItemClass: formItemThirdClass,
    label: 'if 挂载字段',
    type: 'Switch'
  },
  {
    fieldName: 'showAdvancedByShow',
    formItemClass: formItemThirdClass,
    label: 'show 显示字段',
    type: 'Switch'
  },
  {
    fieldName: 'hiddenSwitch',
    formItemClass: formItemThirdClass,
    label: 'hidden 显示字段',
    type: 'Switch'
  },
  {
    fieldName: 'lockFieldSwitch',
    formItemClass: formItemThirdClass,
    label: 'disabled 锁定字段',
    type: 'Switch'
  },
  {
    fieldName: 'enableAdvance',
    formItemClass: formItemThirdClass,
    label: 'required / rules',
    type: 'Switch'
  },
  {
    componentProps: {
      placeholder: '输入 risk 会改写下拉选项'
    },
    fieldName: 'syncSource',
    formItemClass: formItemThirdClass,
    label: 'trigger 源字段',
    type: 'Input'
  },
  {
    componentProps: {
      placeholder: 'if 为 false 时字段会卸载'
    },
    dependencies: {
      if: ({ values }) => Boolean(values.showAdvancedByIf),
      triggerFields: ['showAdvancedByIf']
    },
    fieldName: 'ifField',
    formItemClass: formItemHalfClass,
    label: 'dependencies.if',
    type: 'Input'
  },
  {
    componentProps: {
      placeholder: 'show 为 false 时字段不展示'
    },
    dependencies: {
      show: ({ values }) => Boolean(values.showAdvancedByShow),
      triggerFields: ['showAdvancedByShow']
    },
    fieldName: 'showField',
    formItemClass: formItemHalfClass,
    label: 'dependencies.show',
    type: 'Input'
  },
  {
    componentProps: {
      placeholder: 'hidden 使用 schema 上的动态函数'
    },
    fieldName: 'hiddenField',
    formItemClass: formItemHalfClass,
    hidden: ({ values }) => !values.hiddenSwitch,
    label: 'schema.hidden',
    type: 'Input'
  },
  {
    componentProps: {
      placeholder: '打开锁定开关后禁用'
    },
    dependencies: {
      disabled: ({ values }) => Boolean(values.lockFieldSwitch),
      triggerFields: ['lockFieldSwitch']
    },
    fieldName: 'disabledField',
    formItemClass: formItemHalfClass,
    label: 'dependencies.disabled',
    type: 'Input'
  },
  {
    componentProps: {
      placeholder: '开启 required / rules 后至少 4 个字符'
    },
    dependencies: {
      required: ({ values }) => Boolean(values.enableAdvance),
      rules: ({ values }) =>
        values.enableAdvance
          ? [
              { message: '审批码不能为空', required: true },
              { min: 4, message: '审批码至少 4 个字符' }
            ]
          : undefined,
      triggerFields: ['enableAdvance']
    },
    fieldName: 'approvalCode',
    formItemClass: formItemHalfClass,
    label: ({ values }) => (values.enableAdvance ? '审批码（动态必填）' : '审批码'),
    type: 'Input'
  },
  {
    componentProps: {
      options: [
        { label: '常规方案', value: 'normal' },
        { label: '加速方案', value: 'fast' }
      ]
    },
    dependencies: {
      componentProps: ({ values }) =>
        values.syncSource === 'risk'
          ? {
              options: [
                { label: '常规方案', value: 'normal' },
                { label: '加速方案', value: 'fast' },
                { label: '风险复核方案', value: 'risk-review' }
              ]
            }
          : {},
      triggerFields: ['syncSource']
    },
    fieldName: 'dynamicSelect',
    formItemClass: formItemHalfClass,
    label: 'dependencies.componentProps',
    type: 'Select'
  },
  {
    componentProps: {
      disabled: true,
      placeholder: '由 trigger 自动同步'
    },
    dependencies: {
      trigger: ({ api, values }) => {
        api.setFieldValue('syncTarget', values.syncSource ? `已同步：${values.syncSource}` : '');
      },
      triggerFields: ['syncSource']
    },
    fieldName: 'syncTarget',
    formItemClass: formItemHalfClass,
    help: 'syncSource 变化时，trigger 会写入当前字段。',
    label: 'dependencies.trigger',
    type: 'Input'
  }
] satisfies UseProFormOptions<ProFormExampleValues>['schema'];

const [DynamicDependencyForm] = useProForm<ProFormExampleValues>({
  handleSubmit: (values) => {
    syncLatestValues(values);
    message.success('动态依赖表单提交成功。');
  },
  handleValuesChange: syncLatestValues,
  initialValues: {
    hiddenSwitch: false,
    lockFieldSwitch: false,
    showAdvancedByIf: true,
    showAdvancedByShow: true,
    syncSource: 'growth'
  },
  layout: 'vertical',
  schema: dynamicSchema,
  submitButtonOptions: {
    text: '提交动态依赖'
  },
  wrapperClass: formGridClass
});

const apiSchema: UseProFormOptions<ProFormExampleValues>['schema'] = [
  {
    componentProps: {
      placeholder: '请输入操作人'
    },
    defaultValue: 'Antd Owl',
    fieldName: 'operator',
    formItemClass: formItemThirdClass,
    label: '操作人',
    required: true,
    type: 'Input'
  },
  {
    componentProps: {
      options: [
        { label: '草稿', value: 'draft' },
        { label: '运行中', value: 'running' }
      ]
    },
    defaultValue: 'draft',
    fieldName: 'status',
    formItemClass: formItemThirdClass,
    label: '状态',
    type: 'Select'
  },
  {
    componentProps: {
      placeholder: '点击“删除字段”会移除我'
    },
    fieldName: 'removable',
    formItemClass: formItemThirdClass,
    label: '可删除字段',
    type: 'Input'
  }
] satisfies UseProFormOptions<ProFormExampleValues>['schema'];

const [ApiControlForm, apiFormApi] = useProForm<ProFormExampleValues>({
  actionPosition: 'right',
  handleSubmit: (values) => {
    syncLatestValues(values);
    message.success('FormApi 表单提交成功。');
  },
  handleValuesChange: syncLatestValues,
  layout: 'vertical',
  resetButtonOptions: {
    text: '重置 API 表单'
  },
  schema: apiSchema,
  submitButtonOptions: {
    text: '提交 API 表单'
  },
  wrapperClass: formGridClass
});

function handleApiAction(action: ApiAction) {
  switch (action) {
    case 'setValues':
      apiFormApi.setValues({
        operator: 'Codex',
        status: 'running'
      });
      message.success('已通过 setValues 批量写入。');
      break;
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
    case 'validateOperator':
      void apiFormApi.validateField('operator').then(() => {
        message.success('操作人字段校验通过。');
      });
      break;
    case 'submit':
      void apiFormApi.submitForm();
      break;
    case 'disable':
      apiFormApi.setState({ commonConfig: { disabled: true } });
      break;
    case 'enable':
      apiFormApi.setState({ commonConfig: { disabled: false } });
      break;
    case 'hideLabels':
      apiFormApi.setState({ commonConfig: { hideLabel: true } });
      break;
    case 'resetLabels':
      apiFormApi.setState({ commonConfig: { hideLabel: false, labelWidth: undefined } });
      break;
    case 'leftActions':
      apiFormApi.setState({ actionPosition: 'left' });
      break;
    case 'centerActions':
      apiFormApi.setState({ actionPosition: 'center' });
      break;
    case 'rightActions':
      apiFormApi.setState({ actionPosition: 'right' });
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
            componentProps: {
              placeholder: '由 setState 动态追加'
            },
            fieldName: `extraField${Date.now()}` as ProFormNamePath,
            formItemClass: formItemThirdClass,
            label: '新增字段',
            type: 'Input'
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
