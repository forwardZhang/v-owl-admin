import type { Component } from 'vue';
import ProInput from '../input/index.vue';
import ProInputNumber from '../input-number/index.vue';
import ProInputPassword from '../input-password/index.vue';
import ProTextarea from '../textarea/index.vue';
import ProAutoComplete from '../auto-complete/index.vue';
import ProSelect from '../select/index.vue';
import ApiSelect from '../api-select/index.vue';
import ProTreeSelect from '../tree-select/index.vue';
import ApiTreeSelect from '../api-tree-select/index.vue';
import ProCascader from '../cascader/index.vue';
import ProRadioGroup from '../radio-group/index.vue';
import ProCheckboxGroup from '../checkbox-group/index.vue';
import ProCheckbox from '../checkbox/index.vue';
import ProSwitch from '../switch/index.vue';
import ProDatePicker from '../date-picker/index.vue';
import ProRangePicker from '../range-picker/index.vue';
import ProTimePicker from '../time-picker/index.vue';
import ProSlider from '../slider/index.vue';
import ProRate from '../rate/index.vue';
import type { ProFormComponent, ProFormComponentType } from '../../types';

/**
 * 所有字段「组件实例」集中注册表：内置名 -> 本地封装组件。
 * 每个组件都在 components/<name>/index.vue 下，新增时建文件夹 + 在此登记一行即可。
 */
export const componentMap: Record<ProFormComponentType, Component> = {
  Input: ProInput,
  InputNumber: ProInputNumber,
  InputPassword: ProInputPassword,
  Textarea: ProTextarea,
  AutoComplete: ProAutoComplete,
  Select: ProSelect,
  ApiSelect,
  TreeSelect: ProTreeSelect,
  ApiTreeSelect,
  Cascader: ProCascader,
  RadioGroup: ProRadioGroup,
  CheckboxGroup: ProCheckboxGroup,
  Checkbox: ProCheckbox,
  Switch: ProSwitch,
  DatePicker: ProDatePicker,
  RangePicker: ProRangePicker,
  TimePicker: ProTimePicker,
  Slider: ProSlider,
  Rate: ProRate
};

/** 各组件 v-model 绑定的 prop 名（多数 value，Switch / Checkbox 为 checked） */
const valuePropNameMap: Partial<Record<ProFormComponentType, string>> = {
  Switch: 'checked',
  Checkbox: 'checked'
};

/** 取得组件对应的 v-model prop 名（默认 value） */
export function getValuePropName(component: ProFormComponent): string {
  if (typeof component === 'string') {
    return valuePropNameMap[component as ProFormComponentType] ?? 'value';
  }
  return 'value';
}

/** 把 schema.component 解析为真正的 Vue 组件 */
export function resolveComponent(component: ProFormComponent): Component {
  if (typeof component === 'string') {
    const comp = componentMap[component as ProFormComponentType];
    if (!comp) {
      console.warn(`[ProForm] 未知组件名 "${component}"，请改用内置名或直接传入组件。`);
    }
    return comp ?? ProInput;
  }
  return component;
}

const FULL_WIDTH_COMPONENTS: ProFormComponentType[] = [
  'Select',
  'ApiSelect',
  'TreeSelect',
  'ApiTreeSelect',
  'Cascader',
  'DatePicker',
  'RangePicker',
  'TimePicker'
];

/** 这些组件默认占满宽度，避免在表单里显得过窄 */
export function isFullWidthComponent(component: ProFormComponent): boolean {
  if (typeof component !== 'string') return false;
  return FULL_WIDTH_COMPONENTS.includes(component as ProFormComponentType);
}
