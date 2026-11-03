<script setup lang="ts">
import { provide } from 'vue'
import { theme, themeKey } from './keys'
import ProvideMiddle from './ProvideMiddle.vue'

const props = defineProps<{ asValue: boolean; override: boolean }>()
const emit = defineEmits<{ ready: [chain: object] }>()

provide(themeKey, props.asValue ? theme.value : theme)
</script>

<template>
  <div class="live-parent">
    Root
    <ProvideMiddle :override="override" @ready="chain => emit('ready', chain)" />
  </div>
</template>
