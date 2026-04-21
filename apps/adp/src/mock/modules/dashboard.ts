import type { MockRoute } from '../server';
import { isValidToken } from './auth';

export const dashboardMockRoutes: MockRoute[] = [
  {
    method: 'GET',
    path: '/dashboard/overview',
    handler: ({ token }) => {
      if (!isValidToken(token)) {
        return {
          code: 40102,
          message: '需要先登录后再获取看板数据',
          data: null
        };
      }

      return {
        code: 0,
        message: '获取成功',
        data: {
          greeting: '下午好，欢迎回到中台驾驶舱',
          slogan: '把复杂业务收束成可感知的秩序，这就是优秀后台的浪漫。',
          metrics: [
            {
              key: 'orders',
              label: '今日订单额',
              value: '286,430',
              trend: 12.8,
              unit: '¥'
            },
            {
              key: 'conversion',
              label: '支付转化率',
              value: '68.4',
              trend: 4.2,
              unit: '%'
            },
            {
              key: 'users',
              label: '新增活跃用户',
              value: '1,286',
              trend: 8.6,
              unit: '人'
            },
            {
              key: 'tickets',
              label: '待处理工单',
              value: '23',
              trend: -6.4,
              unit: '条'
            }
          ],
          quickLinks: [
            {
              key: 'goods',
              title: '商品审核',
              description: '快速进入待审核商品列表，处理上架流转。',
              path: '/dashboard'
            },
            {
              key: 'order',
              title: '订单排查',
              description: '查看异常订单与履约节点，方便联动客服排障。',
              path: '/dashboard'
            },
            {
              key: 'report',
              title: '经营报表',
              description: '聚焦 GMV、转化和客单趋势，辅助日常复盘。',
              path: '/dashboard'
            }
          ],
          todos: [
            {
              id: 'todo_1',
              title: '华东大区活动页发布复核',
              assignee: '运营中台',
              deadline: '今天 18:30',
              level: 'high'
            },
            {
              id: 'todo_2',
              title: '供应链接口 2.1 版本联调验收',
              assignee: '技术平台',
              deadline: '明天 11:00',
              level: 'medium'
            },
            {
              id: 'todo_3',
              title: '财务对账看板字段补充',
              assignee: '数据团队',
              deadline: '本周五',
              level: 'low'
            }
          ]
        }
      };
    }
  }
];
