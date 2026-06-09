import { onMounted, ref, watch } from 'vue';
import { get } from 'lodash-es';
import type { ProFormRequestConfig } from '../types';

interface NormalizedOption {
  label: any;
  value: any;
  children?: NormalizedOption[];
  [key: string]: any;
}

/**
 * 通用异步 options 逻辑（基于 request 配置）：
 * - 支持 api 请求、resultField 取数、label/value/children 字段别名
 * - watch request 实现「依赖字段变化重新请求」
 * - 暴露 fetch 供手动刷新
 *
 * @param getRequest 返回 request 配置的 getter（保证对依赖注入的 params 响应）
 */
export function useApiOptions(getRequest: () => ProFormRequestConfig | undefined) {
  const options = ref<NormalizedOption[]>([]);
  const loading = ref(false);

  /** 按字段别名递归标准化为 { label, value, children } */
  function normalize(list: any[], req: ProFormRequestConfig): NormalizedOption[] {
    if (!Array.isArray(list)) return [];
    const labelField = req.labelField ?? 'label';
    const valueField = req.valueField ?? 'value';
    const childrenField = req.childrenField ?? 'children';
    return list.map((item) => {
      const children = item[childrenField];
      const mapped: NormalizedOption = {
        ...item,
        label: get(item, labelField),
        value: get(item, valueField)
      };
      if (Array.isArray(children)) {
        mapped.children = normalize(children, req);
      }
      return mapped;
    });
  }

  async function fetch() {
    const req = getRequest();
    if (!req?.api) return;
    loading.value = true;
    try {
      let params = req.params;
      if (req.beforeFetch) {
        params = await req.beforeFetch(params);
      }
      const res = await req.api(params);
      let list = req.resultField ? (get(res, req.resultField) ?? []) : res;
      if (req.afterFetch) {
        list = req.afterFetch(list);
      }
      options.value = normalize(list, req);
    } catch (error) {
      console.error('[ProForm] 加载 options 失败：', error);
      options.value = [];
    } finally {
      loading.value = false;
    }
  }

  // 依赖字段变化 -> request（含 params）变化 -> 重新请求
  watch(
    getRequest,
    () => {
      if (getRequest()?.api) fetch();
    },
    { deep: true }
  );

  onMounted(() => {
    const req = getRequest();
    if (req?.api && req.immediate !== false) fetch();
  });

  return { options, loading, fetch };
}
