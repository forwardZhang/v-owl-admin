import type { Component } from 'vue';

export interface PageContainerTabItem<
  TProps extends Record<string, unknown> = Record<string, unknown>
> {
  key: string;
  title: string;
  component?: Component;
  props?: TProps;
}
