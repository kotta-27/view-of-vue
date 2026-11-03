<script setup lang="ts">
import { useTemplateRef } from 'vue'
import LifeChild from './LifeChild.vue'
import { useLoggedHooks } from './log'

defineProps<{ value: number }>()

useLoggedHooks('Parent', useTemplateRef<HTMLElement>('el'))
</script>

<template>
  <div ref="el" class="live-parent">
    Parent: {{ value }}
    <LifeChild :value="value" />
  </div>
</template>
