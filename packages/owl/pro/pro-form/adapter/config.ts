import type { ApiComponentSharedProps, BaseFormComponentType } from '../types';
import type { Component } from 'vue';

import { defineAsyncComponent, defineComponent, h, ref, shallowReactive } from 'vue';

import ApiComponent from '../components/api-component.vue';

export type ProFormComponentMap = Partial<Record<BaseFormComponentType, Component>>;

export interface InitComponentAdapterOptions {
  baseModelPropName?: string;
  components?: ProFormComponentMap;
  modelPropNameMap?: Partial<Record<BaseFormComponentType, string>>;
}

const AutoComplete = defineAsyncComponent(() => import('antdv-next/dist/auto-complete/index'));
const Cascader = defineAsyncComponent(() => import('antdv-next/dist/cascader/index'));
const Checkbox = defineAsyncComponent(() => import('antdv-next/dist/checkbox/index'));
const CheckboxGroup = defineAsyncComponent(() =>
  import('antdv-next/dist/checkbox/index').then((res) => res.CheckboxGroup)
);
const DatePicker = defineAsyncComponent(() => import('antdv-next/dist/date-picker/index'));
const Input = defineAsyncComponent(() => import('antdv-next/dist/input/index'));
const InputNumber = defineAsyncComponent(() => import('antdv-next/dist/input-number/index'));
const InputPassword = defineAsyncComponent(() =>
  import('antdv-next/dist/input/index').then((res) => res.InputPassword)
);
const Radio = defineAsyncComponent(() => import('antdv-next/dist/radio/index'));
const RadioGroup = defineAsyncComponent(() =>
  import('antdv-next/dist/radio/index').then((res) => res.RadioGroup)
);
const RangePicker = defineAsyncComponent(() =>
  import('antdv-next/dist/date-picker/index').then((res) => res.DateRangePicker)
);
const Select = defineAsyncComponent(() => import('antdv-next/dist/select/index'));
const Switch = defineAsyncComponent(() => import('antdv-next/dist/switch/index'));
const Textarea = defineAsyncComponent(() =>
  import('antdv-next/dist/input/index').then((res) => res.TextArea)
);
const TimePicker = defineAsyncComponent(() => import('antdv-next/dist/time-picker/index'));
const TreeSelect = defineAsyncComponent(() => import('antdv-next/dist/tree-select/index'));

export const DEFAULT_MODEL_PROP_NAME = 'value';

export const COMPONENT_MAP = shallowReactive<ProFormComponentMap>({});

export const COMPONENT_MODEL_PROP_MAP = shallowReactive<
  Partial<Record<BaseFormComponentType, string>>
>({
  Checkbox: 'checked',
  Switch: 'checked'
});

export function withDefaultPlaceholder<T extends Component>(
  component: T,
  type: 'input' | 'select',
  componentProps: Record<string, unknown> = {}
) {
  return defineComponent({
    name: component.name,
    inheritAttrs: false,
    setup(props, { attrs, expose, slots }) {
      const innerRef = ref();

      expose(
        new Proxy(
          {},
          {
            get: (_target, key) => innerRef.value?.[key as never],
            has: (_target, key) => key in (innerRef.value || {})
          }
        )
      );

      return () => {
        const placeholder =
          (props as Record<string, unknown>).placeholder ??
          attrs.placeholder ??
          (type === 'input' ? '请输入' : '请选择');

        return h(
          component,
          {
            ...componentProps,
            ...props,
            ...attrs,
            placeholder,
            ref: innerRef
          },
          slots
        );
      };
    }
  });
}

function createApiComponentProps(
  component: Component,
  props: Partial<ApiComponentSharedProps> = {}
) {
  return {
    component,
    loadingSlot: 'suffixIcon',
    modelPropName: 'value',
    visibleEvent: 'onVisibleChange',
    ...props
  };
}

function getDefaultComponents(): ProFormComponentMap {
  return {
    ApiCascader: withDefaultPlaceholder(ApiComponent, 'select', {
      ...createApiComponentProps(Cascader, {
        childrenField: 'children'
      }),
      fieldNames: {
        children: 'children',
        label: 'label',
        value: 'value'
      }
    }),
    ApiSelect: withDefaultPlaceholder(ApiComponent, 'select', createApiComponentProps(Select)),
    ApiTreeSelect: withDefaultPlaceholder(ApiComponent, 'select', {
      ...createApiComponentProps(TreeSelect, {
        childrenField: 'children',
        optionsPropName: 'treeData'
      }),
      fieldNames: {
        children: 'children',
        label: 'label',
        value: 'value'
      }
    }),
    AutoComplete,
    Cascader: withDefaultPlaceholder(Cascader, 'select'),
    Checkbox,
    CheckboxGroup,
    DatePicker,
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    Radio,
    RadioGroup,
    RangePicker,
    Select: withDefaultPlaceholder(Select, 'select'),
    Switch,
    TextArea: withDefaultPlaceholder(Textarea, 'input'),
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select')
  };
}

export function registerFormComponents(components: ProFormComponentMap) {
  Object.assign(COMPONENT_MAP, components);
}

export function registerFormModelPropNames(
  modelPropNameMap: Partial<Record<BaseFormComponentType, string>>
) {
  Object.assign(COMPONENT_MODEL_PROP_MAP, modelPropNameMap);
}

export function initComponentAdapter(options: InitComponentAdapterOptions = {}) {
  const {
    baseModelPropName = DEFAULT_MODEL_PROP_NAME,
    components = {},
    modelPropNameMap = {}
  } = options;

  Object.keys(COMPONENT_MAP).forEach((key) => {
    Reflect.deleteProperty(COMPONENT_MAP, key);
  });

  Object.assign(COMPONENT_MAP, getDefaultComponents(), components);

  Object.keys(COMPONENT_MAP).forEach((componentName) => {
    const key = componentName as BaseFormComponentType;

    if (baseModelPropName !== DEFAULT_MODEL_PROP_NAME) {
      COMPONENT_MODEL_PROP_MAP[key] = baseModelPropName;
    }
  });

  Object.assign(COMPONENT_MODEL_PROP_MAP, {
    Checkbox: 'checked',
    Switch: 'checked',
    ...modelPropNameMap
  });
}

export function getFormComponent(type: BaseFormComponentType | string) {
  return COMPONENT_MAP[type as BaseFormComponentType];
}

export function getFormModelPropName(type: BaseFormComponentType | string) {
  return COMPONENT_MODEL_PROP_MAP[type as BaseFormComponentType] ?? DEFAULT_MODEL_PROP_NAME;
}

initComponentAdapter();
