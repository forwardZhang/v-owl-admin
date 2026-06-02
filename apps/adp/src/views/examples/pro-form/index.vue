<template>
  <ProPage v-model:active-key="activeKey" :tabs="tabs"> </ProPage>
</template>

<script setup lang="ts">
import { ProPage, type ProPageTabItem } from '@owl/components';
import { ref } from 'vue';

const activeKey = ref('form');
const tabs: ProPageTabItem[] = [
  {
    key: 'form',
    title: '表单工作台'
  }
];
</script>
