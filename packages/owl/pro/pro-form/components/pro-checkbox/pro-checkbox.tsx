import { Checkbox, CheckboxGroup } from 'antdv-next';
import { computed, defineComponent } from 'vue';
import type { CheckboxGroupProps, CheckboxOptionType, CheckboxProps } from 'antdv-next';
import type { PropType } from 'vue';
import type { ProChoiceFieldProps, ProFieldRequest } from '../../types';
import ProFormItem from '../pro-form-item';
import { baseFieldProps } from '../../field-props';
import { useFieldBinding } from '../../hooks/use-field-binding';
import { useFieldOptions } from '../../hooks/use-field-options';
import { useInjectedProForm } from '../../hooks/use-injected-pro-form';
import { useMergedFormItemProps } from '../../hooks/use-merged-form-item-props';
import { hasOptionsConfig } from '../../utils/field';

export default defineComponent({
  name: 'ProCheckbox',
  inheritAttrs: false,
  props: {
    fieldProps: {
      type: Object as PropType<CheckboxProps & CheckboxGroupProps>,
      default: undefined
    },
    ...baseFieldProps,
    options: {
      type: Array as PropType<CheckboxOptionType[]>,
      default: undefined
    },
    request: {
      type: Function as PropType<ProFieldRequest<CheckboxOptionType>>,
      default: undefined
    },
    dependencies: {
      type: Array as PropType<
        ProChoiceFieldProps<CheckboxProps & CheckboxGroupProps, CheckboxOptionType>['dependencies']
      >,
      default: undefined
    }
  },
  setup(props, { slots }) {
    const form = useInjectedProForm();
    const checkedValue = useFieldBinding<CheckboxProps['checked']>(form, props.name);
    const groupValue = useFieldBinding<CheckboxGroupProps['value']>(form, props.name);
    const mergedFormItemProps = useMergedFormItemProps(props);
    const { options } = useFieldOptions<CheckboxProps & CheckboxGroupProps, CheckboxOptionType>(
      form,
      props
    );
    const isGroup = computed(() => {
      return Boolean(props.request || props.options || hasOptionsConfig(props.fieldProps));
    });

    const checkboxProps = computed<CheckboxProps>(() => {
      return {
        checked: checkedValue.value,
        'onUpdate:checked': (value: CheckboxProps['checked']) => {
          checkedValue.value = value;
        },
        ...(props.fieldProps as CheckboxProps | undefined)
      };
    });

    const checkboxGroupProps = computed<CheckboxGroupProps>(() => {
      return {
        value: groupValue.value,
        options: options.value,
        'onUpdate:value': (value: CheckboxGroupProps['value']) => {
          groupValue.value = value;
        },
        ...(props.fieldProps as CheckboxGroupProps | undefined)
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
              if (isGroup.value) {
                return (
                  <CheckboxGroup {...checkboxGroupProps.value} v-slots={slots}></CheckboxGroup>
                );
              }

              return <Checkbox {...checkboxProps.value} v-slots={slots}></Checkbox>;
            }
          }}
        />
      );
    };
  }
});
