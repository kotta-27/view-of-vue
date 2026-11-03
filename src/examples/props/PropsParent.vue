<script setup lang="ts">
import { onUpdated } from 'vue'
import PropsChild from './PropsChild.vue'
import { a, b, counts, label, tick } from './state'

const addA = (by: number) => (a.value += by)
const addB = (by: number) => (b.value += by)

onUpdated(() => counts.parent++)
</script>

<template>
  <div class="live-parent">
    Parent state: {{ tick }}
    <PropsChild name="A" :value="a" @increment="addA" />
    <PropsChild name="B" :value="b" @increment="addB" />
    <PropsChild name="C" :value="0" :config="{ label }" />
  </div>
</template>
