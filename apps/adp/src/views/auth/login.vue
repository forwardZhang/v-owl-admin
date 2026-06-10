<template>
  <div class="login-page relative flex min-h-screen overflow-hidden bg-app-bg-page">
    <!-- 左侧品牌叙事 -->
    <aside class="brand-panel relative hidden w-[58%] flex-col px-[5vw] py-12 lg:flex">
      <!-- 顶部 Logo -->
      <a-flex align="center" :gap="12" class="relative z-[1]">
        <a-avatar :size="40" class="brand-mark text-sm font-bold tracking-[0.06em]">VO</a-avatar>
        <strong class="text-lg font-semibold text-app-text-primary">{{ APP_TITLE }}</strong>
      </a-flex>

      <!-- 居中插画与文案 -->
      <div
        class="relative z-[1] flex flex-1 flex-col gap-4 items-center justify-center text-center"
      >
        <img :src="heroImage" alt="hero" class="hero-img w-[clamp(240px,20vw,420px)]" />
        <h1 class="mt-20 text-[clamp(26px,2.6vw,38px)] font-bold text-app-text-primary">
          开箱即用的大型中后台管理系统
        </h1>
        <p class="mt-3 text-base text-app-text-tertiary">工程化、高性能、跨组件库的前端模版</p>
      </div>
    </aside>

    <!-- 右侧登录区 -->
    <main class="relative flex flex-1 items-center justify-center px-5 py-12 sm:px-10">
      <!-- 右上角工具栏 -->
      <div
        class="toolbar absolute right-5 top-5 z-10 flex items-center gap-1.5 sm:right-8 sm:top-7"
      >
        <a-tooltip title="主题色">
          <a-button shape="circle" class="tool-btn" @click="cyclePrimaryColor">
            <template #icon><bg-colors-outlined /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip title="语言">
          <a-button shape="circle" class="tool-btn" @click="info('多语言切换敬请期待')">
            <template #icon><translation-outlined /></template>
          </a-button>
        </a-tooltip>
        <a-tooltip :title="appStore.isDark ? '切换浅色' : '切换深色'">
          <a-button shape="circle" class="tool-btn" @click="appStore.toggleColorScheme()">
            <template #icon>
              <sun-outlined v-if="appStore.isDark" />
              <moon-outlined v-else />
            </template>
          </a-button>
        </a-tooltip>
      </div>

      <div class="w-full max-w-[400px]">
        <!-- 移动端顶部 Logo -->
        <div class="mb-8 flex items-center gap-2.5 lg:hidden">
          <a-avatar :size="36" class="brand-mark text-xs font-bold tracking-[0.06em]">VO</a-avatar>
          <strong class="text-base font-semibold text-app-text-primary">{{ APP_TITLE }}</strong>
        </div>

        <h2
          class="flex items-center gap-2 text-[28px] font-bold leading-tight text-app-text-primary"
        >
          欢迎回来 <span class="wave">👋</span>
        </h2>
        <p class="mt-2 text-sm text-app-text-tertiary">请输入您的账户信息以开始管理您的项目</p>

        <a-alert v-if="errorMessage" class="mt-5" type="error" show-icon :message="errorMessage" />

        <a-form class="mt-6" layout="vertical" :model="form" :rules="rules" @finish="handleSubmit">
          <a-form-item class="mb-4">
            <a-select
              v-model:value="selectedAccount"
              size="large"
              placeholder="快速选择账号"
              :options="accountOptions"
              @change="handleAccountChange"
            />
          </a-form-item>

          <a-form-item name="username" class="mb-4">
            <a-input
              v-model:value="form.username"
              autocomplete="username"
              placeholder="请输入用户名"
              size="large"
            >
              <template #prefix>
                <user-outlined class="text-app-text-quaternary" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" class="mb-4">
            <a-input-password
              v-model:value="form.password"
              autocomplete="current-password"
              placeholder="密码"
              size="large"
            >
              <template #prefix>
                <lock-outlined class="text-app-text-quaternary" />
              </template>
            </a-input-password>
          </a-form-item>

          <div class="mb-5 flex items-center justify-between">
            <a-checkbox v-model:checked="rememberMe" class="text-app-text-secondary">
              记住账号
            </a-checkbox>
            <a class="text-sm text-app-primary" @click="info('请联系管理员重置密码')">忘记密码?</a>
          </div>

          <a-button block html-type="submit" size="large" type="primary" :loading="submitting">
            登录
          </a-button>

          <div class="mt-4 grid grid-cols-2 gap-3">
            <a-button size="large" @click="info('手机号登录敬请期待')">手机号登录</a-button>
            <a-button size="large" @click="info('扫码登录敬请期待')">扫码登录</a-button>
          </div>
        </a-form>

        <div class="flex items-center justify-center gap-5">
          <button
            v-for="social in socials"
            :key="social.title"
            type="button"
            class="social-btn"
            :title="social.title"
            @click="info(`${social.title} 登录敬请期待`)"
          >
            <component :is="social.icon" />
          </button>
        </div>

        <p class="mt-7 text-center text-sm text-app-text-tertiary">
          还没有账号?
          <a class="text-app-primary" @click="info('请联系管理员开通账号')">创建账号</a>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  BgColorsOutlined,
  GithubOutlined,
  GoogleOutlined,
  LockOutlined,
  MoonOutlined,
  QqOutlined,
  SunOutlined,
  TranslationOutlined,
  UserOutlined,
  WechatOutlined
} from '@antdv-next/icons';
import { reactive, ref } from 'vue';
import { message } from 'antdv-next';
import type { FormProps } from 'antdv-next';
import { useRoute, useRouter } from 'vue-router';
import heroImage from '@/assets/hero.png';
import { APP_TITLE, HOME_PATH } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useAuthStore } from '@/store/modules/auth';

