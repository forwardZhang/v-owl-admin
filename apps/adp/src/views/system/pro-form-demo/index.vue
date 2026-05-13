<template>
  <PageContainer v-model:active-key="activeKey" :tabs="tabs">
    <template #extra>
      <a-space wrap>
        <a-tag color="processing">ProForm</a-tag>
        <a-button type="primary" :loading="form.loading.value" @click="handleSubmit">
          提交表单
        </a-button>
        <a-button ghost type="primary" @click="handlePatchValues">模拟接口回填</a-button>
        <a-button @click="handleRestore">恢复初始值</a-button>
      </a-space>
    </template>

    <template #tab-label-playground>
      表单示例
      <a-tag color="success">PageContainer</a-tag>
    </template>

    <template #tab-playground>
      <div class="pro-form-demo">
        <a-card class="pro-form-demo__hero" variant="borderless">
          <div>
            <span class="pro-form-demo__eyebrow">System / ProForm</span>
            <h1>ProForm 综合示例</h1>
            <p>
              这一页把常用字段、远程选项、依赖联动、校验策略和表单控制器能力都摆在一起，既能拿来联调，也适合当团队内的
              `ProForm` 使用参考。
            </p>
          </div>
        </a-card>

        <a-row :gutter="[20, 20]">
          <a-col :xs="24" :xl="16">
            <ProForm :form="formInstance" layout="vertical" :rules="rules">
              <a-card class="pro-form-demo__card" variant="borderless">
                <div class="pro-form-demo__section-head">
                  <div>
                    <span class="pro-form-demo__section-tag">Basics</span>
                    <h3>基础输入</h3>
                    <p>覆盖最常见的文本类表单项，方便校验 placeholder、rules 和回填行为。</p>
                  </div>
                  <a-tag color="processing">Input / Password / Textarea</a-tag>
                </div>

                <a-row :gutter="[16, 0]">
                  <a-col :xs="24" :md="12">
                    <ProField
                      name="nickname"
                      label="昵称"
                      type="input"
                      :field-props="{ allowClear: true, maxlength: 20, showCount: true }"
                      :form-item-props="{ extra: '支持普通文本输入、计数和基础必填校验。' }"
                    />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <ProField
                      name="username"
                      label="登录账号"
                      type="input"
                      :field-props="{ allowClear: true, maxlength: 30 }"
                    />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <ProField
                      name="password"
                      label="登录密码"
                      type="password"
                      :field-props="{ autocomplete: 'new-password', maxlength: 20 }"
                    />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <ProField
                      name="email"
                      label="联系邮箱"
                      type="input"
                      :field-props="{ allowClear: true }"
                    />
                  </a-col>

                  <a-col :xs="24">
                    <ProField
                      name="bio"
                      label="个人简介"
                      type="textarea"
                      :field-props="{ rows: 4, maxlength: 160, showCount: true }"
                      :form-item-props="{ extra: '适合验证多行输入、字符计数和较长文本回填。' }"
                    />
                  </a-col>
                </a-row>
              </a-card>

              <a-card class="pro-form-demo__card" variant="borderless">
                <div class="pro-form-demo__section-head">
                  <div>
                    <span class="pro-form-demo__section-tag is-warm">Choices</span>
                    <h3>静态选项</h3>
                    <p>
                      演示 `select`、`radio-group`、`checkbox-group` 和单个 `checkbox` 的常规姿势。
                    </p>
                  </div>
                  <a-tag color="gold">Static Options</a-tag>
                </div>

                <a-row :gutter="[16, 0]">
                  <a-col :xs="24" :md="12">
                    <ProField
                      name="status"
                      label="账号状态"
                      type="select"
                      :field-props="{ options: statusOptions }"
                    />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <ProField
                      name="channel"
                      label="注册渠道"
                      type="radio-group"
                      :options="channelOptions"
                      :form-item-props="{ extra: 'Radio 适合少量互斥选项。' }"
                    />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <ProField
                      name="tags"
                      label="用户标签"
                      type="checkbox-group"
                      :options="tagOptions"
                    />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <ProField
                      name="notifyTypes"
                      label="通知方式"
                      type="checkbox-group"
                      :field-props="{ options: notifyOptions }"
                      :form-item-props="{ extra: '这里顺便验证 fieldProps.options 的透传。' }"
                    />
                  </a-col>

                  <a-col :xs="24">
                    <ProField
                      name="agree"
                      type="checkbox"
                      :form-item-props="{
                        extra: '单个 checkbox 常用于协议确认、风险提示等场景。'
                      }"
                    >
                      我已阅读并同意示例页中的联调约定
                    </ProField>
                  </a-col>
                </a-row>
              </a-card>

              <a-card class="pro-form-demo__card" variant="borderless">
                <div class="pro-form-demo__section-head">
                  <div>
                    <span class="pro-form-demo__section-tag is-cool">Remote</span>
                    <h3>远程请求与依赖联动</h3>
                    <p>
                      这里直接演示 `request + dependencies`
                      的组合能力。角色列表会跟随部门变化，负责人列表则来自项目内现成 mock API。
                    </p>
                  </div>
                  <a-tag color="purple">Async Options</a-tag>
                </div>

                <a-row :gutter="[16, 0]">
                  <a-col :xs="24" :md="12">
                    <ProField
                      name="department"
                      label="所属部门"
                      type="select"
                      :options="departmentOptions"
                      :form-item-props="{ extra: '切换部门后，下方角色会自动重新请求。' }"
                    />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <ProField
                      name="roleCode"
                      label="角色权限"
                      type="select"
                      :dependencies="['department']"
                      :request="requestRoleOptions"
                    />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <ProField
                      name="ownerId"
                      label="负责人"
                      type="select"
                      :request="requestUserOptions"
                      :field-props="{ allowClear: true }"
                    />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    <ProField
                      name="reviewerIds"
                      label="协作人"
                      type="select"
                      :request="requestUserOptions"
                      :field-props="{
                        allowClear: true,
                        mode: 'multiple',
                        maxTagCount: 'responsive'
                      }"
                      :form-item-props="{ extra: '同一份远程数据源，也可以直接喂给多选 Select。' }"
                    />
                  </a-col>
                </a-row>
              </a-card>

              <a-card class="pro-form-demo__card" variant="borderless">
                <div class="pro-form-demo__section-head">
                  <div>
                    <span class="pro-form-demo__section-tag">Actions</span>
                    <h3>校验与控制器</h3>
                    <p>下面这些按钮主要用于验证 `createProForm` 的控制能力是否顺手。</p>
                  </div>
                  <a-tag color="success">Controller API</a-tag>
                </div>

                <div class="pro-form-demo__actions">
                  <a-space wrap>
                    <a-button type="primary" html-type="submit" :loading="form.loading.value">
                      Form 内提交
                    </a-button>
                    <a-button @click="handleValidate">仅校验</a-button>
                    <a-button @click="handleReset">resetFields</a-button>
                    <a-button @click="handleRewriteInitialValues">覆盖初始快照</a-button>
                    <a-button @click="handleClearRole">清空角色字段</a-button>
                  </a-space>
                </div>
              </a-card>
            </ProForm>
          </a-col>

          <a-col :xs="24" :xl="8">
            <div class="pro-form-demo__side">
              <a-card class="pro-form-demo__card" variant="borderless">
                <div class="pro-form-demo__section-head">
                  <div>
                    <span class="pro-form-demo__section-tag is-warm">State</span>
                    <h3>当前表单值</h3>
                    <p>值变化实时可见，调试绑定和回填时很省心。</p>
                  </div>
                  <a-tag color="success">Reactive</a-tag>
                </div>

                <pre class="pro-form-demo__json">{{ valuesPreview }}</pre>
              </a-card>

              <a-card class="pro-form-demo__card" variant="borderless">
                <div class="pro-form-demo__section-head">
                  <div>
                    <span class="pro-form-demo__section-tag is-cool">Guide</span>
                    <h3>示例说明</h3>
                  </div>
                </div>

                <div class="pro-form-demo__tips">
                  <div v-for="item in controllerTips" :key="item.title" class="pro-form-demo__tip">
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.description }}</p>
                  </div>
                </div>
              </a-card>
            </div>
          </a-col>
        </a-row>
      </div>
    </template>
  </PageContainer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { cloneDeep, filter, map } from 'lodash-es';
