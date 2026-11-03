<script setup lang="ts">
import { provide } from 'vue'
import { themeKey } from './keys'
import ProvideLeaf from './ProvideLeaf.vue'

const props = defineProps<{ override: boolean }>()
const emit = defineEmits<{ ready: [chain: object] }>()

if (props.override) provide(themeKey, 'from Middle')
</script>

<template>
  <div class="live-child">
    Middle
    <ProvideLeaf @ready="chain => emit('ready', chain)" />
  </div>
</template>
