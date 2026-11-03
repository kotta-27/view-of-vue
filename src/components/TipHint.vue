<script setup lang="ts">
withDefaults(defineProps<{ text: string; align?: 'center' | 'end'; hidden?: boolean }>(), {
  align: 'center',
  hidden: false,
})
</script>

<template>
  <span class="tip">
    <slot />
    <!-- 名前は各ボタンの aria-label が持つので、読み上げは二重にしない -->
    <span v-if="!hidden" class="tip-text" :class="`is-${align}`" aria-hidden="true">{{ text }}</span>
  </span>
</template>
