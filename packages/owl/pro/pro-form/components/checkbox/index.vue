<template>
  <FieldComp v-bind="$attrs" v-model:checked="checked">
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps ?? {}" />
    </template>
  </FieldComp>
</template>

<script setup lang="ts">
import { Checkbox as FieldComp } from 'antdv-next';

defineOptions({ name: 'ProCheckbox', inheritAttrs: false });

const checked = defineModel<any>('checked');
</script>
