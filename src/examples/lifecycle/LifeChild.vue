<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { useLoggedHooks } from './log'

defineProps<{ value: number }>()

const own = ref(0)
useLoggedHooks('Child', useTemplateRef<HTMLElement>('el'))
</script>

<template>
  <div ref="el" class="live-child">
    Child: props {{ value }} / own {{ own }}
    <button class="btn" @click="own++">Update child state</button>
  </div>
</template>
