import { InputPassword } from 'antdv-next';
import { computed, defineComponent } from 'vue';
import type { PropType } from 'vue';
import ProFormItem from '../pro-form-item';
import { baseFieldProps } from '../../field-props';
import { useFieldBinding } from '../../hooks/use-field-binding';
import { useInjectedProForm } from '../../hooks/use-injected-pro-form';
import { useMergedFormItemProps } from '../../hooks/use-merged-form-item-props';
import { createPlaceholder } from '../../utils/field';

type PasswordProps = InstanceType<typeof InputPassword>['$props'];

export default defineComponent({
  name: 'ProPassword',
  inheritAttrs: false,
  props: {
    fieldProps: {
      type: Object as PropType<PasswordProps>,
      default: undefined
    },
    ...baseFieldProps
  },
  setup(props, { slots }) {
    const form = useInjectedProForm();
    const modelValue = useFieldBinding<string>(form, props.name);
    const mergedFormItemProps = useMergedFormItemProps(props);

    const inputProps = computed<PasswordProps>(() => {
      const placeholder =
        props.placeholder ?? createPlaceholder('请输入', props.label, props.formItemProps);

      return {
        placeholder,
        value: modelValue.value,
        'onUpdate:value': (value?: string | number) => {
          modelValue.value = typeof value === 'string' ? value : String(value ?? '');
        },
        ...(props.fieldProps as PasswordProps | undefined)
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
              return <InputPassword {...inputProps.value} v-slots={slots}></InputPassword>;
            }
          }}
        />
      );
    };
  }
});
