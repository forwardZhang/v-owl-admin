<template>
  <div class="login-page">
    <section class="login-page__hero">
      <span class="login-page__badge">Production Ready</span>
      <h1>把复杂权限、菜单和数据流，收成一套顺手的中台骨架。</h1>
      <p>
        这套初始化底座已经串好了主题、动态菜单、路由守卫、Pinia 和 Mock 请求。
        后面接真实后端时，基本就是替换接口，不是推倒重来。
      </p>

      <div class="login-page__highlights">
        <article>
          <strong>服务端菜单驱动</strong>
          <span>前端只消费菜单树，不再根据角色写死匹配逻辑。</span>
        </article>
        <article>
          <strong>真实感 Mock</strong>
          <span>模拟延迟、Token 校验和接口状态码，联调体验更像线上。</span>
        </article>
        <article>
          <strong>统一主题令牌</strong>
          <span>颜色、阴影、边框和层级都走全局变量，后续扩展换肤更丝滑。</span>
        </article>
      </div>
    </section>

    <section class="login-page__panel">
      <a-card class="login-card" variant="borderless">
        <div class="login-card__header">
          <a-tag color="processing">欢迎回来</a-tag>
          <h2>登录 V Owl Admin</h2>
          <p>演示账号已预填，直接登录即可体验完整流程。</p>
        </div>

        <a-alert
          class="login-card__tip"
          type="info"
          show-icon
          message="体验账号：admin / Admin123"
        />

        <a-alert
          v-if="errorMessage"
          class="login-card__tip"
          type="error"
          show-icon
          :message="errorMessage"
        />

        <a-form
          class="login-card__form"
          layout="vertical"
          :model="form"
          :rules="rules"
          @finish="handleSubmit"
        >
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

          <a-form-item class="login-card__actions">
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
.login-page {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(420px, 0.8fr);
  min-height: 100vh;
  overflow: hidden;
}

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

.login-page__hero,
.login-page__panel {
  position: relative;
  z-index: 1;
}

.login-page__hero {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  padding: 56px 7vw;
}

.login-page__badge {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  height: 34px;
  padding: 0 14px;
  border-radius: var(--ant-border-radius-lg);
  color: var(--app-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(var(--app-primary-rgb), 0.12);
}

.login-page__hero h1 {
  max-width: 680px;
  margin: 0;
  color: var(--app-text-primary);
  font-size: clamp(36px, 4.6vw, 64px);
  line-height: 1.06;
  letter-spacing: -0.04em;
}

.login-page__hero p {
  max-width: 620px;
  margin: 0;
  color: var(--app-text-secondary);
  font-size: 16px;
  line-height: 1.8;
}

.login-page__highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.login-page__highlights article {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 22px 20px;
  border: 1px solid rgba(255, 255, 255, 0.56);
  border-radius: var(--ant-border-radius-lg);
  background: rgba(255, 255, 255, 0.72);
  box-shadow: var(--app-shadow-soft);
  backdrop-filter: blur(18px);
}

.login-page__highlights strong {
  color: var(--app-text-primary);
  font-size: 15px;
}

.login-page__highlights span {
  color: var(--app-text-secondary);
  font-size: 13px;
  line-height: 1.7;
}

.login-page__panel {
  display: grid;
  place-items: center;
  padding: 32px;
}

.login-card {
  width: 100%;
  max-width: 440px;
  border-radius: var(--ant-border-radius-lg);
  box-shadow: var(--app-shadow-medium);
  overflow: hidden;
}

.login-card__header {
  margin-bottom: 28px;
}

.login-card__header h2 {
  margin: 10px 0 12px;
  color: var(--app-text-primary);
  font-size: 30px;
  line-height: 1.1;
}

.login-card__header p {
  margin: 0;
  color: var(--app-text-tertiary);
  font-size: 14px;
  line-height: 1.7;
}

.login-card__form {
  margin-top: 20px;
}

.login-card__tip {
  margin-bottom: 16px;
}

.login-card__actions {
  margin-bottom: 0;
}

@media (max-width: 1180px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .login-page__hero {
    padding-bottom: 12px;
  }

  .login-page__highlights {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .login-page__hero,
  .login-page__panel {
    padding-inline: 18px;
  }

  .login-card {
    border-radius: var(--ant-border-radius-lg);
  }
}
</style>
