<script setup lang="ts">
import type { ApiComponentOptionsItem, ApiComponentProps } from '../types';

import { computed, nextTick, ref, unref, useAttrs, watch } from 'vue';
import { cloneDeep, get, isEqual, isFunction } from 'lodash-es';

defineOptions({
  name: 'ApiComponent',
  inheritAttrs: false
});

const props = withDefaults(defineProps<ApiComponentProps>(), {
  afterFetch: undefined,
  alwaysLoad: false,
  api: undefined,
  autoSelect: false,
  beforeFetch: undefined,
  childrenField: '',
  disabledField: 'disabled',
  immediate: true,
  labelField: 'label',
  labelFn: undefined,
  loadingSlot: '',
  modelPropName: 'modelValue',
  numberToString: false,
  options: () => [],
  optionsPropName: 'options',
  params: () => ({}),
  resultField: '',
  shouldFetch: undefined,
  valueField: 'value',
  visibleEvent: ''
});

const emit = defineEmits<{
  optionsChange: [ApiComponentOptionsItem[]];
}>();

const modelValue = defineModel<unknown>({ default: undefined });

const attrs = useAttrs();
const componentRef = ref();
const innerParams = ref<Record<string, unknown>>({});
const isFirstLoaded = ref(false);
const hasPendingRequest = ref(false);
const loading = ref(false);
const refOptions = ref<ApiComponentOptionsItem[]>([]);

function omitObject<T extends Record<string, unknown>>(value: T, keys: string[]) {
  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !keys.includes(key))
  ) as Partial<T>;
}

const mergedParams = computed(() => {
  return {
    ...props.params,
    ...innerParams.value
  };
});

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

  return data.length > 0 ? data : transformData(props.options);
});

const bindProps = computed(() => {
  const propName = props.modelPropName;

  return {
    [propName]: unref(modelValue),
    [props.optionsPropName]: unref(finalOptions),
    [`onUpdate:${propName}`]: (value: unknown) => {
      modelValue.value = value;
    },
    ...omitObject(attrs as Record<string, unknown>, [`onUpdate:${propName}`]),
    ...(props.visibleEvent
      ? {
          [props.visibleEvent]: handleFetchForVisible
        }
      : {})
  };
});

async function fetchApi() {
  const { afterFetch, api, beforeFetch, resultField, shouldFetch } = props;

  if (!api || !isFunction(api)) {
    return;
  }

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
      modelValue.value = selectedOption.value;
    }
  }

  emit('optionsChange', unref(finalOptions));
}

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
  <component :is="component" ref="componentRef" v-bind="bindProps">
    <template v-for="slotName in Object.keys($slots)" :key="slotName" #[slotName]="data">
      <slot :name="slotName" v-bind="data || {}"></slot>
    </template>
    <template v-if="loadingSlot && loading" #[loadingSlot]>
      <span class="api-component__loading">...</span>
    </template>
  </component>
</template>

<style scoped>
.api-component__loading {
  display: inline-flex;
  min-width: 1em;
  justify-content: center;
}
</style>
