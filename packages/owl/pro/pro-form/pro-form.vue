<script lang="ts">
import {
  Button as AButton,
  Col as ACol,
  Form as AForm,
  Row as ARow,
  Space as ASpace
} from 'antdv-next';
import {
  Comment,
  Fragment,
  Text,
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  shallowRef,
  watch
} from 'vue';
import type { PropType, VNode } from 'vue';
import type { ColProps, FormInstance } from 'antdv-next';
import { proFormConfigKey, proFormKey } from './context';
import type { ProFormApi } from './create-pro-form';

/**
 * <ProForm>：组件式表单容器。
 * - 绑定 :form（createProForm 的返回值），渲染 a-form 并接管校验/取值
 * - grid 开启时即栅格容器：内部字段自动包 a-col，并内置「展开/收起」折叠与操作区
 */
export default defineComponent({
  name: 'ProForm',
  inheritAttrs: false,
  props: {
    /** 表单控制器（createProForm 返回） */
    form: {
      type: Object as PropType<ProFormApi<any>>,
      required: true
    },
    /* ---- 透传 a-form ---- */
    layout: { type: String as PropType<'horizontal' | 'vertical' | 'inline'>, default: undefined },
    /** 标签宽度（与 labelCol 二选一的简写） */
    labelWidth: [Number, String] as PropType<number | string>,
    labelCol: Object as PropType<ColProps>,
    wrapperCol: Object as PropType<ColProps>,
    colon: { type: Boolean, default: undefined },
    disabled: { type: Boolean, default: undefined },
    /* ---- 栅格 ---- */
    grid: Boolean,
    cols: { type: Number, default: 3 },
    gutter: {
      type: [Number, Array] as PropType<number | [number, number]>,
      default: () => [16, 0]
    },
    collapsible: Boolean,
    /** 受控折叠态（v-model:collapsed） */
    collapsed: { type: Boolean, default: undefined },
    collapsedRows: { type: Number, default: 1 },
    /** 栅格模式是否显示内置操作列，默认显示 */
    showActions: { type: Boolean, default: undefined },
    submitText: { type: String, default: '提交' },
    resetText: { type: String, default: '重置' }
  },
  emits: ['update:collapsed'],
  setup(props, { slots, emit }) {
    const form = props.form;
    const formRef = shallowRef<FormInstance>();

    /* ----------------------------- provide ----------------------------- */
    provide(proFormKey, form);
    provide(
      proFormConfigKey,
      computed(() => ({ grid: props.grid, cols: props.cols, disabled: props.disabled }))
    );

    /* ----------------------------- labelCol ----------------------------- */
    const labelCol = computed<ColProps | undefined>(() => {
      if (props.labelCol) return props.labelCol;
      if (props.labelWidth != null) {
        // 数字或纯数字字符串补 px，其它字符串原样（如 '6em' / 'auto'）
        const raw = props.labelWidth;
        const w = typeof raw === 'number' || /^\d+$/.test(String(raw)) ? `${raw}px` : String(raw);
        return { style: { width: w } } as ColProps;
      }
      return undefined;
    });

    /* ----------------------------- 折叠态 ----------------------------- */
    const innerCollapsed = ref(true);
    const collapsed = computed<boolean>({
      get: () => props.collapsed ?? innerCollapsed.value,
      set: (v) => {
        innerCollapsed.value = v;
        emit('update:collapsed', v);
      }
    });

    /* ----------------------------- 生命周期 ----------------------------- */
    onMounted(() => {
      if (formRef.value) form.mount(formRef.value);
    });
    onBeforeUnmount(() => form.unmount());

    /* ----------------------------- 值变化回调 ----------------------------- */
    if (form.options.onValuesChange) {
      let prev: Record<string, any> = { ...form.formData };
      watch(
        () => ({ ...form.formData }),
        (next) => {
          const changed = Object.keys(next).filter((k) => next[k] !== prev[k]);
          prev = next;
          if (changed.length) form.options.onValuesChange!(form.getFieldsValue() as any, changed);
        },
        { deep: true }
      );
    }

    /* ----------------------------- 渲染辅助 ----------------------------- */
    function isInvisibleNode(node: VNode) {
      return node.props?.visible === false || node.props?.visible === 'false';
    }

    /** 展开 slot 中的 Fragment，过滤注释 / 空白文本 / visible=false 节点，得到字段 vnode 列表 */
    function collectFields(nodes: VNode[]): VNode[] {
      const out: VNode[] = [];
      for (const node of nodes) {
        if (node.type === Fragment && Array.isArray(node.children)) {
          out.push(...collectFields(node.children as VNode[]));
        } else if (isInvisibleNode(node)) {
          continue;
        } else if (
          node.type !== Comment &&
          !(node.type === Text && !String(node.children ?? '').trim())
        ) {
          out.push(node);
        }
      }
      return out;
    }

    function renderActionCol() {
      if (props.showActions === false) return null;
      const inner = slots.action
        ? slots.action()
        : h(ASpace, null, () => {
            const btns = [
              h(
                AButton,
                { type: 'primary', htmlType: 'submit', loading: form.submitting.value },
                () => props.submitText
              ),
              h(
                AButton,
                { htmlType: 'button', onClick: () => form.resetFields() },
                () => props.resetText
              )
            ];
            if (props.collapsible) {
              btns.push(
                h(
                  AButton,
                  { type: 'link', onClick: () => (collapsed.value = !collapsed.value) },
                  () => (collapsed.value ? '展开 ∨' : '收起 ∧')
                )
              );
            }
            return btns;
          });
      return h(ACol, { flex: '1 1 auto', style: 'text-align:right' }, () => inner);
    }

    function renderGridBody() {
      let fields = collectFields(slots.default?.() ?? []);
      if (props.collapsible && collapsed.value) {
        const n = Math.max(1, props.collapsedRows * props.cols);
        fields = fields.slice(0, n);
      }
      const action = renderActionCol();
      return h(ARow, { gutter: props.gutter as any }, () =>
        action ? [...fields, action] : fields
      );
    }

    return () => {
      const formProps: Record<string, any> = {
        ref: formRef,
        model: form.formData,
        layout: props.layout,
        labelCol: labelCol.value,
        wrapperCol: props.wrapperCol,
        colon: props.colon,
        disabled: props.disabled,
        onFinish: () => form.submit(),
        onFinishFailed: (info: any) => form.options.onSubmitFailed?.(info),
        // 支持原生 <button html-type="reset"> 重置表单
        onReset: (e: Event) => {
          e?.preventDefault?.();
          form.resetFields();
        }
      };

      const body = props.grid
        ? renderGridBody()
        : [slots.default?.(), slots.action ? slots.action() : null];

      return h(AForm, formProps, () => body);
    };
  }
});
</script>
