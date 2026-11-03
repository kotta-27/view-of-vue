<script setup lang="ts">
import { onUpdated } from 'vue'
import SlotChild from './SlotChild.vue'
import { counts, n } from './state'

onUpdated(() => counts.parent++)
</script>

<template>
  <SlotChild>{{ n }}</SlotChild>
</template>
