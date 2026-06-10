<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  className?: string;
  /**
   * @zh_CN 最小加载时间
   * @en_US Minimum loading time
   */
  minLoadingTime?: number;
  /**
   * @zh_CN loading状态开启
   */
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

const showSpinner = ref(false);
const renderSpinner = ref(false);
const timer = ref<ReturnType<typeof setTimeout>>();

watch(
  () => props.spinning,
  (show) => {
    if (!show) {
      showSpinner.value = false;
      clearTimeout(timer.value);
      return;
    }

    timer.value = setTimeout(() => {
      showSpinner.value = true;
      if (showSpinner.value) {
        renderSpinner.value = true;
      }
    }, props.minLoadingTime);
  },
  {
    immediate: true
  }
);

function onTransitionEnd() {
  if (!showSpinner.value) {
    renderSpinner.value = false;
  }
}
</script>

<template>
  <div
    :class="[
      'absolute left-0 top-0 z-[100] flex h-full w-full flex-col items-center justify-center gap-4 bg-[rgb(242_242_242_/_45%)] dark:bg-black/40 backdrop-blur-sm transition-all duration-500',
      {
        'invisible opacity-0': !showSpinner,
        'opacity-100': showSpinner
      },
      props.className
    ]"
    @transitionend="onTransitionEnd"
  >
    <div
      v-if="renderSpinner"
      :class="{ paused: !renderSpinner }"
      class="app-spinner__loader relative h-12 w-12"
    ></div>
    <div
      v-if="renderSpinner"
      class="mt-5 text-center text-[15px] font-[700] leading-6 tracking-[0.04em] text-app-primary [text-shadow:0_2px_4px_rgba(var(--app-primary-rgb),0.2)]"
    >
      <slot name="text">加载中...</slot>
    </div>
  </div>
</template>

<style scoped>
.paused {
  &::before,
  &::after {
    animation-play-state: paused !important;
  }
}

.app-spinner__loader::before {
  position: absolute;
  top: 60px;
  left: 0;
  width: 3rem;
  height: 5px;
  content: '';
  border-radius: var(--ant-border-radius-lg, 8px);
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
  border-radius: var(--ant-border-radius-lg, 8px);
  background-color: var(--app-primary);
  animation: loader-jump-ani 0.5s linear infinite;
}

@keyframes loader-jump-ani {
  15% {
    border-bottom-right-radius: 3px;
  }

  25% {
    transform: translateY(9px) rotate(22.5deg);
  }

  50% {
    border-bottom-right-radius: 40px;
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
