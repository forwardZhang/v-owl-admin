<template>
  <FieldComp v-bind="$attrs" v-model:value="value" class="w-full">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </FieldComp>
</template>

<script setup lang="ts">
import { InputNumber as FieldComp } from 'antdv-next';

defineOptions({ name: 'ProInputNumber', inheritAttrs: false });

const value = defineModel<any>('value');
</script>
