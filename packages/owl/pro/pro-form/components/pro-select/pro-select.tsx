import { Select } from 'antdv-next';
import { computed, defineComponent } from 'vue';
import type { SelectProps, SelectValue } from 'antdv-next';
import type { PropType } from 'vue';
import type { ProChoiceFieldProps, ProFieldRequest } from '../../types';
import ProFormItem from '../pro-form-item';
import { baseFieldProps } from '../../field-props';
import { useFieldBinding } from '../../hooks/use-field-binding';
import { useFieldOptions } from '../../hooks/use-field-options';
import { useInjectedProForm } from '../../hooks/use-injected-pro-form';
import { useMergedFormItemProps } from '../../hooks/use-merged-form-item-props';
import { createPlaceholder } from '../../utils/field';

type SelectOption = NonNullable<SelectProps['options']>[number];

export default defineComponent({
  name: 'ProSelect',
  inheritAttrs: false,
  props: {
    fieldProps: {
      type: Object as PropType<SelectProps>,
      default: undefined
    },
    ...baseFieldProps,
    options: {
      type: Array as PropType<SelectOption[]>,
      default: undefined
    },
    request: {
      type: Function as PropType<ProFieldRequest<SelectOption>>,
      default: undefined
    },
    dependencies: {
      type: Array as PropType<ProChoiceFieldProps<SelectProps, SelectOption>['dependencies']>,
      default: undefined
    }
  },
  setup(props, { slots }) {
    const form = useInjectedProForm();
    const modelValue = useFieldBinding<SelectValue>(form, props.name);
    const mergedFormItemProps = useMergedFormItemProps(props);
    const { loading, options } = useFieldOptions<SelectProps, SelectOption>(form, props);

    const inputProps = computed<SelectProps>(() => {
      const placeholder =
        props.placeholder ?? createPlaceholder('请选择', props.label, props.formItemProps);

      return {
        showSearch: true,
        optionFilterProp: 'label',
        value: modelValue.value,
        placeholder,
        options: options.value,
        loading: loading.value,
        'onUpdate:value': (value: SelectValue) => {
          modelValue.value = value;
        },
        ...(props.fieldProps as SelectProps | undefined)
      };
    });

    return () => {
      if (props.hidden) {
        return null;
      }

      return (
        <ProFormItem
          {...mergedFormItemProps.value}
          v-slots={{
            ...slots,
            default: () => {
              return <Select {...inputProps.value} v-slots={slots}></Select>;
            }
          }}
        />
      );
    };
  }
});
