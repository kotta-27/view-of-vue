<script setup lang="ts">
import { computed } from 'vue'
import { cheatsheet } from '../content/cheatsheet'
import { common } from '../content/common'
import { locale, pick } from '../lib/settings'

const t = computed(() => pick(common))
const desc = (row: readonly string[]) => (locale.value === 'ja' ? row[1] : row[2])
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <h1>{{ t.cheatsheet }}</h1>
      <p class="lead">{{ t.cheatsheetLead }}</p>
    </header>
    <section v-for="g in cheatsheet" :key="g.title.ja">
      <h2>{{ pick(g.title) }}</h2>
      <table class="cheat">
        <tbody>
          <tr v-for="row in g.rows" :key="row[0]">
            <td><code>{{ row[0] }}</code></td>
            <td>{{ desc(row) }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </article>
</template>
