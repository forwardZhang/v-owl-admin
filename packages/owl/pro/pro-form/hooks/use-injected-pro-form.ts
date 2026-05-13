import { useInjectProForm } from '../create-pro-form';

export function useInjectedProForm() {
  const form = useInjectProForm();

  if (!form) {
    /**
     * 字段组件必须工作在 ProForm 注入上下文中，
     * 否则无法拿到共享的 values / validate / reset 能力。
     */
    throw new Error('Pro field components must be used inside <ProForm>.');
  }

  return form;
}
