<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

interface Props {
  className?: string;
  minLoadingTime?: number;
  spinning?: boolean;
}

defineOptions({
  name: 'Spinner'
});

const props = withDefaults(defineProps<Props>(), {
  className: '',
  minLoadingTime: 50,
  spinning: false
});

const isVisible = ref(false);
const shouldRender = ref(false);
let showTimer: ReturnType<typeof setTimeout> | undefined;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function clearTimers() {
  if (showTimer) {
    clearTimeout(showTimer);
    showTimer = undefined;
  }

  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = undefined;
  }
}

watch(
  () => props.spinning,
  (show) => {
    clearTimers();

    if (!show) {
      isVisible.value = false;
      hideTimer = setTimeout(() => {
        shouldRender.value = false;
      }, 180);
      return;
    }

    shouldRender.value = true;
    showTimer = setTimeout(() => {
      isVisible.value = true;
    }, props.minLoadingTime);
  },
  {
    immediate: true
  }
);

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<template>
  <div
    v-if="shouldRender"
    :class="[
      'flex h-full w-full flex-col items-center justify-center gap-4 bg-[rgb(242_242_242_/_45%)] opacity-0 backdrop-blur-sm transition-opacity duration-200',
      props.className,
      {
        'is-visible': isVisible
      }
    ]"
  >
    <div class="app-spinner__loader relative h-12 w-12"></div>
    <div
      class="mt-5 text-center text-base font-semibold leading-6 tracking-[0.02em] text-app-text-secondary [text-shadow:0_1px_2px_rgb(255_255_255_/_35%)]"
    >
      <slot name="text"> 加载中... </slot>
    </div>
  </div>
</template>

<style scoped>
.is-visible {
  opacity: 1;
}

.app-spinner__loader::before {
  position: absolute;
  top: 60px;
  left: 0;
  width: 3rem;
  height: 5px;
  content: '';
  border-radius: var(--ant-border-radius-lg);
  background-color: rgba(var(--app-primary-rgb), 0.5);
  animation: loader-shadow-ani 0.5s linear infinite;
}

.app-spinner__loader::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  content: '';
  border-radius: var(--ant-border-radius-lg);
  background-color: var(--app-primary);
  animation: loader-jump-ani 0.5s linear infinite;
}

.app-spinner__text {
  margin-top: 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  color: var(--app-text-secondary);
  text-align: center;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 2px rgb(255 255 255 / 35%);
}

@keyframes loader-jump-ani {
  15% {
    border-bottom-right-radius: var(--ant-border-radius-lg);
  }

  25% {
    transform: translateY(9px) rotate(22.5deg);
  }

  50% {
    border-bottom-right-radius: var(--ant-border-radius-lg);
    transform: translateY(18px) scale(1, 0.9) rotate(45deg);
  }

  75% {
    transform: translateY(9px) rotate(67.5deg);
  }

  100% {
    transform: translateY(0) rotate(90deg);
  }
}

@keyframes loader-shadow-ani {
  0%,
  100% {
    transform: scale(1, 1);
  }

  50% {
    transform: scale(1.2, 1);
  }
}
</style>
