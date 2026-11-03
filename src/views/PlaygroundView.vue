<script setup lang="ts">
import { computed } from 'vue'
import CodeExercise from '../components/CodeExercise.vue'
import { common } from '../content/common'
import { PLAYGROUND_STARTER } from '../content/playground'
import { pick } from '../lib/settings'

const t = computed(() => pick(common))
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <h1>{{ t.playground }}</h1>
      <p class="lead">{{ t.playgroundLead }}</p>
    </header>
    <CodeExercise id="playground" :starter="PLAYGROUND_STARTER" />
  </article>
</template>
