import type { MockRoute } from '../server';
import { isValidToken } from './auth';

interface ProductOption {
  label: string;
  stage: string;
  value: string;
}

const productPools: Record<string, ProductOption[]> = {
  commerce: [
    { label: '会员增长包', stage: '稳定运营', value: 'commerce-growth' },
    { label: '直播转化链路', stage: '灰度中', value: 'commerce-live' },
    { label: '复购激励方案', stage: '实验中', value: 'commerce-repeat' }
  ],
  finance: [
    { label: '账务对账助手', stage: '稳定运营', value: 'finance-reconcile' },
    { label: '授信风险看板', stage: '灰度中', value: 'finance-risk' },
    { label: '资金预测模型', stage: '内测中', value: 'finance-forecast' }
  ],
  supply: [
    { label: '仓配协同台', stage: '稳定运营', value: 'supply-dispatch' },
    { label: '库存预警策略', stage: '灰度中', value: 'supply-stock' },
    { label: '履约成本地图', stage: '实验中', value: 'supply-cost' }
  ]
};

function normalizeParam(params: unknown, key: string) {
  if (!params || typeof params !== 'object') {
    return '';
  }

  const value = (params as Record<string, string | string[]>)[key];

  return Array.isArray(value) ? value[0] : value || '';
}

function resolveProducts(params: unknown) {
  const bizLine = normalizeParam(params, 'bizLine') || 'commerce';
  const scenario = normalizeParam(params, 'scenario');
  const pool = productPools[bizLine] ?? productPools.commerce;

  if (scenario === 'risk') {
    return pool.map((item, index) => ({
      ...item,
      disabled: index === 2,
      label: `${item.label} / 风险版`
    }));
  }

  if (scenario === 'growth') {
    return pool.map((item) => ({
      ...item,
      label: `${item.label} / 增长版`
    }));
  }

  return pool;
}

function resolveInsight(data: unknown) {
  const payload = (data || {}) as Record<string, unknown>;
  const bizLine = String(payload.bizLine || 'commerce');
  const scenario = String(payload.scenario || 'growth');
  const urgency = String(payload.urgency || 'normal');
  const budget = Number(payload.budget || 0);
  const enableAdvance = Boolean(payload.enableAdvance);

  const bizNameMap: Record<string, string> = {
    commerce: '电商业务',
    finance: '金融业务',
    supply: '供应链业务'
  };
  const scenarioMap: Record<string, string> = {
    delivery: '交付效率',
    growth: '增长转化',
    risk: '风险控制'
  };

  const level = urgency === 'urgent' || budget >= 80 ? 'high' : budget >= 40 ? 'medium' : 'low';
  const planName = `${bizNameMap[bizLine] ?? '通用业务'} · ${scenarioMap[scenario] ?? '增长转化'}方案`;

  return {
    action:
      level === 'high'
        ? '建议进入专项评审，并拆出灰度发布计划。'
        : '建议按常规节奏推进，保留每周复盘节点。',
    highlights: [
      enableAdvance
        ? '已开启高级策略，表单动态展示了预算和负责人字段。'
        : '当前为轻量模式，隐藏高级配置以降低填写成本。',
      scenario === 'risk'
        ? '风险场景会返回带禁用项的产品候选。'
        : '当前场景会返回可直接选择的产品候选。',
      `远程接口根据 ${bizLine}/${scenario}/${urgency} 组合生成了不同结论。`
    ],
    level,
    metrics: [
      {
        label: '预估周期',
        value: level === 'high' ? '21 天' : '10 天'
      },
      {
        label: '推荐人力',
        value: enableAdvance ? '4 人' : '2 人'
      },
      {
        label: '预算等级',
        value: budget >= 80 ? '高' : budget >= 40 ? '中' : '低'
      }
    ],
    planName,
    summary: `${planName} 已按当前条件生成，紧急度为 ${urgency === 'urgent' ? '加急' : '常规'}。`
  };
}

export const examplesMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/examples/pro-form/products',
    handler: ({ params, token }) => {
      if (!isValidToken(token)) {
        return {
          code: 40102,
          data: null,
          message: '用户登录态失效，无法获取产品候选'
        };
      }

      return {
        code: 0,
        data: resolveProducts(params),
        message: '获取产品候选成功'
      };
    }
  },
  {
    method: 'POST',
    path: '/examples/pro-form/insights',
    handler: ({ data, token }) => {
      if (!isValidToken(token)) {
        return {
          code: 40102,
          data: null,
          message: '用户登录态失效，无法生成方案'
        };
      }

      return {
        code: 0,
        data: resolveInsight(data),
        message: '生成方案成功'
      };
    }
  }
];
