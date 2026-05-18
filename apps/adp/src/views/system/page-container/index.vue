<template>
  <ProPage v-model:active-key="activeKey" :tabs="tabs">
    <template #extra>
      <a-space wrap>
        <a-tag color="processing">ProPage</a-tag>
        <a-button>查看 README</a-button>
        <a-button type="primary">复制接入方式</a-button>
      </a-space>
    </template>

    <template #tab-label-slots>
      插槽能力
      <a-tag color="success">Priority</a-tag>
    </template>

    <template #tab-slots>
      <div class="flex flex-col gap-[18px]">
        <a-row :gutter="[18, 18]">
          <a-col :xs="24" :lg="14">
            <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
              <span
                class="inline-flex h-[26px] items-center rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-2.5 text-xs font-bold uppercase tracking-[0.08em] text-app-primary"
              >
                Dynamic Slots
              </span>
              <h3 class="mb-2.5 mt-3.5 text-[22px] text-app-text-primary">顶部和内容都能插</h3>
              <p class="leading-[1.8] text-app-text-secondary">
                这个组件给多 tabs 模式留了两类动态插槽：`tab-label-[key]` 控 tab 标题，`tab-[key]`
                控 tab 内容。复杂页面可以局部定制，简单页面继续走配置式。
              </p>

              <div
                class="mt-[18px] flex flex-col gap-2.5 rounded-[18px] border border-app-border bg-slate-900 px-[18px] py-4"
              >
                <code class="text-[13px] leading-[1.7] text-blue-100">
                  &lt;template #tab-label-users&gt;用户列表&lt;/template&gt;
                </code>
                <code class="text-[13px] leading-[1.7] text-blue-100">
                  &lt;template #tab-users&gt;&lt;UsersPane /&gt;&lt;/template&gt;
                </code>
              </div>
            </a-card>
          </a-col>

          <a-col :xs="24" :lg="10">
            <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
              <span
                class="inline-flex h-[26px] items-center rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-2.5 text-xs font-bold uppercase tracking-[0.08em] text-app-primary"
              >
                Resolution
              </span>
              <h3 class="mb-2.5 mt-3.5 text-[22px] text-app-text-primary">内容优先级</h3>
              <p class="leading-[1.8] text-app-text-secondary">
                为了避免配置和插槽打架，tab 内容按下面顺序解析：
              </p>

              <div class="mt-4 flex flex-col gap-3">
                <div
                  v-for="item in priorities"
                  :key="item.title"
                  class="flex flex-col gap-1.5 rounded-[18px] border border-app-border bg-white/75 px-[18px] py-4"
                >
                  <strong class="text-base text-app-text-primary">{{ item.title }}</strong>
                  <span class="leading-[1.7] text-app-text-secondary">{{ item.description }}</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <a-card class="rounded-ant-lg shadow-app-soft" variant="borderless">
          <div class="mb-5">
            <div>
              <span
                class="inline-flex h-[26px] items-center rounded-full bg-[rgba(var(--app-primary-rgb),0.1)] px-2.5 text-xs font-bold uppercase tracking-[0.08em] text-app-primary"
              >
                Use Case
              </span>
              <h3 class="mb-2.5 mt-3.5 text-[22px] text-app-text-primary">适合这几类页面</h3>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div
              v-for="item in useCases"
              :key="item.title"
              class="flex flex-col gap-1.5 rounded-[18px] border border-app-border bg-white/75 px-[18px] py-4"
            >
              <strong class="text-base text-app-text-primary">{{ item.title }}</strong>
              <p class="leading-[1.8] text-app-text-secondary">{{ item.description }}</p>
            </div>
          </div>
        </a-card>
      </div>
    </template>
  </ProPage>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ProPage } from '@owl/components';
import type { ProPageTabItem } from '@owl/components';
import OverviewPane from './components/overview-pane.vue';
import PlaygroundPane from './components/playground-pane.vue';

const activeKey = ref('overview');

const priorities = [
  {
    description: '最适合复杂业务场景，自定义自由度最高。',
    title: '1. #tab-[key]'
  },
  {
    description: '适合结构稳定、直接映射组件的场景。',
    title: '2. tab.component'
  },
  {
    description: '两者都没有时，给出明确的空状态，而不是静默发呆。',
    title: '3. Empty'
  }
];

const useCases = [
  {
    description: '一个页面下挂多个配置面板，顶部切换即可完成不同域的设置。',
    title: '系统配置中心'
  },
  {
    description:
      '用户、商家、订单这类详情页，顶部可以承载“概览 / 日志 / 权限 / 关联记录”等多个面板。',
    title: '详情页容器'
  },
  {
    description: '需要统一页面气质，但又不想让每个页面都重复手搓 hero 区和操作栏。',
    title: '后台通用页面骨架'
  }
];

const tabs: ProPageTabItem[] = [
  {
    component: OverviewPane,
    key: 'overview',
    title: '组件概览'
  },
  {
    key: 'slots',
    title: '插槽能力'
  },
  {
    component: PlaygroundPane,
    key: 'playground',
    title: '组合示例'
  }
];
</script>
