<template>
  <FieldComp v-bind="$attrs" v-model:value="value">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </FieldComp>
</template>

<script setup lang="ts">
import { Input as FieldComp } from 'antdv-next';

defineOptions({ name: 'ProInput', inheritAttrs: false });

const value = defineModel<any>('value');
</script>
