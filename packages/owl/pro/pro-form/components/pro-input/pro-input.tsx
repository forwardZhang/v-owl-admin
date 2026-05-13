import { Input } from 'antdv-next';
import { computed, defineComponent } from 'vue';
import type { InputProps } from 'antdv-next';
import type { PropType } from 'vue';
import ProFormItem from '../pro-form-item';
import { baseFieldProps } from '../../field-props';
import { useFieldBinding } from '../../hooks/use-field-binding';
import { useInjectedProForm } from '../../hooks/use-injected-pro-form';
import { useMergedFormItemProps } from '../../hooks/use-merged-form-item-props';
import { createPlaceholder } from '../../utils/field';

export default defineComponent({
  name: 'ProInput',
  inheritAttrs: false,
  props: {
    fieldProps: {
      type: Object as PropType<InputProps>,
      default: undefined
    },
    ...baseFieldProps
  },
  setup(props, { slots }) {
    const form = useInjectedProForm();
    const modelValue = useFieldBinding<string>(form, props.name);
    const mergedFormItemProps = useMergedFormItemProps(props);
    const placeholder =
      props.placeholder ?? createPlaceholder('请输入', props.label, props.formItemProps);
    const inputProps = computed<InputProps>(() => {
      return {
        placeholder,
        allowClear: true,
        value: modelValue.value,
        'onUpdate:value': (value: string) => {
          modelValue.value = value;
        },
        ...(props.fieldProps as InputProps | undefined)
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
              return <Input {...inputProps.value} v-slots={slots}></Input>;
            }
          }}
        />
      );
    };
  }
});
