import type {
  BaseFormComponentType,
  BuiltinComponentProps,
  FormApi,
  FormItemDependencies,
  FormSchema,
  FormSchemaRule
} from '../types';

import { computed, ref, watch } from 'vue';
import { get, isBoolean, isFunction } from 'lodash-es';

import { createFieldContext, normalizeNamePath } from '../utils';

export function useDependencies<TValues extends Record<string, unknown>>({
  api,
  getDependencies,
  schema
}: {
  api: FormApi<TValues>;
  getDependencies: () => FormItemDependencies<Record<string, unknown>, TValues> | undefined;
  schema: FormSchema<BaseFormComponentType, BuiltinComponentProps, TValues>;
}) {
  const isDisabled = ref(false);
  const isIf = ref(true);
  const isRequired = ref(false);
  const isShow = ref(true);
  const dynamicComponentProps = ref<Record<string, unknown>>({});
  const dynamicRules = ref<FormSchemaRule>();

  const triggerFieldValues = computed(() => {
    const triggerFields = getDependencies()?.triggerFields ?? [];

    return triggerFields.map((fieldName) => get(api.values, normalizeNamePath(fieldName)));
  });

  function resetConditionState() {
    isDisabled.value = false;
    isIf.value = true;
    isRequired.value = false;
    isShow.value = true;
    dynamicComponentProps.value = {};
    dynamicRules.value = undefined;
  }

  watch(
    [triggerFieldValues, getDependencies],
    async ([, dependencies]) => {
      resetConditionState();

      if (!dependencies?.triggerFields?.length) {
        return;
      }

      const ctx = createFieldContext({ api, schema });
      const { componentProps, disabled, if: whenIf, required, rules, show, trigger } = dependencies;

      if (isFunction(whenIf)) {
        isIf.value = !!(await whenIf(ctx));
        if (!isIf.value) return;
      } else if (isBoolean(whenIf)) {
        isIf.value = whenIf;
        if (!isIf.value) return;
      }

      if (isFunction(show)) {
        isShow.value = !!(await show(ctx));
      } else if (isBoolean(show)) {
        isShow.value = show;
      }

      if (isFunction(componentProps)) {
        dynamicComponentProps.value = await componentProps(ctx);
      } else if (componentProps) {
        dynamicComponentProps.value = componentProps;
      }

      if (isFunction(rules)) {
        dynamicRules.value = await rules(ctx);
      } else if (rules) {
        dynamicRules.value = rules;
      }

      if (isFunction(disabled)) {
        isDisabled.value = !!(await disabled(ctx));
      } else if (isBoolean(disabled)) {
        isDisabled.value = disabled;
      }

      if (isFunction(required)) {
        isRequired.value = !!(await required(ctx));
      } else if (isBoolean(required)) {
        isRequired.value = required;
      }

      await trigger?.(ctx);
    },
    { deep: true, immediate: true }
  );

  return {
    dynamicComponentProps,
    dynamicRules,
    isDisabled,
    isIf,
    isRequired,
    isShow
  };
}
