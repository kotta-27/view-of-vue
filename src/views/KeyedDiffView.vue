<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'
import StepBar from '../components/StepBar.vue'
import ChapterPage from '../components/ChapterPage.vue'
import { useStepper } from '../composables/useStepper'
import content from '../content/ch06'
import { pick } from '../lib/settings'
import { createDom, diffKeyed, type DiffFrame, type DomEl, type Item, type Phase } from '../lib/keyed-diff'

const MAX = 10
const LETTERS = 'ABCDEFGHIJKL'

const PHASE_LINES: Record<Phase, number[]> = {
  start: [],
  head: [2],
  tail: [5],
  mount: [8],
  unmount: [9],
  map: [12],
  scan: [15],
  lis: [18],
  place: [21],
  done: [],
}
const c = computed(() => pick(content))
const phaseLabel = (p: Phase) =>
  ({
    start: c.value.ui.start,
    head: c.value.ui.head,
    tail: c.value.ui.tail,
    mount: c.value.ui.phaseMount,
    unmount: c.value.ui.phaseUnmount,
    map: c.value.ui.map,
    scan: c.value.ui.scan,
    lis: c.value.ui.phaseLis,
    place: c.value.ui.place,
    done: c.value.ui.done,
  })[p]

const mode = ref<'id' | 'index'>('id')
const order = ref('ABCDEFG')
const custom = ref('')
const frames = shallowRef<DiffFrame[]>([])
const stepper = useStepper(frames)

const toItems = (s: string): Item[] =>
  [...s].map((c, i) => ({ key: mode.value === 'id' ? c : i, text: c }))

const idle = ref<DomEl[]>(createDom(toItems(order.value)))
const oldItems = ref<Item[]>(toItems(order.value))
const newItems = ref<Item[]>([])

function apply(next: string) {
  if (next === order.value && frames.value.length) return
  const c1 = toItems(order.value)
  const c2 = toItems(next)
  oldItems.value = c1
  newItems.value = c2
  frames.value = diffKeyed(c1, c2, idle.value)
  order.value = next
  idle.value = frames.value.at(-1)!.dom
  stepper.restart()
}

function setMode(m: 'id' | 'index') {
  if (m === mode.value) return
  mode.value = m
  idle.value = idle.value.map((el, i) => ({ ...el, key: m === 'id' ? el.text : i }))
  frames.value = []
  oldItems.value = toItems(order.value)
  newItems.value = []
}

function toggleMark(id: number) {
  idle.value = idle.value.map(el => (el.id === id ? { ...el, marked: !el.marked } : el))
  if (frames.value.length) {
    frames.value = []
    oldItems.value = toItems(order.value)
    newItems.value = []
  }
}

const unused = computed(() => [...LETTERS].find(c => !order.value.includes(c)) ?? '')

const presets = computed(() => {
  const s = order.value
  const u = unused.value
  const mid = Math.floor(s.length / 2)
  return [
    { name: c.value.ui.addHead, next: u + s, off: s.length >= MAX || !u },
    { name: c.value.ui.removeTail, next: s.slice(0, -1), off: s.length <= 2 },
    { name: c.value.ui.tailToHead, next: s.slice(-1) + s.slice(0, -1), off: false },
    { name: c.value.ui.headToTail, next: s.slice(1) + s[0], off: false },
    { name: c.value.ui.reverse, next: [...s].reverse().join(''), off: false },
    {
      name: c.value.ui.changeMiddle,
      next: s.slice(0, 2) + s.slice(mid, mid + 1) + s.slice(2, mid) + (s.length < MAX ? u : '') + s.slice(mid + 1),
      off: s.length < 5,
    },
  ]
})

function shuffle() {
  const a = [...order.value]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  apply(a.join(''))
}

const cleaned = computed(() => [...new Set(custom.value.toUpperCase().replace(/[^A-Z]/g, ''))].slice(0, MAX).join(''))

function applyCustom() {
  if (cleaned.value.length >= 1) apply(cleaned.value)
}

const frame = computed(() => (frames.value.length ? stepper.current.value : undefined))
const dom = computed(() => frame.value?.dom ?? idle.value)
const ops = computed(() => frame.value?.ops ?? { patch: 0, text: 0, mount: 0, unmount: 0, move: 0 })
const note = computed(() =>
  frame.value
    ? `${phaseLabel(frame.value.phase)}: ${frame.value.note}`
    : c.value.ui.idle,
)
const lines = computed(() => (frame.value ? PHASE_LINES[frame.value.phase] : []))
const hasMark = computed(() => dom.value.some(e => e.marked))
const lisKeys = computed(() => {
  const f = frame.value
  if (!f?.lis) return new Set<number>()
  return new Set(f.lis.map(i => f.s2 + i))
})

