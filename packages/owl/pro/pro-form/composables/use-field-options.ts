import { ref, watchEffect } from 'vue';
import { get } from 'lodash-es';
import type { ProFieldData, ProFormRequestConfig } from '../types';

interface NormalizedOption {
  label: any;
  value: any;
  children?: NormalizedOption[];
  [key: string]: any;
}

/** 把 source 属性拆成「数据源 + 字段别名配置」 */
function parseSource(source: ProFieldData | undefined): {
  source: ProFormRequestConfig['data'];
  config: Omit<ProFormRequestConfig, 'data'>;
} {
  if (
    source &&
    !Array.isArray(source) &&
    typeof source === 'object' &&
    !(source instanceof Promise) &&
    typeof source !== 'function'
  ) {
    const { data: dataSource, ...config } = source as ProFormRequestConfig;
    return { source: dataSource, config };
  }
  return { source: source as ProFormRequestConfig['data'], config: {} };
}

/**
 * 通用 options / treeData 加载：
 * - source 可为 数组 / Promise / 函数（函数内读 formData 即实现联动）/ 带字段别名的配置
 * - 用 watchEffect 跟踪函数内的响应式依赖，依赖变化自动重新加载
 *
 * @param getSource 返回字段 source 属性的 getter
 */
export function useFieldOptions(getSource: () => ProFieldData | undefined) {
  const options = ref<NormalizedOption[]>([]);
  const loading = ref(false);

  /** 按字段别名递归标准化为 { label, value, children } */
  function normalize(list: any[], config: Omit<ProFormRequestConfig, 'data'>): NormalizedOption[] {
    if (!Array.isArray(list)) return [];
    const labelField = config.labelField ?? 'label';
    const valueField = config.valueField ?? 'value';
    const childrenField = config.childrenField ?? 'children';
    return list.map((item) => {
      const children = item?.[childrenField];
      const mapped: NormalizedOption = {
        ...item,
        label: get(item, labelField),
        value: get(item, valueField)
      };
      if (Array.isArray(children)) {
        mapped.children = normalize(children, config);
      }
      return mapped;
    });
  }

  watchEffect(async () => {
    const { source, config } = parseSource(getSource());
    // 同步求值：函数内读取的响应式依赖在此被跟踪
    let res: any = typeof source === 'function' ? source() : source;

    if (res == null) {
      options.value = [];
      return;
    }

    if (res instanceof Promise) {
      loading.value = true;
      try {
        res = await res;
      } catch (error) {
        console.error('[ProForm] 加载 options 失败：', error);
        options.value = [];
        return;
      } finally {
        loading.value = false;
      }
    }

    const list = config.resultField ? (get(res, config.resultField) ?? []) : res;
    options.value = normalize(list, config);
  });

  return { options, loading };
}
