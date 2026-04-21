import type { DashboardOverview } from '@/types/dashboard';
import { request } from '@/utils/request';

export function fetchDashboardOverviewApi() {
  return request.get<DashboardOverview>('/dashboard/overview');
}
