import { Radio, RadioGroup } from 'antdv-next';
import { computed, defineComponent } from 'vue';
import type { RadioGroupProps, RadioOptionType, RadioProps } from 'antdv-next';
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
  name: 'ProRadio',
  inheritAttrs: false,
  props: {
    fieldProps: {
      type: Object as PropType<RadioProps & RadioGroupProps>,
      default: undefined
    },
    ...baseFieldProps,
    options: {
      type: Array as PropType<RadioOptionType[]>,
      default: undefined
    },
    request: {
      type: Function as PropType<ProFieldRequest<RadioOptionType>>,
      default: undefined
    },
    dependencies: {
      type: Array as PropType<
        ProChoiceFieldProps<RadioProps & RadioGroupProps, RadioOptionType>['dependencies']
      >,
      default: undefined
    }
  },
  setup(props, { slots }) {
    const form = useInjectedProForm();
    const checkedValue = useFieldBinding<RadioProps['checked']>(form, props.name);
    const groupValue = useFieldBinding<RadioGroupProps['value']>(form, props.name);
    const mergedFormItemProps = useMergedFormItemProps(props);
    const { options } = useFieldOptions<RadioProps & RadioGroupProps, RadioOptionType>(form, props);
    const isGroup = computed(() => {
      return Boolean(props.request || props.options || hasOptionsConfig(props.fieldProps));
    });

    const radioProps = computed<RadioProps>(() => {
      return {
        checked: checkedValue.value,
        'onUpdate:checked': (value: RadioProps['checked']) => {
          checkedValue.value = value;
        },
        ...(props.fieldProps as RadioProps | undefined)
      };
    });

    const radioGroupProps = computed<RadioGroupProps>(() => {
      return {
        value: groupValue.value,
        options: options.value,
        'onUpdate:value': (value: RadioGroupProps['value']) => {
          groupValue.value = value;
        },
        ...(props.fieldProps as RadioGroupProps | undefined)
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
                return <RadioGroup {...radioGroupProps.value} v-slots={slots}></RadioGroup>;
              }

              return <Radio {...radioProps.value} v-slots={slots}></Radio>;
            }
          }}
        />
      );
    };
  }
});
