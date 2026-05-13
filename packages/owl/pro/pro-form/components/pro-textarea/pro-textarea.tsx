import { TextArea } from 'antdv-next';
import { computed, defineComponent } from 'vue';
import type { TextAreaProps } from 'antdv-next';
import type { PropType } from 'vue';
import ProFormItem from '../pro-form-item';
import { baseFieldProps } from '../../field-props';
import { useFieldBinding } from '../../hooks/use-field-binding';
import { useInjectedProForm } from '../../hooks/use-injected-pro-form';
import { useMergedFormItemProps } from '../../hooks/use-merged-form-item-props';
import { createPlaceholder } from '../../utils/field';

export default defineComponent({
  name: 'ProTextArea',
  inheritAttrs: false,
  props: {
    fieldProps: {
      type: Object as PropType<TextAreaProps>,
      default: undefined
    },
    ...baseFieldProps
  },
  setup(props, { slots }) {
    const form = useInjectedProForm();
    const modelValue = useFieldBinding<string>(form, props.name);
    const mergedFormItemProps = useMergedFormItemProps(props);

    const inputProps = computed<TextAreaProps>(() => {
      const placeholder =
        props.placeholder ?? createPlaceholder('请输入', props.label, props.formItemProps);

      return {
        autoSize: {
          minRows: 3,
          maxRows: 6
        },
        placeholder,
        value: modelValue.value,
        'onUpdate:value': (value?: string | number) => {
          modelValue.value = typeof value === 'string' ? value : String(value ?? '');
        },
        ...(props.fieldProps as TextAreaProps | undefined)
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
              return <TextArea {...inputProps.value} v-slots={slots}></TextArea>;
            }
          }}
        />
      );
    };
  }
});
