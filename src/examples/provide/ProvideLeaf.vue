<script setup lang="ts">
import { getCurrentInstance, inject, unref } from 'vue'
import { themeKey } from './keys'

const theme = inject(themeKey, 'default')
const emit = defineEmits<{ ready: [chain: object] }>()

// provides is internal. Read here only for the figure in chapter 9
emit('ready', (getCurrentInstance() as unknown as { parent: { provides: object } }).parent.provides)
</script>

<template>
  <div class="live-child">Leaf: {{ unref(theme) }}</div>
</template>
