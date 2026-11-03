<script setup lang="ts">
import { onUpdated } from 'vue'
import { counts } from './state'

onUpdated(() => counts.child++)
</script>

<template>
  <div class="live-child">
    Child frame:
    <slot></slot>
  </div>
</template>
