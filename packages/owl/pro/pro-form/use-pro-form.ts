import { defineComponent, h } from 'vue';
import ProFormComp from './pro-form.vue';
import { ProFormApi } from './form-api';
import type { ProFormProps, UseProFormReturn } from './types';

/**
 * vben 风格的表单 hook。
 *
 * @example
 * const [ProForm, formApi] = useProForm({ schema: [...], handleSubmit })
 * // 模板：<ProForm />
 * // 逻辑：formApi.submitForm() / formApi.setValues({...}) / formApi.updateSchema([...])
 */
export function useProForm(options: ProFormProps): UseProFormReturn {
  const api = new ProFormApi(options);

  const ProForm = defineComponent({
    name: 'ProForm',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(ProFormComp, { ...attrs, formApi: api }, slots);
    }
  });

  return [ProForm, api] as const;
}
