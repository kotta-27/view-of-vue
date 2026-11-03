<script setup lang="ts">
import { computed } from 'vue'
import { common } from '../content/common'
import { pitfalls } from '../content/pitfalls'
import { chapterBy } from '../lib/chapters'
import { pick } from '../lib/settings'

const t = computed(() => pick(common))
const rows = computed(() => pick(pitfalls).map(p => ({ ...p, link: chapterBy(p.chapter) })))
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <h1>{{ t.pitfalls }}</h1>
      <p class="lead">{{ t.pitfallsLead }}</p>
    </header>
    <ol class="pitfalls">
      <li v-for="p in rows" :key="p.title">
        <h2>{{ p.title }}</h2>
        <dl>
          <div><dt>{{ t.cause }}</dt><dd v-html="p.cause"></dd></div>
          <div><dt>{{ t.fix }}</dt><dd v-html="p.fix"></dd></div>
        </dl>
        <RouterLink :to="p.link.path">{{ t.chapterLabel(p.link.no) }} {{ pick(p.link.title) }}</RouterLink>
      </li>
    </ol>
  </article>
</template>
