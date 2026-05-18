<template>
  <div class="flex flex-col gap-[22px]">
    <a-card
      class="flex items-center justify-between gap-6 rounded-ant-lg bg-[radial-gradient(circle_at_top_left,rgba(var(--app-primary-rgb),0.16)_0%,transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.94)_0%,rgba(241,247,255,0.92)_100%)] shadow-app-soft max-[1180px]:flex-col max-[1180px]:items-start"
      variant="borderless"
    >
      <div class="flex-1">
        <a-space direction="vertical" :size="12">
          <a-tag color="processing" class="me-0">Dashboard</a-tag>
          <div>
            <h1 class="mb-2.5 text-[clamp(26px,3vw,38px)] leading-[1.1] text-app-text-primary">
              {{ overview?.greeting || '加载中...' }}
            </h1>
            <p class="max-w-[720px] text-[15px] leading-[1.8] text-app-text-secondary">
              {{ overview?.slogan || '正在为你组装今日经营概览。' }}
            </p>
          </div>
          <a-space wrap>
            <a-tag color="success">服务端菜单驱动</a-tag>
            <a-tag color="processing">Pinia 状态闭环</a-tag>
            <a-tag color="purple">Mock 联调模式</a-tag>
          </a-space>
        </a-space>
      </div>

      <a-card
        class="min-w-[260px] rounded-ant-lg max-[1180px]:w-full max-[1180px]:min-w-0"
        size="small"
      >
        <strong class="mb-2 block text-base text-app-text-primary">菜单模式</strong>
        <span class="text-[13px] leading-[1.7] text-app-text-secondary">
          当前导航由服务端直接返回菜单树驱动，不再依赖角色到菜单的本地映射。
        </span>
      </a-card>
    </a-card>

    <a-row :gutter="[18, 18]">
      <a-col v-for="item in overview?.metrics || []" :key="item.key" :xs="24" :sm="12" :xl="6">
        <a-card class="flex flex-col gap-3.5 rounded-ant-lg shadow-app-soft" variant="borderless">
          <a-statistic :title="item.label" :value="formatMetricValue(item.value)">
            <template #prefix>
              <span v-if="item.unit === '¥'">{{ item.unit }}</span>
            </template>
            <template #suffix>
              <span v-if="item.unit !== '¥'">{{ item.unit }}</span>
            </template>
          </a-statistic>
          <a-tag class="mt-2.5 w-fit" :color="item.trend < 0 ? 'error' : 'success'">
            {{ item.trend > 0 ? '+' : '' }}{{ item.trend }}%
          </a-tag>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[18, 18]">
      <a-col :xs="24" :xl="14">
        <a-card class="rounded-ant-lg shadow-app-soft" title="快捷入口" variant="borderless">
          <template #extra>
            <a-tag color="processing">常用业务动作</a-tag>
          </template>

          <div class="grid grid-cols-1 gap-3.5">
            <a-card
              v-for="item in overview?.quickLinks || []"
              :key="item.key"
              hoverable
              size="small"
              class="cursor-pointer rounded-ant-lg"
              @click="router.push(item.path)"
            >
              <a-space direction="vertical" :size="8">
                <strong class="text-[15px] text-app-text-primary">{{ item.title }}</strong>
                <span class="text-[13px] leading-[1.7] text-app-text-secondary">
                  {{ item.description }}
                </span>
                <a-button type="link" class="px-0">立即进入</a-button>
              </a-space>
            </a-card>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :xl="10">
        <a-card class="rounded-ant-lg shadow-app-soft" title="待办事项" variant="borderless">
          <template #extra>
            <a-tag color="warning">今日优先</a-tag>
          </template>

          <a-space direction="vertical" class="w-full" :size="12">
            <div
              v-for="todo in overview?.todos || []"
              :key="todo.id"
              class="flex items-center justify-between gap-4 border-b border-app-border py-4 last:border-b-0 last:pb-0 max-[720px]:flex-col max-[720px]:items-start"
            >
              <div class="flex flex-col gap-2">
                <strong class="text-[15px] text-app-text-primary">{{ todo.title }}</strong>
                <span class="text-[13px] leading-[1.7] text-app-text-secondary">
                  {{ todo.assignee }} · 截止 {{ todo.deadline }}
                </span>
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
