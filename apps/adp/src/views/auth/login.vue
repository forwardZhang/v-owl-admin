<template>
  <div
    class="login-page relative grid min-h-screen grid-cols-[minmax(0,1.2fr)_minmax(420px,0.8fr)] overflow-hidden max-[1180px]:grid-cols-1"
  >
    <section
      class="relative z-[1] flex flex-col justify-center gap-6 px-[7vw] py-14 pb-14 max-[1180px]:pb-3 max-[640px]:px-[18px]"
    >
      <span
        class="inline-flex h-[34px] w-fit items-center rounded-ant-lg bg-[rgba(var(--app-primary-rgb),0.12)] px-3.5 text-xs font-bold uppercase tracking-[0.08em] text-app-primary"
      >
        Production Ready
      </span>
      <h1
        class="max-w-[680px] text-[clamp(36px,4.6vw,64px)] leading-[1.06] tracking-normal text-app-text-primary"
      >
        把复杂权限、菜单和数据流，收成一套顺手的中台骨架。
      </h1>
      <p class="max-w-[620px] text-base leading-[1.8] text-app-text-secondary">
        这套初始化底座已经串好了主题、动态菜单、路由守卫、Pinia 和 Mock 请求。
        后面接真实后端时，基本就是替换接口，不是推倒重来。
      </p>

      <div class="grid grid-cols-3 gap-4 max-[1180px]:grid-cols-1">
        <article
          class="flex flex-col gap-2.5 rounded-ant-lg border border-white/60 bg-white/70 px-5 py-[22px] shadow-app-soft backdrop-blur-[18px]"
        >
          <strong class="text-[15px] text-app-text-primary">服务端菜单驱动</strong>
          <span class="text-[13px] leading-[1.7] text-app-text-secondary">
            前端只消费菜单树，不再根据角色写死匹配逻辑。
          </span>
        </article>
        <article
          class="flex flex-col gap-2.5 rounded-ant-lg border border-white/60 bg-white/70 px-5 py-[22px] shadow-app-soft backdrop-blur-[18px]"
        >
          <strong class="text-[15px] text-app-text-primary">真实感 Mock</strong>
          <span class="text-[13px] leading-[1.7] text-app-text-secondary">
            模拟延迟、Token 校验和接口状态码，联调体验更像线上。
          </span>
        </article>
        <article
          class="flex flex-col gap-2.5 rounded-ant-lg border border-white/60 bg-white/70 px-5 py-[22px] shadow-app-soft backdrop-blur-[18px]"
        >
          <strong class="text-[15px] text-app-text-primary">统一主题令牌</strong>
          <span class="text-[13px] leading-[1.7] text-app-text-secondary">
            颜色、阴影、边框和层级都走全局变量，后续扩展换肤更丝滑。
          </span>
        </article>
      </div>
    </section>

    <section class="relative z-[1] grid place-items-center p-8 max-[640px]:px-[18px]">
      <a-card
        class="w-full max-w-[440px] overflow-hidden rounded-ant-lg shadow-app-medium"
        variant="borderless"
      >
        <div class="mb-7">
          <a-tag color="processing">欢迎回来</a-tag>
          <h2 class="mb-3 mt-2.5 text-3xl leading-[1.1] text-app-text-primary">登录 V Owl Admin</h2>
          <p class="text-sm leading-[1.7] text-app-text-tertiary">
            演示账号已预填，直接登录即可体验完整流程。
          </p>
        </div>

        <a-alert class="mb-4" type="info" show-icon message="体验账号：admin / Admin123" />

        <a-alert v-if="errorMessage" class="mb-4" type="error" show-icon :message="errorMessage" />

        <a-form class="mt-5" layout="vertical" :model="form" :rules="rules" @finish="handleSubmit">
          <a-form-item label="用户名" name="username">
            <a-input
              v-model:value="form.username"
              autocomplete="username"
              placeholder="请输入用户名"
              size="large"
            />
          </a-form-item>

          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="form.password"
              autocomplete="current-password"
              placeholder="请输入密码"
              size="large"
            />
          </a-form-item>

          <a-form-item class="mb-0">
            <a-button block html-type="submit" size="large" type="primary" :loading="submitting">
              进入控制台
            </a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { FormProps } from 'antdv-next';
import { useRoute, useRouter } from 'vue-router';
import { HOME_PATH } from '@/constants/app';
import { useUserStore } from '@/store/modules/user';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  username: 'admin',
  password: 'Admin123'
});

const submitting = ref(false);
const errorMessage = ref('');
const rules: FormProps['rules'] = {
  password: [
    {
      message: '请输入密码',
      required: true
    }
  ],
  username: [
    {
      message: '请输入用户名',
      required: true
    }
  ]
};

async function handleSubmit() {
  try {
    submitting.value = true;
    errorMessage.value = '';

    await userStore.login({
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
.login-page::before,
.login-page::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(10px);
  z-index: 0;
}

.login-page::before {
  top: -120px;
  left: -90px;
  width: 360px;
  height: 360px;
  background: rgba(var(--app-primary-rgb), 0.18);
}

.login-page::after {
  right: -80px;
  bottom: -60px;
  width: 300px;
  height: 300px;
  background: rgba(67, 196, 255, 0.16);
}
</style>