import { message } from 'antdv-next';
import { PageContainer, ProField, ProForm, createProForm } from '@owl/components';
import type {
  CreateProFormReturn,
  PageContainerTabItem,
  ProFieldOption,
  ProFieldRequest
} from '@owl/components';
import type { FormProps } from 'antdv-next';
import { fetchSystemRolesApi, fetchSystemUsersApi } from '@/api/system';
import type { SystemRoleRecord, SystemUserRecord } from '@/types/system';

interface ProFormDemoModel extends Record<string, unknown> {
  agree: boolean;
  bio: string;
  channel: 'web' | 'app' | 'partner';
  department: 'platform' | 'operation' | 'analytics' | 'risk';
  email: string;
  nickname: string;
  notifyTypes: string[];
  ownerId: string | undefined;
  password: string;
  reviewerIds: string[];
  roleCode: string | undefined;
  status: 'enabled' | 'disabled';
  tags: string[];
  username: string;
}

const statusOptions: ProFieldOption[] = [
  {
    label: '启用',
    value: 'enabled'
  },
  {
    label: '停用',
    value: 'disabled'
  }
];

const channelOptions: ProFieldOption[] = [
  {
    label: '官网注册',
    value: 'web'
  },
  {
    label: 'App 注册',
    value: 'app'
  },
  {
    label: '渠道导入',
    value: 'partner'
  }
];

