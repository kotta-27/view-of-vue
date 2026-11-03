export const PLAYGROUND_STARTER = `<script setup>
import { computed, ref } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
</script>

<template>
  <button @click="count++">{{ count }}</button>
  <p>doubled: {{ doubled }}</p>
</template>

<style>
button { font-weight: bold; }
</style>
`
