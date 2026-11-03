<script setup lang="ts">
import { useBusValue } from './useBusValue'

const props = defineProps<{ cleanup: boolean }>()
const value = useBusValue(props.cleanup)
</script>

<template>
  <div class="live-child">Received: {{ value }}</div>
</template>
