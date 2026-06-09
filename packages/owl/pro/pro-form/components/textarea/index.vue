<template>
  <FieldComp v-bind="$attrs" v-model:value="value">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </FieldComp>
</template>

<script setup lang="ts">
import { TextArea as FieldComp } from 'antdv-next';

defineOptions({ name: 'ProTextarea', inheritAttrs: false });

const value = defineModel<any>('value');
</script>
