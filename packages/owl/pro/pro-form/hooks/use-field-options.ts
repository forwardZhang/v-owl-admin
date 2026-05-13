import { computed, shallowRef, watch } from 'vue';
import { set } from 'lodash-es';
import type { CreateProFormReturn, ProChoiceFieldProps } from '../types';
import { getFieldPropsOptions, normalizeNamePath } from '../utils/field';

export function useFieldOptions<TFieldProps = Record<string, unknown>, TOption = unknown>(
  form: CreateProFormReturn,
  props: Pick<ProChoiceFieldProps<TFieldProps, TOption>, 'dependencies' | 'options' | 'request'> & {
    fieldProps?: TFieldProps;
  }
) {
  const resolvedOptions = shallowRef<TOption[]>([]);
  const loading = shallowRef(false);
  const requestId = shallowRef(0);

  const dependencyValues = computed<Record<string, unknown>>(() => {
    const values: Record<string, unknown> = {};

    props.dependencies?.forEach((name) => {
      set(values, normalizeNamePath(name), form.getFieldValue(name));
    });

    return values;
  });

  watch(
    [() => props.request, dependencyValues],
    async () => {
      if (!props.request) {
        resolvedOptions.value =
          props.options ?? getFieldPropsOptions<TOption>(props.fieldProps) ?? [];
        loading.value = false;
        return;
      }

      const currentRequestId = requestId.value + 1;
      requestId.value = currentRequestId;
      loading.value = true;

      try {
        const nextOptions = await props.request({
          form,
          values: form.values,
          dependencyValues: dependencyValues.value
        });

        if (requestId.value !== currentRequestId) {
          return;
        }

        resolvedOptions.value = Array.isArray(nextOptions) ? nextOptions : [];
      } catch (error) {
        if (requestId.value === currentRequestId) {
          resolvedOptions.value = [];
        }

        console.error('[ProForm] Failed to load field options.', error);
      } finally {
        if (requestId.value === currentRequestId) {
          loading.value = false;
        }
      }
    },
    {
      deep: true,
      immediate: true
    }
  );

  return {
    options: computed<TOption[]>(() => {
      if (props.request) {
        return resolvedOptions.value;
      }

      return props.options ?? getFieldPropsOptions<TOption>(props.fieldProps) ?? [];
    }),
    loading
  };
}
