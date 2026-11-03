<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { ABBREVIATIONS } from '../content/abbreviations'
import { common } from '../content/common'
import { loadAll } from '../content/all'
import { pick } from '../lib/settings'

type All = Awaited<ReturnType<typeof loadAll>>

const all = shallowRef<All>([])
loadAll().then(list => {
  all.value = list
})

const t = computed(() => pick(common))
const rows = computed(() => {
  const seen = new Set<string>()
  return all.value
    .flatMap(({ chapter, content }) => pick(content).easy.terms.map(term => ({ ...term, chapter })))
    .filter(r => !seen.has(r.term) && seen.add(r.term))
})
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <h1>{{ t.glossary }}</h1>
      <p class="lead">{{ t.glossaryLead }}</p>
    </header>
    <section>
      <h2>{{ t.abbreviations }}</h2>
      <table class="contents abbrs">
        <thead>
          <tr><th scope="col">{{ t.abbreviations }}</th><th scope="col">{{ t.fullName }}</th><th scope="col">{{ t.meaning }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="a in ABBREVIATIONS" :key="a.abbr">
            <td>{{ a.abbr }}</td>
            <td>{{ a.full }}</td>
            <td>{{ pick(a) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
    <section>
    <h2>{{ t.term }}</h2>
    <table class="contents glossary">
      <thead>
        <tr><th scope="col">{{ t.term }}</th><th scope="col">{{ t.meaning }}</th><th scope="col">{{ t.chapter }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.term">
          <td>{{ r.term }}</td>
          <td v-html="r.desc"></td>
          <td><RouterLink :to="r.chapter.path">{{ r.chapter.no }}. {{ pick(r.chapter.title) }}</RouterLink></td>
        </tr>
      </tbody>
    </table>
    </section>
  </article>
</template>
