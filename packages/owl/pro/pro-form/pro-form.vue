<template>
  <a-form
    ref="formRef"
    :model="api.model"
    :name="state.name"
    :layout="state.layout ?? 'horizontal'"
    :label-col="labelCol"
    :wrapper-col="state.wrapperCol"
    :colon="state.colon"
    :disabled="state.disabled"
    @finish="onFinish"
    @keydown="onKeydown"
  >
    <!-- 栅格布局 -->
    <a-row v-if="state.grid" :gutter="gutter">
      <a-col v-for="item in gridItems" :key="item.fieldName" v-bind="colPropsOf(item)">
        <ProFormItem :item="item" :api="api" :common-config="state.commonConfig" />
      </a-col>

      <a-col v-if="showActions" :span="24" class="owl-pro-form__action-col">
        <a-space>
          <template v-for="btn in actionButtons" :key="btn.key">
            <a-button
              v-if="btn.show !== false"
              :type="btn.type"
              :html-type="btn.htmlType"
              :loading="btn.loading"
              v-bind="btn.extra"
              @click="btn.onClick"
            >
              {{ btn.content }}
            </a-button>
          </template>
          <a-button v-if="state.showCollapseButton" type="link" @click="collapsed = !collapsed">
            {{ collapsed ? '展开 ∨' : '收起 ∧' }}
          </a-button>
        </a-space>
      </a-col>
    </a-row>

    <!-- 普通堆叠 / inline 布局 -->
    <template v-else>
      <ProFormItem
        v-for="item in state.schema"
        :key="item.fieldName"
        :item="item"
        :api="api"
        :common-config="state.commonConfig"
      />

      <a-form-item v-if="showActions" :colon="false" :label="actionLabel">
        <div class="owl-pro-form__actions" :class="state.actionWrapperClass">
          <a-space>
            <template v-for="btn in actionButtons" :key="btn.key">
              <a-button
                v-if="btn.show !== false"
                :type="btn.type"
                :html-type="btn.htmlType"
                :loading="btn.loading"
                v-bind="btn.extra"
                @click="btn.onClick"
              >
                {{ btn.content }}
              </a-button>
            </template>
          </a-space>
        </div>
      </a-form-item>
    </template>
  </a-form>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import type { ColProps, FormInstance } from 'antdv-next';
import ProFormItem from './components/form-item/index.vue';
import { isItemVisible } from './components/form-item/derive';
import type { ProFormApi } from './form-api';
import type { ActionButtonOptions } from './types';

const props = defineProps<{ formApi: ProFormApi }>();

const api = props.formApi;
const state = api.state;

const formRef = shallowRef<FormInstance>();

const showActions = computed(() => state.showDefaultActions !== false);

/** labelCol：优先 labelCol，其次 labelWidth 简写 */
const labelCol = computed(() => {
  if (state.labelCol) return state.labelCol;
  if (state.labelWidth != null) return { style: { width: `${state.labelWidth}px` } };
  return undefined;
});

const actionLabel = computed(() =>
  (state.layout ?? 'horizontal') === 'horizontal' ? ' ' : undefined
);

/* ----------------------------- 栅格 / 折叠 ----------------------------- */

const gutter = computed<number | [number, number]>(() => state.gutter ?? [16, 0]);

/** 表单级默认列配置 */
const defaultColProps = computed<ColProps>(
  () => state.colProps ?? state.commonConfig?.colProps ?? { span: 8 }
);

function colPropsOf(item: { colProps?: ColProps }): ColProps {
  return item.colProps ?? defaultColProps.value;
}

/** 每行可放列数（按默认 span 估算，用于折叠计算） */
const colsPerRow = computed(() => {
  const span = (defaultColProps.value.span as number) ?? 8;
  return Math.max(1, Math.floor(24 / span));
});

const collapsed = ref(state.defaultCollapsed ?? true);

/** 仅保留 dependencies.show 为真的项 */
const visibleSchema = computed(() => state.schema.filter((item) => isItemVisible(item, api)));

/** 栅格模式下、折叠时只渲染前 N 行的项 */
const gridItems = computed(() => {
  if (!state.grid || !state.showCollapseButton || !collapsed.value) return visibleSchema.value;
  const count = (state.collapsedRows ?? 1) * colsPerRow.value;
  return visibleSchema.value.slice(0, count);
});

/* ----------------------------- 操作按钮 ----------------------------- */

interface NormalizedButton {
  key: string;
  content: string;
  type?: ActionButtonOptions['type'];
  htmlType?: ActionButtonOptions['htmlType'];
  loading?: ActionButtonOptions['loading'];
  show?: boolean;
  extra: Record<string, any>;
  onClick: (e: Event) => void;
}

const submitting = shallowRef(false);

function buildButton(
  options: ActionButtonOptions | undefined,
  defaults: NormalizedButton
): NormalizedButton {
  const { content, show, type, htmlType, loading, ...extra } = options ?? {};
  return {
    ...defaults,
    type: type ?? defaults.type,
    htmlType: htmlType ?? defaults.htmlType,
    content: content ?? defaults.content,
    show,
    loading: loading ?? defaults.loading,
    extra
  };
}

const actionButtons = computed<NormalizedButton[]>(() => {
  const submit = buildButton(state.submitButtonOptions, {
    key: 'submit',
    content: '提交',
    type: 'primary',
    htmlType: 'submit',
    loading: submitting.value,
    extra: {},
    onClick: () => {}
  });
  const reset = buildButton(state.resetButtonOptions, {
    key: 'reset',
    content: '重置',
    htmlType: 'button',
    extra: {},
    onClick: () => api.resetForm()
  });

  return state.actionButtonsReverse ? [submit, reset] : [reset, submit];
});

/* ----------------------------- 事件 ----------------------------- */

async function onFinish() {
  // a-form 的 finish 已完成校验，这里直接走提交流程
  try {
    submitting.value = true;
    await api.submitForm();
  } finally {
    submitting.value = false;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (state.submitOnEnter && e.key === 'Enter') {
    e.preventDefault();
    void onFinish();
  }
}

/* ----------------------------- 值变化监听 ----------------------------- */

let prevValues: Record<string, any> = { ...api.model };

watch(
  () => ({ ...api.model }),
  (next) => {
    const changed = Object.keys(next).filter((k) => next[k] !== prevValues[k]);
    prevValues = next;
    if (changed.length === 0) return;
    state.handleValuesChange?.(api.getValues(), changed);
    if (state.submitOnChange) {
      void api.submitForm().catch(() => {});
    }
  },
  { deep: true }
);

/* ----------------------------- 生命周期 ----------------------------- */

onMounted(() => {
  if (formRef.value) api.mount(formRef.value);
});

onBeforeUnmount(() => {
  api.unmount();
});
</script>

<style scoped lang="less">
.owl-pro-form__actions {
  display: flex;
  align-items: center;
}

.owl-pro-form__action-col {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}
</style>
