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
      <div class="page-container-demo__panel">
        <a-row :gutter="[18, 18]">
          <a-col :xs="24" :lg="14">
            <a-card class="page-container-demo__card" variant="borderless">
              <span class="page-container-demo__eyebrow">Dynamic Slots</span>
              <h3>顶部和内容都能插</h3>
              <p>
                这个组件给多 tabs 模式留了两类动态插槽：`tab-label-[key]` 控 tab 标题，`tab-[key]`
                控 tab 内容。复杂页面可以局部定制，简单页面继续走配置式。
              </p>

              <div class="page-container-demo__code">
                <code>&lt;template #tab-label-users&gt;用户列表&lt;/template&gt;</code>
                <code>&lt;template #tab-users&gt;&lt;UsersPane /&gt;&lt;/template&gt;</code>
              </div>
            </a-card>
          </a-col>

          <a-col :xs="24" :lg="10">
            <a-card class="page-container-demo__card" variant="borderless">
              <span class="page-container-demo__eyebrow">Resolution</span>
              <h3>内容优先级</h3>
              <p>为了避免配置和插槽打架，tab 内容按下面顺序解析：</p>

              <div class="page-container-demo__priority">
                <div
                  v-for="item in priorities"
                  :key="item.title"
                  class="page-container-demo__priority-item"
                >
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.description }}</span>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <a-card class="page-container-demo__card" variant="borderless">
          <div class="page-container-demo__section-head">
            <div>
              <span class="page-container-demo__eyebrow">Use Case</span>
              <h3>适合这几类页面</h3>
            </div>
          </div>

          <div class="page-container-demo__cases">
            <div v-for="item in useCases" :key="item.title" class="page-container-demo__case">
              <strong>{{ item.title }}</strong>
              <p>{{ item.description }}</p>
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

<style scoped lang="less">
.page-container-demo__panel {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-container-demo__card {
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-soft);
}

.page-container-demo__eyebrow {
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(var(--app-primary-rgb), 0.1);
}

.page-container-demo__card h3 {
  margin: 14px 0 10px;
  color: var(--app-text-primary);
  font-size: 22px;
}

.page-container-demo__card p {
  margin: 0;
  color: var(--app-text-secondary);
  line-height: 1.8;
}

.page-container-demo__code {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 18px;
  padding: 16px 18px;
  border: 1px solid var(--app-border);
  border-radius: 18px;
  background: #0f172a;
}

.page-container-demo__code code {
  color: #dbeafe;
  font-size: 13px;
  line-height: 1.7;
}

.page-container-demo__priority {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.page-container-demo__priority-item,
.page-container-demo__case {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 18px;
  border: 1px solid var(--app-border);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.76);
}

.page-container-demo__priority-item strong,
.page-container-demo__case strong {
  color: var(--app-text-primary);
  font-size: 16px;
}

.page-container-demo__priority-item span {
  color: var(--app-text-secondary);
  line-height: 1.7;
}

.page-container-demo__section-head {
  margin-bottom: 20px;
}

.page-container-demo__cases {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

@media (max-width: 992px) {
  .page-container-demo__cases {
    grid-template-columns: 1fr;
  }
}
</style>
