<script setup lang="ts">
import type { ApiComponentOptionsItem, ApiComponentProps } from '../types';

import { computed, nextTick, ref, unref, useAttrs, watch } from 'vue';
import { cloneDeep, get, isEqual, isFunction } from 'lodash-es';

defineOptions({
  name: 'ApiComponent',
  // 由 bindProps 手动合并 attrs，避免与动态 model/options 绑定冲突
  inheritAttrs: false
});

// component（必填，无默认值）：要渲染的目标 UI 组件，如 Select、Cascader、TreeSelect
const props = withDefaults(defineProps<ApiComponentProps>(), {
  // 请求成功后钩子，用于转换/过滤接口返回值（可返回数组或带 resultField 的对象）
  afterFetch: undefined,
  // 为 true 时，每次下拉/面板展开都会重新请求，忽略是否已加载过
  alwaysLoad: false,
  // 拉取选项的函数，入参为 mergedParams（params + updateParam），需返回列表或包装对象
  api: undefined,
  // 当前值为 undefined 且有待选项时自动选中：'first' | 'last' | 'one' | 自定义函数 | false
  autoSelect: false,
  // 请求前钩子，可改写即将发送的参数（返回新对象或 void 沿用原参数）
  beforeFetch: undefined,
  // 子节点在接口数据中的字段名；为空时使用 item.children（级联/树形）
  childrenField: '',
  // 禁用态在接口数据中的字段名，映射为选项的 disabled
  disabledField: 'disabled',
  // 为 true 时挂载即请求，且 mergedParams 变化时自动重新拉取
  immediate: true,
  // 展示文案在接口数据中的字段名，映射为选项的 label
  labelField: 'label',
  // 自定义 label 生成函数，优先级高于 labelField
  labelFn: undefined,
  // 请求 loading 时占用的子组件插槽名（适配器默认 'suffixIcon'）
  loadingSlot: '',
  // 子组件 v-model 绑定的 prop 名（Ant Design Vue 多为 'value'，Vue 默认为 'modelValue'）
  modelPropName: 'modelValue',
  // 是否将选项 value 转为字符串（兼容 Select value 类型）
  numberToString: false,
  // 静态备选选项；接口未返回或 refOptions 为空时作为 finalOptions 回退
  options: () => [],
  // 传给子组件的选项集合 prop 名（如 TreeSelect 使用 'treeData'）
  optionsPropName: 'options',
  // 请求 api 的静态参数，可与 expose.updateParam 写入的 innerParams 合并
  params: () => ({}),
  // api 返回对象时，列表数据的路径（lodash get，如 'data.records'）
  resultField: '',
  // 请求前校验，返回 false 则跳过本次 fetch
  shouldFetch: undefined,
  // 选项值在接口数据中的字段名，映射为选项的 value
  valueField: 'value',
  // 展开/可见时触发懒加载的事件名（如 'onDropdownVisibleChange'、'onVisibleChange'）
  visibleEvent: ''
});

const emit = defineEmits<{
  optionsChange: [ApiComponentOptionsItem[]];
  // 当 modelPropName 非 modelValue 时，额外发出 update:xxx 以兼容不同组件的 v-model 名
  [key: `update:${string}`]: [value: unknown];
}>();

const modelValue = defineModel<unknown>({ default: undefined });

const attrs = useAttrs();
const componentRef = ref();
/** 运行时可通过 expose.updateParam 追加/覆盖的请求参数 */
const innerParams = ref<Record<string, unknown>>({});
/** 是否已成功拉取过至少一次（配合 immediate=false 做懒加载） */
const isFirstLoaded = ref(false);
/** 请求进行中又有新请求时，在 finally 里串行补拉一次 */
const hasPendingRequest = ref(false);
const loading = ref(false);
/** 接口返回的原始选项，经 finalOptions 做字段映射后交给子组件 */
const refOptions = ref<ApiComponentOptionsItem[]>([]);

function omitObject<T extends Record<string, unknown>>(value: T, keys: string[]) {
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !keys.includes(key))
  ) as Partial<T>;
}

/** props.params 与 expose.updateParam 写入的 innerParams 合并，作为 api 入参 */
const mergedParams = computed(() => {
  return {
    ...props.params,
    ...innerParams.value
  };
});

/**
 * 将接口/静态 options 映射为子组件需要的结构。
 * 支持嵌套 children（树形/级联），并保留除 label/value/disabled/children 外的其余字段。
 */
const finalOptions = computed(() => {
  const { childrenField, disabledField, labelField, labelFn, numberToString, valueField } = props;

  function transformData(data: ApiComponentOptionsItem[] = []): ApiComponentOptionsItem[] {
    return data.map((item) => {
      const value = get(item, valueField);
      const children = childrenField ? get(item, childrenField) : item.children;

      return {
        ...omitObject(item, [
          labelField,
          valueField,
          disabledField,
          ...(childrenField ? [childrenField] : [])
        ]),
        disabled: get(item, disabledField) as boolean | undefined,
        label: labelFn ? labelFn(item) : (get(item, labelField) as string),
        value: numberToString ? `${value}` : (value as number | string),
        ...(Array.isArray(children) && children.length > 0
          ? {
              children: transformData(children as ApiComponentOptionsItem[])
            }
          : {})
      };
    });
  }

  const data = transformData(unref(refOptions));

  // 接口无数据时回退到 props.options 静态选项
  return data.length > 0 ? data : transformData(props.options);
});

