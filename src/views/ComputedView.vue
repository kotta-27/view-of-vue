<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watchEffect } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'
import content from '../content/ch03'
import { pick } from '../lib/settings'
import ChapterPage from '../components/ChapterPage.vue'

const c = computed(() => pick(content))

// ここからは本物の Vue。template が count や isBig を読むと購読者になってしまうので、
// 結果は ui にコピーしてから描画する。
const count = ref(1)
let getterRuns = 0
let fnRuns = 0
let effectRuns = 0
let reads = 0
let computedFor: number | null = null
let lastValue: boolean | null = null

const isBig = computed(() => {
  getterRuns++
  computedFor = count.value
  lastValue = count.value >= 5
  return lastValue
})

function isBigFn() {
  fnRuns++
  return count.value >= 5
}

let stop: (() => void) | null = null
let shown: boolean | null = null

const ui = shallowRef({
  count: 1,
  getterRuns: 0,
  fnRuns: 0,
  effectRuns: 0,
  reads: 0,
  stale: true,
  value: null as boolean | null,
  subscribed: false,
  shown: null as boolean | null,
})
const log = ref<{ id: number; text: string; kind: string }[]>([])
const flowUp = ref(0)
const flowDown = ref(0)
let logId = 0

function sync(text: string, kind = '') {
  const prev = ui.value
  if (getterRuns > prev.getterRuns) flowUp.value++
  if (effectRuns > prev.effectRuns) flowDown.value++
  const parts = [text]
  if (getterRuns > prev.getterRuns) parts.push(c.value.ui.ranGetter)
  else if (kind === 'read') parts.push(c.value.ui.cached)
  if (effectRuns > prev.effectRuns) parts.push(c.value.ui.ranEffect)
  else if (kind === 'write' && stop) parts.push(c.value.ui.skipped)
  ui.value = {
    count: count.value,
    getterRuns,
    fnRuns,
    effectRuns,
    reads,
    stale: computedFor !== count.value,
    value: lastValue,
    subscribed: stop !== null,
    shown,
  }
  log.value = [{ id: ++logId, text: parts.join(' / '), kind }, ...log.value].slice(0, 7)
}

function change(by: number) {
  const next = Math.max(0, count.value + by)
  if (next === count.value) return
  count.value = next
  sync(`count = ${next}`, 'write')
}

function read() {
  reads++
  void isBig.value
  isBigFn()
  sync(c.value.ui.didRead, 'read')
}

function toggle() {
  if (stop) {
    stop()
    stop = null
    sync(c.value.ui.didUnsub)
  } else {
    stop = watchEffect(
      () => {
        effectRuns++
        shown = isBig.value
      },
      { flush: 'sync' },
    )
    sync(c.value.ui.didSub)
  }
}

onBeforeUnmount(() => stop?.())

const gateText = computed(() => (ui.value.stale ? c.value.ui.stale : c.value.ui.fresh))
const valueText = computed(() => (ui.value.value === null ? '—' : String(ui.value.value)))

const SOURCES: [string, string][] = [
  ['packages/reactivity/src/computed.ts', 'ComputedRefImpl'],
  ['packages/reactivity/src/effect.ts', 'refreshComputed, isDirty'],
  ['packages/reactivity/src/dep.ts', 'globalVersion, Dep'],
]
</script>

<template>
  <ChapterPage :no="3" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="df-wrap">
          <svg class="graph" viewBox="0 0 760 200" role="img" :aria-label="c.ui.aria">
            <defs>
              <marker id="head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0 L10 5 L0 10 z" style="fill: var(--navy)" />
              </marker>
            </defs>
            <path class="arrow" d="M170 100 H284" marker-end="url(#head)" />
            <path class="arrow" :class="{ 'is-off': !ui.subscribed }" d="M476 100 H590" :marker-end="ui.subscribed ? 'url(#head)' : undefined" />
            <path v-if="flowUp" :key="`u${flowUp}`" class="flow" d="M170 100 H284" pathLength="1" />
            <path v-if="flowDown" :key="`d${flowDown}`" class="flow" d="M476 100 H590" pathLength="1" />
            <g class="df-node">
              <rect x="24" y="44" width="146" height="112" rx="3" />
              <text x="40" y="74" class="node-name">count</text>
              <text x="40" y="124" class="df-big">{{ ui.count }}</text>
            </g>
            <g class="df-node is-computed" :class="{ 'is-stale': ui.stale }">
              <rect x="286" y="24" width="190" height="152" rx="3" />
              <text x="302" y="54" class="node-name">isBig</text>
              <text x="302" y="100" class="df-big">{{ valueText }}</text>
              <text x="302" y="128" class="df-state">{{ gateText }}</text>
              <text x="302" y="156" class="node-body">count &gt;= 5</text>
            </g>
            <g class="df-node" :class="{ 'is-off': !ui.subscribed }">
              <rect x="592" y="44" width="146" height="112" rx="3" />
              <text x="608" y="74" class="node-name">{{ c.ui.subscriber }}</text>
              <text x="608" y="124" class="df-big">{{ ui.subscribed ? String(ui.shown) : '—' }}</text>
            </g>
          </svg>

          <dl class="meters">
            <div><dt>{{ c.ui.reads }}</dt><dd>{{ ui.reads }}</dd></div>
            <div class="is-key"><dt>{{ c.ui.getter }}</dt><dd>{{ ui.getterRuns }}</dd></div>
            <div><dt>{{ c.ui.fn }}</dt><dd>{{ ui.fnRuns }}</dd></div>
            <div><dt>{{ c.ui.effectRuns }}</dt><dd>{{ ui.effectRuns }}</dd></div>
          </dl>
        </div>

        <div class="actions">
          <button class="btn" @click="read">{{ c.ui.read }}</button>
          <button class="btn" @click="change(1)">count + 1</button>
          <button class="btn" @click="change(-1)">count − 1</button>
          <button class="btn" :class="{ 'is-primary': ui.subscribed }" :aria-pressed="ui.subscribed" @click="toggle">
            {{ ui.subscribed ? c.ui.unsubscribe : c.ui.subscribe }}
          </button>
        </div>

        <ol class="ticker" aria-live="polite">
          <li v-if="!log.length">{{ c.ui.empty }}</li>
          <li v-for="l in log" :key="l.id">{{ l.text }}</li>
        </ol>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>

    <template #checks>
      <CodeBlock :code="c.ui.scene" :caption="c.ui.sceneCaption" />
    </template>
  </ChapterPage>
</template>