const tagOptions: ProFieldOption[] = [
  {
    label: '高活跃',
    value: 'active'
  },
  {
    label: '高价值',
    value: 'vip'
  },
  {
    label: '待回访',
    value: 'follow_up'
  },
  {
    label: '风险观察',
    value: 'risk_watch'
  }
];

const notifyOptions: ProFieldOption[] = [
  {
    label: '站内信',
    value: 'site'
  },
  {
    label: '短信',
    value: 'sms'
  },
  {
    label: '邮件',
    value: 'email'
  }
];

const departmentOptions: ProFieldOption[] = [
  {
    label: '平台技术中心',
    value: 'platform'
  },
  {
    label: '商品运营部',
    value: 'operation'
  },
  {
    label: '数据分析部',
    value: 'analytics'
  },
  {
    label: '风控中心',
    value: 'risk'
  }
];

const departmentRoleMap: Record<ProFormDemoModel['department'], string[]> = {
  analytics: ['data_analyst'],
  operation: ['goods_operator'],
  platform: ['super_admin', 'goods_operator'],
  risk: ['risk_auditor']
};

const controllerTips = [
  {
    title: '静态 + 远程选项并存',
    description:
      '基础字段直接使用 options，远程字段通过 request 拉取，能更直观地比较这两种接入方式。'
  },
  {
    title: 'dependencies 自动刷新',
    description:
      '角色字段依赖部门值，切换部门后会自动重新请求。这个机制很适合做级联选项和业务联动。'
  },
  {
    title: '控制器适合页面级按钮',
    description:
      'submit、restoreFieldsValue、setInitialValues 这些方法很适合把操作按钮放在表单外层时复用。'
  }
];

const activeKey = ref('playground');

const tabs: PageContainerTabItem[] = [
  {
    key: 'playground',
    title: '表单示例'
  }
];

const form = createProForm<ProFormDemoModel>({
  initialValues: {
    agree: true,
    bio: '这里可以顺手验证 textarea、回填和校验提示的配合效果。',
    channel: 'web',
    department: 'platform',
    email: 'owl-admin@example.com',
    nickname: '猫头鹰同学',
    notifyTypes: ['site', 'email'],
    ownerId: undefined,
    password: '',
    reviewerIds: [],
    roleCode: undefined,
    status: 'enabled',
    tags: ['active'],
    username: 'owl.admin'
  },
  async onFinish(values) {
    form.setLoading(true);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 600);
      });
      message.success(`提交成功，当前账号：${values.username}`);
    } finally {
      form.setLoading(false);
    }
  },
  onFinishFailed(errorInfo) {
    const errorCount = errorInfo.errorFields?.length ?? 0;
    message.warning(`校验未通过，还有 ${errorCount} 个字段需要检查`);
  },
  onReset() {
    message.info('表单已经恢复到初始快照。');
  }
});

const formInstance = form as unknown as CreateProFormReturn;

const rules: FormProps['rules'] = {
  agree: [
    {
      message: '请先确认联调约定',
      required: true,
      type: 'boolean',
      validator: (_rule, value: boolean) =>
        value ? Promise.resolve() : Promise.reject(new Error('请先确认联调约定'))
    }
  ],
  bio: [
    {
      message: '请输入至少 10 个字符的简介',
      min: 10,
      required: true
    }
  ],
  channel: [
    {
      message: '请选择注册渠道',
      required: true
    }
  ],
  department: [
    {
      message: '请选择所属部门',
      required: true
    }
  ],
  email: [
    {
      message: '请输入联系邮箱',
      required: true
    },
    {
      message: '邮箱格式不正确',
      type: 'email'
    }
  ],
  nickname: [
    {
      message: '请输入昵称',
      required: true
    }
  ],
  notifyTypes: [
    {
      message: '至少选择一种通知方式',
      required: true,
      type: 'array'
    }
  ],
  ownerId: [
    {
      message: '请选择负责人',
      required: true
    }
  ],
  password: [
    {
      message: '请输入至少 6 位密码',
      min: 6,
      required: true
    }
  ],
  reviewerIds: [
    {
      message: '请至少选择一位协作人',
      required: true,
      type: 'array'
    }
  ],
  roleCode: [
    {
      message: '请选择角色权限',
      required: true
    }
  ],
  status: [
    {
      message: '请选择账号状态',
      required: true
    }
  ],
  tags: [
    {
      message: '至少选择一个用户标签',
      required: true,
      type: 'array'
    }
  ],
  username: [
    {
      message: '请输入登录账号',
      required: true
    },
    {
      max: 30,
      message: '登录账号长度不能超过 30 位'
    }
  ]
};

