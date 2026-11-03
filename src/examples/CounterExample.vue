<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button class="btn" @click="count++">
    Clicks: {{ count }}
  </button>
</template>
