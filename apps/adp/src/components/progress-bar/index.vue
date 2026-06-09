<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '@/store/modules/app';

defineOptions({
  name: 'ProgressBar'
});

const appStore = useAppStore();
const router = useRouter();

const percent = ref(0);
const active = ref(false);
let trickleTimer: ReturnType<typeof setInterval> | undefined;
let doneTimer: ReturnType<typeof setTimeout> | undefined;

const enabled = computed(() => appStore.progressBar);

function clearTimers() {
  if (trickleTimer) {
    clearInterval(trickleTimer);
    trickleTimer = undefined;
  }
  if (doneTimer) {
    clearTimeout(doneTimer);
    doneTimer = undefined;
  }
}

function start() {
  clearTimers();
  active.value = true;
  percent.value = 0;
  // 缓慢爬升到 90%，留出最后 10% 给真正加载完成
  trickleTimer = setInterval(() => {
    const remaining = 90 - percent.value;
    if (remaining <= 0) {
      return;
    }
    percent.value = Math.min(90, percent.value + Math.max(0.5, remaining * 0.1));
  }, 200);
}

function done() {
  clearTimers();
  percent.value = 100;
  doneTimer = setTimeout(() => {
    active.value = false;
    // 等淡出结束再归零，避免回退动画
    doneTimer = setTimeout(() => {
      percent.value = 0;
    }, 200);
  }, 200);
}

router.beforeEach((to) => {
  if (enabled.value && !to.meta?.loaded) {
    start();
  }
  return true;
});

router.afterEach((to) => {
  if (enabled.value && !to.meta?.loaded) {
    done();
  }
});

router.onError(() => {
  if (enabled.value) {
    done();
  }
});

onBeforeUnmount(() => {
  clearTimers();
});
</script>

<template>
  <div
    v-if="enabled"
    class="route-progress"
    :class="{ 'is-active': active }"
    role="progressbar"
    aria-hidden="true"
  >
    <div class="route-progress__bar" :style="{ transform: `scaleX(${percent / 100})` }" />
  </div>
</template>

<style scoped lang="less">
.route-progress {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 3000;
  width: 100%;
  height: 2px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;

  &.is-active {
    opacity: 1;
  }
}

.route-progress__bar {
  width: 100%;
  height: 100%;
  background: var(--app-primary);
  box-shadow: 0 0 8px rgba(var(--app-primary-rgb), 0.6);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.2s ease;
}
</style>
