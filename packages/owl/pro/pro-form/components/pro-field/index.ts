import { computed, defineComponent, h } from 'vue';
import type { Component, PropType } from 'vue';
import type { ProFieldType } from '../../types';
import { proFieldProps } from '../../field-props';
import { useMergedFormItemProps } from '../../hooks/use-merged-form-item-props';
import ProCheckbox from '../pro-checkbox';
import ProInput from '../pro-input';
import ProPassword from '../pro-password';
import ProFormItem from '../pro-form-item';
import ProRadio from '../pro-radio';
import ProSelect from '../pro-select';
import ProTextArea from '../pro-textarea';

/**
 * 内置字段类型与具体渲染组件的映射表。
 * ProField 默认会基于这里的 type 自动选择具体组件。
 */
const builtinFieldComponentMap: Record<ProFieldType, Component> = {
  checkbox: ProCheckbox,
  'checkbox-group': ProCheckbox,
  input: ProInput,
  password: ProPassword,
  radio: ProRadio,
  'radio-group': ProRadio,
  select: ProSelect,
  textarea: ProTextArea
};

export default defineComponent({
  name: 'ProField',
  inheritAttrs: false,
  props: {
    component: {
      type: [Object, Function] as PropType<Component>,
      default: undefined
    },
    ...proFieldProps,
    type: {
      type: String as PropType<ProFieldType>,
      default: 'input'
    }
  },
  setup(props, { attrs, slots }) {
    const mergedFormItemProps = useMergedFormItemProps(props);
    const resolvedComponent = computed(() => {
      if (props.component) {
        return props.component;
      }

      return builtinFieldComponentMap[props.type as ProFieldType];
    });

    return () => {
      if (!resolvedComponent.value) {
        return null;
      }

      if (props.hidden) {
        return null;
      }

      const componentNode = h(
        resolvedComponent.value,
        {
          ...attrs,
          ...props
        },
        slots
      );

      if (props.component) {
        return h(ProFormItem, mergedFormItemProps.value, {
          ...slots,
          default: () => {
            return componentNode;
          }
        });
      }

      /**
       * 统一把字段公共属性和全部插槽透传给目标组件，
       * 由具体字段组件决定如何消费 ProFormItem / 控件级别的 slot。
       */
      return componentNode;
    };
  }
});

export { builtinFieldComponentMap };
