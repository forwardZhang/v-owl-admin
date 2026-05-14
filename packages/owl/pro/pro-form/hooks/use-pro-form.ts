import type { FormApi as FormApiContract, UseProFormOptions } from '../types';
import type { Component } from 'vue';

import { defineComponent, h, isReactive, watch } from 'vue';

import { FormApi } from '../core/form-api';
import ProForm from '../components/pro-form.vue';

export function useProForm<TValues extends Record<string, unknown> = Record<string, unknown>>(
  options: UseProFormOptions<TValues> = {}
) {
  const formApi = new FormApi<TValues>(options) as FormApi<TValues> & FormApiContract<TValues>;

  if (isReactive(options)) {
    watch(
      () => options,
      (nextOptions) => {
        formApi.setState(nextOptions);
      },
      { deep: true }
    );
  }

  const Form = defineComponent({
    name: 'ProUseForm',
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () => h(ProForm as Component, { ...attrs, formApi }, slots);
    }
  });

  return [Form, formApi] as const;
}
