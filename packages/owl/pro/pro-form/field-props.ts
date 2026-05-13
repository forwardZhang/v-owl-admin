import type { PropType } from 'vue';
import type {
  ProChoiceFieldProps,
  ProFieldComponentProps,
  ProFieldProps,
  ProFieldRequest
} from './types';

export const baseFieldProps = {
  formItemProps: {
    type: Object as PropType<ProFieldComponentProps['formItemProps']>,
    default: undefined
  },
  hidden: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: undefined
  },
  name: {
    type: [String, Number, Array] as PropType<ProFieldComponentProps['name']>,
    required: true
  },
  placeholder: {
    type: String,
    default: undefined
  }
} as const;

export const choiceFieldProps = {
  ...baseFieldProps,
  options: {
    type: Array as PropType<ProChoiceFieldProps['options']>,
    default: undefined
  },
  request: {
    type: Function as PropType<ProFieldRequest>,
    default: undefined
  },
  dependencies: {
    type: Array as PropType<ProChoiceFieldProps['dependencies']>,
    default: undefined
  }
} as const;

export const proFieldProps = {
  fieldProps: {
    type: Object as PropType<ProFieldProps['fieldProps']>,
    default: undefined
  },
  ...choiceFieldProps
} as const;
