<script setup lang="ts">
import { onUpdated } from 'vue'
import { counts } from './state'

const props = defineProps<{
  name: string
  value: number
  config?: { label: string }
}>()

const emit = defineEmits<{ increment: [by: number] }>()

onUpdated(() => counts[props.name]++)
</script>

<template>
  <div class="live-child">
    {{ name }}: {{ value }}
    <button class="btn" @click="emit('increment', 1)">emit('increment', 1)</button>
  </div>
</template>
