import { FormItem } from 'antdv-next';
import { defineComponent, useAttrs } from 'vue';
import type { PropType } from 'vue';
import type { ProFormItemProps } from '../../types';

export default defineComponent({
  name: 'ProFormItem',
  inheritAttrs: false,
  props: {
    /**
     * label 作为 label 的别名，
     * 用于兼容字段配置里更常见的 label 命名。
     */
    label: {
      type: String as PropType<ProFormItemProps['label']>,
      default: undefined
    }
  },
  setup(props, { slots }) {
    const attrs = useAttrs();

    return () => {
      /**
       * label 渲染优先级：
       * label slot > label
       */
      const labelDom = slots.label?.() ?? props.label;

      return (
        <FormItem
          {...attrs}
          label={undefined}
          v-slots={{
            ...slots,
            label: labelDom
              ? () => {
                  return labelDom;
                }
              : undefined
          }}
        />
      );
    };
  }
});
