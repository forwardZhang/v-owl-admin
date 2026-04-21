export interface DashboardMetric {
  key: string;
  label: string;
  value: string;
  trend: number;
  unit: string;
}

export interface DashboardQuickLink {
  key: string;
  title: string;
  description: string;
  path: string;
}

export interface DashboardTodo {
  id: string;
  title: string;
  assignee: string;
  deadline: string;
  level: 'high' | 'medium' | 'low';
}

export interface DashboardOverview {
  greeting: string;
  slogan: string;
  metrics: DashboardMetric[];
  quickLinks: DashboardQuickLink[];
  todos: DashboardTodo[];
}
