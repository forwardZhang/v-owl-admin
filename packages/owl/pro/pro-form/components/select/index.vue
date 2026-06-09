<template>
  <FieldComp v-bind="$attrs" v-model:value="value">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </FieldComp>
</template>

<script setup lang="ts">
import { Select as FieldComp } from 'antdv-next';

defineOptions({ name: 'ProSelect', inheritAttrs: false });

const value = defineModel<any>('value');
</script>
