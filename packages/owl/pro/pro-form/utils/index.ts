import type {
  BaseFormComponentType,
  BuiltinComponentProps,
  DynamicFormContext,
  FormApi,
  FormSchema,
  MaybeDynamic,
  ProFormNamePath,
  RenderContent
} from '../types';
import type { VNodeChild } from 'vue';

import { get, isFunction, mergeWith } from 'lodash-es';

export function normalizeNamePath(name: ProFormNamePath): Array<string | number> {
  if (Array.isArray(name)) {
    return name;
  }

  if (typeof name === 'number') {
    return [name];
  }

  return name.split('.').filter(Boolean);
}

export function createFieldContext<TValues extends Record<string, unknown>>({
  api,
  schema
}: {
  api: FormApi<TValues>;
  schema: FormSchema<BaseFormComponentType, BuiltinComponentProps, TValues>;
}): DynamicFormContext<TValues> {
  return {
    api,
    fieldName: schema.fieldName,
    schema,
    value: get(api.values, normalizeNamePath(schema.fieldName)),
    values: api.values
  };
}

export function resolveMaybe<TValues extends Record<string, unknown>, TValue>({
  api,
  schema,
  value
}: {
  api: FormApi<TValues>;
  schema: FormSchema<BaseFormComponentType, BuiltinComponentProps, TValues>;
  value: MaybeDynamic<TValue, TValues> | undefined;
}) {
  return isFunction(value) ? value(createFieldContext({ api, schema })) : value;
}

export function mergeProps(source: Record<string, unknown>, target: Record<string, unknown> = {}) {
  return mergeWith({}, target, source, (objValue, srcValue) => {
    if (Array.isArray(objValue) || Array.isArray(srcValue)) {
      return srcValue;
    }

    return undefined;
  });
}

export function renderContent(content: RenderContent | undefined): VNodeChild {
  if (!content) {
    return undefined;
  }

  if (isFunction(content)) {
    return (content as () => VNodeChild)();
  }

  return content as VNodeChild;
}