const oldClass = (i: number) => ({
  'is-done': frame.value?.doneOld.includes(i),
  'is-range': frame.value && i >= frame.value.i && i <= frame.value.e1,
})
const newClass = (i: number) => ({
  'is-done': frame.value?.doneNew.includes(i),
  'is-range': frame.value && i >= frame.value.i && i <= frame.value.e2,
  'is-lis': lisKeys.value.has(i),
})

const SOURCES: [string, string][] = [
  ['packages/runtime-core/src/renderer.ts', 'patchKeyedChildren, patchUnkeyedChildren, getSequence'],
]
</script>

<template>
  <ChapterPage :no="6" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.overview }}</h2>
      <div v-html="c.ui.overviewBody"></div>
    </section>

    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="seg" role="group" :aria-label="c.ui.keyKind">
          <button class="seg-btn" :class="{ 'is-on': mode === 'id' }" :aria-pressed="mode === 'id'" @click="setMode('id')">
            :key="item.id"
          </button>
          <button class="seg-btn" :class="{ 'is-on': mode === 'index' }" :aria-pressed="mode === 'index'" @click="setMode('index')">
            :key="index"
          </button>
        </div>

        <div class="actions is-top">
          <button v-for="p in presets" :key="p.name" class="btn" :disabled="p.off" @click="apply(p.next)">{{ p.name }}</button>
          <button class="btn" @click="shuffle">{{ c.ui.shuffle }}</button>
          <form class="custom" @submit.prevent="applyCustom">
            <input v-model="custom" :aria-label="c.ui.customLabel" :placeholder="c.ui.customPlaceholder" maxlength="20" />
            <button class="btn" :disabled="!cleaned">{{ c.ui.apply }}</button>
          </form>
        </div>

        <div class="fig-grid">
          <div class="fig-main">
            <div class="rows">
              <div class="row">
                <span class="row-label">{{ c.ui.oldList }}</span>
                <div class="row-tiles">
                  <span v-for="(it, i) in oldItems" :key="i" class="tile is-v" :class="oldClass(i)">{{ it.text }}</span>
                </div>
              </div>
              <div class="row">
                <span class="row-label">{{ c.ui.newList }}</span>
                <div class="row-tiles">
                  <span v-for="(it, i) in newItems" :key="i" class="tile is-v" :class="newClass(i)">{{ it.text }}</span>
                  <span v-if="!newItems.length" class="row-empty">{{ c.ui.pickOp }}</span>
                </div>
              </div>
              <div class="row is-dom">
                <span class="row-label">DOM</span>
                <TransitionGroup name="tile" tag="div" class="row-tiles">
                  <button
                    v-for="el in dom"
                    :key="el.id"
                    class="tile"
                    :class="{ 'is-touched': frame?.touched === el.id, 'is-marked': el.marked }"
                    :aria-pressed="el.marked"
                    :aria-label="`${el.text} ${c.ui.toggleState}`"
                    @click="toggleMark(el.id)"
                  >
                    {{ el.text }}
                  </button>
                </TransitionGroup>
              </div>
            </div>

            <dl class="meters">
              <div class="is-key"><dt>{{ c.ui.move }}</dt><dd>{{ ops.move }}</dd></div>
              <div><dt>{{ c.ui.mount }}</dt><dd>{{ ops.mount }}</dd></div>
              <div><dt>{{ c.ui.unmount }}</dt><dd>{{ ops.unmount }}</dd></div>
              <div><dt>{{ c.ui.textUpdate }}</dt><dd>{{ ops.text }}</dd></div>
            </dl>

            <p v-if="frame?.source" class="seq">
              <span>newIndexToOldIndexMap</span>
              <code>[{{ frame.source.join(', ') }}]</code>
              <template v-if="frame.lis">
                <span>{{ c.ui.lis }}</span>
                <code>[{{ frame.lis.join(', ') }}]</code>
              </template>
            </p>

            <StepBar :stepper="stepper" :total="frames.length" :note="note" />
          </div>
          <CodeBlock :code="c.ui.pseudo" :highlight="lines" :caption="c.ui.pseudoCaption" />
        </div>

        <p v-if="mode === 'index' && hasMark" class="warn">{{ c.ui.warn }}</p>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>
  </ChapterPage>
</template>
