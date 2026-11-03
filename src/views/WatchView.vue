<script setup lang="ts">
import { computed, onBeforeUnmount, onWatcherCleanup, ref, shallowRef, watch, watchEffect } from 'vue'
import ChapterPage from '../components/ChapterPage.vue'
import CodeBlock from '../components/CodeBlock.vue'
import content from '../content/ch11'
import { pick, say } from '../lib/settings'

const c = computed(() => pick(content))

// 図 11-1: 本物の watch と watchEffect
const count = ref(0)
const other = ref(0)
const watchRuns = ref(0)
const effectRuns = ref(0)
const lastChange = ref('—')

watch(count, (next, prev) => {
  watchRuns.value++
  lastChange.value = `${prev} → ${next}`
})

watchEffect(() => {
  void count.value
  effectRuns.value++
})

// 図 11-2: 遅いリクエストが後から届く状況を、遅延の違いで再現する
const LATENCY: Record<string, number> = { A: 900, B: 200 }

const term = ref('')
const result = ref('—')
const useCleanup = ref(true)
const log = shallowRef<{ id: number; text: string }[]>([])
const active = ref(0)
let logId = 0
const timers = new Set<ReturnType<typeof setTimeout>>()

const write = (text: string) => {
  log.value = [...log.value, { id: ++logId, text }]
}

function search(q: string, signal: AbortSignal) {
  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => {
      timers.delete(timer)
      resolve(`${q} result`)
    }, LATENCY[q])
    timers.add(timer)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      timers.delete(timer)
      reject(new Error('aborted'))
    })
  })
}

watch(term, async q => {
  if (!q) return
  const controller = new AbortController()
  if (useCleanup.value) onWatcherCleanup(() => controller.abort())
  write(say(`${q} の検索を開始（${LATENCY[q]}ms かかる）`, `Start searching ${q} (takes ${LATENCY[q]}ms)`))
  active.value++
  try {
    const data = await search(q, controller.signal)
    result.value = data
    write(say(`${q} の結果が届き、表示を更新した`, `${q} arrived and updated the display`))
  } catch {
    write(say(`${q} の検索を中止した`, `Aborted the search for ${q}`))
  } finally {
    active.value--
  }
})

function reset() {
  term.value = ''
  result.value = '—'
  log.value = []
}

function run() {
  reset()
  setTimeout(() => {
    term.value = 'A'
    const timer = setTimeout(() => {
      timers.delete(timer)
      term.value = 'B'
    }, 100)
    timers.add(timer)
  })
}

const settled = computed(() => term.value !== '' && active.value === 0 && result.value !== '—')
const correct = computed(() => result.value === `${term.value} result`)
const bad = computed(() =>
  say(`入力は ${term.value} なのに ${result.value} が表示されている`, `The input is ${term.value}, but ${result.value} is shown`),
)

onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
})

const SOURCES: [string, string][] = [
  ['packages/reactivity/src/watch.ts', 'watch, onWatcherCleanup, traverse'],
  ['packages/runtime-core/src/apiWatch.ts', 'doWatch, watchEffect'],
]
</script>

<template>
  <ChapterPage :no="11" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.fig1Title }}</h2>
      <figure class="fig">
        <div class="fig-grid">
          <div class="fig-main">
            <dl class="meters">
              <div><dt>count</dt><dd>{{ count }}</dd></div>
              <div><dt>other</dt><dd>{{ other }}</dd></div>
              <div class="is-key"><dt>{{ c.ui.watchRuns }}</dt><dd>{{ watchRuns }}</dd></div>
              <div class="is-key"><dt>{{ c.ui.effectRuns }}</dt><dd>{{ effectRuns }}</dd></div>
            </dl>
            <p class="outcome">{{ c.ui.received }}: {{ lastChange }}</p>
            <div class="actions">
              <button class="btn" @click="count++">count + 1</button>
              <button class="btn" @click="other++">other + 1</button>
            </div>
          </div>
          <CodeBlock :code="c.ui.compare" :caption="c.ui.sceneCaption" />
        </div>
        <figcaption>{{ c.ui.fig1Caption }}</figcaption>
      </figure>
    </section>

    <section>
      <h2>{{ c.ui.fig2Title }}</h2>
      <figure class="fig">
        <div class="fig-grid">
          <div class="fig-main">
            <div class="actions">
              <label class="toggle"><input id="use-cleanup" v-model="useCleanup" type="checkbox" />{{ c.ui.useCleanup }}</label>
              <button class="btn is-primary" @click="run">{{ c.ui.run }}</button>
            </div>
            <dl class="meters is-small">
              <div><dt>{{ c.ui.input }}</dt><dd>{{ term || '—' }}</dd></div>
              <div class="is-key"><dt>{{ c.ui.shown }}</dt><dd>{{ result }}</dd></div>
              <div><dt>{{ c.ui.active }}</dt><dd>{{ active }}</dd></div>
            </dl>
            <p v-if="settled" class="outcome" :class="correct ? 'is-good' : 'is-bad'">
              {{ correct ? c.ui.good : bad }}
            </p>
            <ol class="runlog" aria-live="polite">
              <li v-for="l in log" :key="l.id"><span>{{ c.ui.logLabel }}</span>{{ l.text }}</li>
            </ol>
          </div>
          <CodeBlock :code="c.ui.race" :caption="c.ui.raceCaption" />
        </div>
        <figcaption>{{ c.ui.fig2Caption }}</figcaption>
      </figure>
    </section>
  </ChapterPage>
</template>
