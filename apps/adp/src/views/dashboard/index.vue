<template>
  <div class="dashboard-page">
    <a-card class="dashboard-hero" variant="borderless">
      <div class="dashboard-hero__content">
        <a-space direction="vertical" :size="12">
          <a-tag color="processing" class="dashboard-hero__eyebrow">Dashboard</a-tag>
          <div>
            <h1>{{ overview?.greeting || '加载中...' }}</h1>
            <p>{{ overview?.slogan || '正在为你组装今日经营概览。' }}</p>
          </div>
          <a-space wrap>
            <a-tag color="success">服务端菜单驱动</a-tag>
            <a-tag color="processing">Pinia 状态闭环</a-tag>
            <a-tag color="purple">Mock 联调模式</a-tag>
          </a-space>
        </a-space>
      </div>

      <a-card class="dashboard-hero__badge" size="small">
        <strong>菜单模式</strong>
        <span>当前导航由服务端直接返回菜单树驱动，不再依赖角色到菜单的本地映射。</span>
      </a-card>
    </a-card>

    <a-row :gutter="[18, 18]">
      <a-col v-for="item in overview?.metrics || []" :key="item.key" :xs="24" :sm="12" :xl="6">
        <a-card class="metric-card" variant="borderless">
          <a-statistic :title="item.label" :value="formatMetricValue(item.value)">
            <template #prefix>
              <span v-if="item.unit === '¥'">{{ item.unit }}</span>
            </template>
            <template #suffix>
              <span v-if="item.unit !== '¥'">{{ item.unit }}</span>
            </template>
          </a-statistic>
          <a-tag class="metric-card__trend" :color="item.trend < 0 ? 'error' : 'success'">
            {{ item.trend > 0 ? '+' : '' }}{{ item.trend }}%
          </a-tag>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[18, 18]">
      <a-col :xs="24" :xl="14">
        <a-card class="dashboard-card" title="快捷入口" variant="borderless">
          <template #extra>
            <a-tag color="processing">常用业务动作</a-tag>
          </template>

          <div class="quick-links">
            <a-card
              v-for="item in overview?.quickLinks || []"
              :key="item.key"
              hoverable
              size="small"
              class="quick-link"
              @click="router.push(item.path)"
            >
              <a-space direction="vertical" :size="8">
                <strong>{{ item.title }}</strong>
                <span>{{ item.description }}</span>
                <a-button type="link" class="quick-link__action">立即进入</a-button>
              </a-space>
            </a-card>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :xl="10">
        <a-card class="dashboard-card" title="待办事项" variant="borderless">
          <template #extra>
            <a-tag color="warning">今日优先</a-tag>
          </template>

          <a-space direction="vertical" class="todo-list" :size="12">
            <div v-for="todo in overview?.todos || []" :key="todo.id" class="todo-item">
              <div class="todo-item__content">
                <strong>{{ todo.title }}</strong>
                <span>{{ todo.assignee }} · 截止 {{ todo.deadline }}</span>
              </div>
              <a-tag :color="todoTagColorMap[todo.level]">
                {{ levelLabelMap[todo.level] }}
              </a-tag>
            </div>
          </a-space>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchDashboardOverviewApi } from '@/api/dashboard';
import type { DashboardOverview } from '@/types/dashboard';

const router = useRouter();
const overview = ref<DashboardOverview | null>(null);

const levelLabelMap = {
  high: '高优先',
  low: '低优先',
  medium: '中优先'
} as const;

const todoTagColorMap = {
  high: 'error',
  low: 'processing',
  medium: 'warning'
} as const;

onMounted(async () => {
  overview.value = await fetchDashboardOverviewApi();
});

function formatMetricValue(value: string) {
  const nextValue = Number(value.replace(/,/g, ''));
  return Number.isNaN(nextValue) ? value : nextValue;
}
</script>

<style scoped lang="less">
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.dashboard-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-radius: 28px;
  background:
    radial-gradient(circle at top left, rgba(var(--app-primary-rgb), 0.16) 0%, transparent 34%),
    linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(241, 247, 255, 0.92) 100%);
  box-shadow: var(--app-shadow-soft);
}

.dashboard-hero__content {
  flex: 1;
}

.dashboard-hero__eyebrow {
  margin-inline-end: 0;
}

.dashboard-hero h1 {
  margin: 0 0 10px;
  color: var(--app-text-primary);
  font-size: clamp(26px, 3vw, 38px);
  line-height: 1.1;
}

.dashboard-hero p {
  max-width: 720px;
  margin: 0;
  color: var(--app-text-secondary);
  font-size: 15px;
  line-height: 1.8;
}

.dashboard-hero__badge {
  min-width: 260px;
  border-radius: 24px;
}

.dashboard-hero__badge strong {
  display: block;
  margin-bottom: 8px;
  color: var(--app-text-primary);
  font-size: 16px;
}

.dashboard-hero__badge span {
  color: var(--app-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.metric-card,
.dashboard-card {
  border-radius: 24px;
  box-shadow: var(--app-shadow-soft);
}

.metric-card {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.metric-card__trend {
  width: fit-content;
  margin-top: 10px;
}

.quick-links {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}

.quick-link {
  border-radius: 20px;
  cursor: pointer;
}

.quick-link strong,
.todo-item__content strong {
  color: var(--app-text-primary);
  font-size: 15px;
}

.quick-link span,
.todo-item__content span {
  color: var(--app-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.quick-link__action {
  padding-inline: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--app-border);
}

.todo-item:last-child {
  padding-bottom: 0;
  border-bottom: 0;
}

.todo-item__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.todo-item__tag {
  flex: none;
  min-width: 72px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  text-align: center;
}

.todo-item__tag--high {
  color: #b42318;
  background: rgba(180, 35, 24, 0.12);
}

.todo-item__tag--medium {
  color: #b54708;
  background: rgba(181, 71, 8, 0.12);
}

.todo-item__tag--low {
  color: #155eef;
  background: rgba(21, 94, 239, 0.12);
}

@media (max-width: 1180px) {
  .dashboard-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .dashboard-hero__badge {
    min-width: 0;
    width: 100%;
  }
}

@media (max-width: 720px) {
  .todo-item {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