const valuesPreview = computed(() => JSON.stringify(form.values, null, 2));

const requestUserOptions: ProFieldRequest = async () => {
  const users = await fetchSystemUsersApi();

  return map(users, (item: SystemUserRecord) => ({
    label: `${item.nickname} / ${item.username}`,
    title: item.department,
    value: item.id
  })) as ProFieldOption[];
};

const requestRoleOptions: ProFieldRequest = async ({ dependencyValues }) => {
  const roles = await fetchSystemRolesApi();
  const department = dependencyValues.department as ProFormDemoModel['department'] | undefined;

  if (!department) {
    return [];
  }

  const allowCodes = departmentRoleMap[department] ?? [];

  return map(
    filter(roles, (item: SystemRoleRecord) => allowCodes.includes(item.code)),
    (item: SystemRoleRecord) => ({
      label: `${item.name} (${item.dataScope})`,
      title: item.description,
      value: item.code
    })
  ) as ProFieldOption[];
};

async function handleValidate() {
  try {
    await form.validate();
    message.success('表单校验通过，可以放心提交。');
  } catch {
    message.warning('还有字段没填完整，先别急着收工。');
  }
}

function handleSubmit() {
  form.submit();
}

function handleRestore() {
  form.restoreFieldsValue();
}

function handleReset() {
  form.resetFields();
}

function handlePatchValues() {
  form.setFieldsValue({
    bio: '这是一份通过 setFieldsValue 模拟的接口回填内容，顺便把几个字段一起更新掉。',
    channel: 'partner',
    department: 'analytics',
    email: 'patched-demo@example.com',
    nickname: '回填用户 Aster',
    notifyTypes: ['site', 'sms'],
    ownerId: 'user_3',
    reviewerIds: ['user_1', 'user_2'],
    roleCode: 'data_analyst',
    status: 'disabled',
    tags: ['vip', 'follow_up'],
    username: 'patched.aster'
  });

  message.success('已完成一次模拟回填。');
}

function handleRewriteInitialValues() {
  const nextInitialValues = cloneDeep(form.values);
  form.setInitialValues(nextInitialValues, { updateFields: true });
  message.success('当前表单值已经写入新的初始快照。');
}

function handleClearRole() {
  form.setFieldValue('roleCode', undefined);
  message.info('角色字段已清空，方便重新测试联动逻辑。');
}
</script>

<style scoped lang="less">
.pro-form-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pro-form-demo :deep(.ant-card-body) {
  padding: 24px;
}

.pro-form-demo :deep(.ant-form-item) {
  margin-bottom: 18px;
}

.pro-form-demo__hero,
.pro-form-demo__card {
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.pro-form-demo__hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background:
    radial-gradient(circle at top left, rgba(16, 185, 129, 0.18) 0%, transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 249, 255, 0.96) 100%);
}

.pro-form-demo__eyebrow,
.pro-form-demo__section-tag {
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.pro-form-demo__eyebrow {
  color: #047857;
  background: rgba(16, 185, 129, 0.12);
}

.pro-form-demo__section-tag {
  color: #0369a1;
  background: rgba(14, 165, 233, 0.12);
}

.pro-form-demo__section-tag.is-warm {
  color: #b45309;
  background: rgba(245, 158, 11, 0.14);
}

.pro-form-demo__section-tag.is-cool {
  color: #4338ca;
  background: rgba(99, 102, 241, 0.14);
}

.pro-form-demo__hero h1 {
  margin: 14px 0 10px;
  color: var(--app-text-primary);
  font-size: 30px;
}

.pro-form-demo__hero p,
.pro-form-demo__section-head p {
  margin: 0;
  color: var(--app-text-secondary);
  line-height: 1.8;
}

.pro-form-demo__hero p {
  max-width: 760px;
}

.pro-form-demo__section-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

.pro-form-demo__section-head h3 {
  margin: 12px 0 8px;
  color: var(--app-text-primary);
  font-size: 22px;
}

.pro-form-demo__actions {
  padding-top: 4px;
}

.pro-form-demo__side {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pro-form-demo__json {
  overflow: auto;
  margin: 0;
  padding: 18px;
  border-radius: 18px;
  color: #dbeafe;
  font-size: 13px;
  line-height: 1.7;
  background: #0f172a;
}

.pro-form-demo__tips {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pro-form-demo__tip {
  padding: 16px 18px;
  border: 1px solid var(--app-border);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.78);
}

.pro-form-demo__tip strong {
  color: var(--app-text-primary);
  font-size: 15px;
}

.pro-form-demo__tip p {
  margin: 8px 0 0;
  color: var(--app-text-secondary);
  line-height: 1.7;
}

@media (max-width: 960px) {
  .pro-form-demo__hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .pro-form-demo__section-head {
    flex-direction: column;
  }
}
</style>
