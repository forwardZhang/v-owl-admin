<template>
  <FieldComp v-bind="$attrs" v-model:value="value">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </FieldComp>
</template>

<script setup lang="ts">
import { TimePicker as FieldComp } from 'antdv-next';

defineOptions({ name: 'ProTimePicker', inheritAttrs: false });

const value = defineModel<any>('value');
</script>
