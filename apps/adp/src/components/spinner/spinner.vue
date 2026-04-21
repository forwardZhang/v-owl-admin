<script lang="ts" setup>
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
  minLoadingTime: 50
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
    :class="{
      spinning: true,
      [props.className ?? '']: !!props.className
    }"
    @transitionend="onTransitionEnd"
  >
    <div v-if="renderSpinner" :class="{ paused: !renderSpinner }" class="loader"></div>
  </div>
</template>

<style scoped>
.spinning {
  width: 100%;
  height: 100%;
  animation-duration: 500ms;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
  background-color: rgb(242 242 242 / 45%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.paused {
  &::before {
    animation-play-state: paused !important;
  }

  &::after {
    animation-play-state: paused !important;
  }
}

.loader {
  width: 3rem;
  height: 3rem;
  position: relative;

  &::before {
    position: absolute;
    content: '';
    background-color: rgba(var(--app-primary-rgb), 0.5);
    border-radius: var(--ant-border-radius-lg);
    width: 3rem;
    height: 5px;
    top: 60px;
    left: 0;
    animation: loader-shadow-ani 0.5s linear infinite;
  }

  &::after {
    background-color: var(--app-primary);
    content: '';
    border-radius: var(--ant-border-radius-lg);
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    animation: loader-jump-ani 0.5s linear infinite;
  }
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
