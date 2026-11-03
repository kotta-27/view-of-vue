<script setup lang="ts">
import { computed } from 'vue'
import { chapterBy, chapterId, CHAPTERS, NEEDS, PARTS } from '../lib/chapters'
import { common } from '../content/common'
import type { ChapterText, Exercise } from '../content/types'
import { easy, pick } from '../lib/settings'
import { partName } from '../lib/part-name'
import CodeExercise from './CodeExercise.vue'

const props = defineProps<{
  no: number | string
  text: ChapterText
  exercise: Exercise
  sources: [path: string, names: string][]
}>()

const t = computed(() => pick(common))
const chapter = computed(() => chapterBy(props.no))
const index = computed(() => CHAPTERS.indexOf(chapter.value))
const part = computed(() => PARTS.find(p => p.chapters.includes(chapter.value))!)
const needs = computed(() => (NEEDS[String(props.no)] ?? []).map(chapterBy))
const prev = computed(() => CHAPTERS[index.value - 1])
const next = computed(() => CHAPTERS[index.value + 1])
</script>

<template>
  <article class="chapter">
    <header class="chapter-head">
      <p class="crumb">{{ partName(part, t) }} / {{ typeof no === 'string' ? no : t.chapterLabel(no) }}</p>
      <h1>{{ pick(chapter.title) }}</h1>
      <div class="lead" v-html="text.lead"></div>
      <p v-if="needs.length" class="needs">
        <span>{{ t.needs }}</span>
        <RouterLink v-for="n in needs" :key="n.path" :to="n.path">{{ n.no }}. {{ pick(n.title) }}</RouterLink>
      </p>
    </header>

    <aside v-if="easy" class="easy" :aria-label="t.easyTitle">
      <h2>{{ t.easyTitle }}</h2>
      <div class="easy-body" v-html="text.easy.intro"></div>
      <h3>{{ t.terms }}</h3>
      <dl class="terms">
        <div v-for="term in text.easy.terms" :key="term.term">
          <dt>{{ term.term }}</dt>
          <dd v-html="term.desc"></dd>
        </div>
      </dl>
    </aside>

    <slot />

    <section v-if="text.steps.length">
      <h2>{{ t.checks }}</h2>
      <slot name="checks" />
      <ol class="steps">
        <li v-for="(step, i) in text.steps" :key="i" v-html="step"></li>
      </ol>
    </section>

    <section class="practice">
      <h2>{{ t.practice }}: {{ text.exercise.title }}</h2>
      <p v-html="text.exercise.task"></p>
      <CodeExercise :id="chapterId(no)" :exercise="exercise" :todo="text.exercise.todo" />
    </section>

    <details v-if="text.impl.length" class="impl" :open="!easy">
      <summary>{{ t.implTitle }}</summary>
      <ul>
        <li v-for="(item, i) in text.impl" :key="i" v-html="item"></li>
      </ul>
      <table class="src">
        <caption>{{ t.sourcesCaption }}</caption>
        <thead>
          <tr><th scope="col">{{ t.file }}</th><th scope="col">{{ t.definition }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="[path, names] in sources" :key="path">
            <td><code>{{ path }}</code></td>
            <td><code>{{ names }}</code></td>
          </tr>
        </tbody>
      </table>
      <p class="method"><b>{{ t.method }}</b> {{ text.method }}</p>
    </details>

    <footer class="pager">
      <RouterLink v-if="prev" :to="prev.path"><small>{{ t.prev }}</small>{{ prev.no }}. {{ pick(prev.title) }}</RouterLink>
      <RouterLink v-else to="/"><small>{{ t.back }}</small>{{ t.top }}</RouterLink>
      <RouterLink v-if="next" :to="next.path" class="is-next"><small>{{ t.next }}</small>{{ next.no }}. {{ pick(next.title) }}</RouterLink>
    </footer>
  </article>
</template>