/** 组装传给动态子组件的 props：v-model、options、可见性触发的拉取等 */
const bindProps = computed(() => {
  const propName = props.modelPropName;

  return {
    [propName]: unref(modelValue),
    [props.optionsPropName]: unref(finalOptions),
    [`onUpdate:${propName}`]: (value: unknown) => {
      updateModelValue(value);
    },
    ...omitObject(attrs as Record<string, unknown>, [`onUpdate:${propName}`]),
    // 如下拉展开时再请求：visibleEvent 通常为 'onDropdownVisibleChange' 等
    ...(props.visibleEvent
      ? {
          [props.visibleEvent]: handleFetchForVisible
        }
      : {})
  };
});

function updateModelValue(value: unknown) {
  modelValue.value = value;

  if (props.modelPropName !== 'modelValue') {
    emit(`update:${props.modelPropName}`, value);
  }
}

async function fetchApi() {
  const { afterFetch, api, beforeFetch, resultField, shouldFetch } = props;

  if (!api || !isFunction(api)) {
    return;
  }

  // 并发请求合并：当前请求结束后在 finally 中再拉一次最新参数
  if (loading.value) {
    hasPendingRequest.value = true;
    return;
  }

  refOptions.value = [];

  try {
    loading.value = true;
    let finalParams = unref(mergedParams);

    if (beforeFetch) {
      finalParams = (await beforeFetch(cloneDeep(finalParams))) || finalParams;
    }

    if (shouldFetch && !(await shouldFetch(finalParams))) {
      return;
    }

    let response = await api(finalParams);

    if (afterFetch) {
      response =
        ((await afterFetch(response)) as ApiComponentOptionsItem[] | Record<string, unknown>) ||
        response;
    }

    isFirstLoaded.value = true;

    if (Array.isArray(response)) {
      refOptions.value = response;
      emitChange();
      return;
    }

    // 接口返回 { list: [...] } 等形式时，用 resultField 取列表
    if (resultField) {
      refOptions.value = (get(response, resultField) || []) as ApiComponentOptionsItem[];
    }

    emitChange();
  } catch (error) {
    console.warn('[ApiComponent] options fetch failed.', error);
    isFirstLoaded.value = false;
  } finally {
    loading.value = false;

    if (hasPendingRequest.value) {
      hasPendingRequest.value = false;
      await nextTick();
      await fetchApi();
    }
  }
}

/**
 * 下拉/面板展开时拉取选项。
 * - alwaysLoad：每次展开都重新请求
 * - immediate=false：首次展开才请求，避免表单一加载就打接口
 */
async function handleFetchForVisible(visible: boolean) {
  if (!visible) {
    return;
  }

  if (props.alwaysLoad) {
    await fetchApi();
    return;
  }

  if (!props.immediate && !unref(isFirstLoaded)) {
    await fetchApi();
  }
}

/** 选项更新后：可选自动选中首项/末项/唯一项，并向外抛出 optionsChange */
function emitChange() {
  if (modelValue.value === undefined && props.autoSelect && unref(finalOptions).length > 0) {
    let selectedOption: ApiComponentOptionsItem | undefined;

    if (isFunction(props.autoSelect)) {
      selectedOption = props.autoSelect(unref(finalOptions));
    } else {
      switch (props.autoSelect) {
        case 'first':
          selectedOption = unref(finalOptions)[0];
          break;
        case 'last':
          selectedOption = unref(finalOptions).at(-1);
          break;
        case 'one':
          selectedOption = unref(finalOptions).length === 1 ? unref(finalOptions)[0] : undefined;
          break;
      }
    }

    if (selectedOption) {
      updateModelValue(selectedOption.value);
    }
  }

  emit('optionsChange', unref(finalOptions));
}

// mergedParams 变化时重新拉取；immediate 控制是否在挂载时立即请求
watch(
  mergedParams,
  (value, oldValue) => {
    if (isEqual(value, oldValue)) {
      return;
    }

    void fetchApi();
  },
  { deep: true, immediate: props.immediate }
);

defineExpose({
  getComponentRef: <T = unknown,>() => componentRef.value as T,
  getOptions: () => unref(finalOptions),
  getValue: () => unref(modelValue),
  updateParam(newParams: Record<string, unknown>) {
    innerParams.value = newParams;
  }
});
</script>

<template>
  <!-- 动态子组件 + 插槽透传，loadingSlot 在请求中显示占位 -->
  <component :is="component" ref="componentRef" v-bind="bindProps">
    <template v-for="slotName in Object.keys($slots)" :key="slotName" #[slotName]="data">
      <slot :name="slotName" v-bind="data || {}"></slot>
    </template>
    <template v-if="loadingSlot && loading" #[loadingSlot]>
      <span class="inline-flex min-w-[1em] justify-center">...</span>
    </template>
  </component>
</template>