const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

const socials = [
  { icon: WechatOutlined, title: '微信' },
  { icon: QqOutlined, title: 'QQ' },
  { icon: GithubOutlined, title: 'GitHub' },
  { icon: GoogleOutlined, title: 'Google' }
];

// 演示账号均映射到可用的 admin / Admin123
const accountOptions = [
  { label: '超级管理员 admin', value: 'admin', password: 'Admin123' },
  { label: '管理员 manager', value: 'manager', password: 'Admin123' }
];

const selectedAccount = ref<string>();
const rememberMe = ref(true);

const form = reactive({
  username: 'admin',
  password: 'Admin123'
});

const submitting = ref(false);
const errorMessage = ref('');
const rules: FormProps['rules'] = {
  username: [{ message: '请输入用户名', required: true }],
  password: [{ message: '请输入密码', required: true }]
};

const PRIMARY_PALETTE = ['#1677ff', '#7c3aed', '#0ea5e9', '#16a34a', '#f5222d', '#fa8c16'];

function info(text: string) {
  message.info(text);
}

function cyclePrimaryColor() {
  const current = PRIMARY_PALETTE.indexOf(appStore.primaryColor);
  const next = PRIMARY_PALETTE[(current + 1) % PRIMARY_PALETTE.length];
  appStore.setPrimaryColor(next);
}

function handleAccountChange(value: string) {
  const matched = accountOptions.find((item) => item.value === value);
  if (matched) {
    form.username = matched.value;
    form.password = matched.password;
  }
}

async function handleSubmit() {
  try {
    submitting.value = true;
    errorMessage.value = '';

    await authStore.authLogin({
      password: form.password,
      username: form.username
    });

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : HOME_PATH;
    router.replace(redirect);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped lang="less">
.brand-panel {
  background:
    radial-gradient(120% 120% at 100% 0%, rgba(var(--app-primary-rgb), 0.12) 0%, transparent 55%),
    radial-gradient(120% 120% at 0% 100%, rgba(124, 58, 237, 0.12) 0%, transparent 55%),
    var(--app-surface-subtle);
}

.brand-panel::before,
.brand-panel::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  z-index: 0;
}

.brand-panel::before {
  top: -120px;
  left: -80px;
  width: 360px;
  height: 360px;
  background: rgba(var(--app-primary-rgb), 0.25);
}

.brand-panel::after {
  right: -100px;
  bottom: -60px;
  width: 320px;
  height: 320px;
  background: rgba(124, 58, 237, 0.18);
}

.brand-mark {
  background-image: linear-gradient(135deg, var(--app-primary) 0%, #43c4ff 100%) !important;
  background-color: transparent !important;
  color: #fff;
}

.hero-img {
  filter: drop-shadow(0 24px 48px rgba(18, 36, 61, 0.18));
  animation: float 6s ease-in-out infinite;
}

.wave {
  display: inline-block;
  transform-origin: 70% 70%;
  animation: wave 2.4s ease-in-out infinite;
}

.tool-btn {
  background: var(--app-surface);
  border-color: var(--app-border);
  box-shadow: var(--app-shadow-soft);
}

.social-btn {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  font-size: 18px;
  color: var(--app-text-tertiary);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  transition:
    color 0.2s ease,
    transform 0.2s ease,
    border-color 0.2s ease;
}

.social-btn:hover {
  color: var(--app-primary);
  border-color: var(--app-primary);
  transform: translateY(-2px);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-14px);
  }
}

@keyframes wave {
  0%,
  60%,
  100% {
    transform: rotate(0deg);
  }
  10%,
  30% {
    transform: rotate(14deg);
  }
  20% {
    transform: rotate(-8deg);
  }
}
</style>
