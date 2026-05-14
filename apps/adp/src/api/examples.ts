import { request } from '@/utils/request';

export interface ProFormProductOptionsParams {
  bizLine?: string;
  scenario?: string;
}

export interface ProFormProductOption {
  disabled?: boolean;
  label: string;
  stage: string;
  value: string;
}

export interface ProFormInsightPayload {
  bizLine?: string;
  budget?: number;
  channels?: string[];
  channel?: string;
  enableAdvance?: boolean;
  owner?: string;
  productId?: string;
  scenario?: string;
  strategyTone?: string;
  urgency?: string;
}

export interface ProFormInsightResult {
  action: string;
  highlights: string[];
  level: 'high' | 'low' | 'medium';
  metrics: Array<{
    label: string;
    value: string;
  }>;
  planName: string;
  summary: string;
}

export function fetchProFormProductOptionsApi(params: ProFormProductOptionsParams) {
  return request.get<ProFormProductOption[]>('/examples/pro-form/products', {
    params
  });
}

export function fetchProFormInsightsApi(payload: ProFormInsightPayload) {
  return request.post<ProFormInsightResult>('/examples/pro-form/insights', payload);
}
