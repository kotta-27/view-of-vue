<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'
import StepBar from '../components/StepBar.vue'
import ChapterPage from '../components/ChapterPage.vue'
import { useStepper } from '../composables/useStepper'
import content from '../content/ch01'
import { pick } from '../lib/settings'
import { explain } from '../lib/explain'
import { linesFor, MINI_SOURCE, World, type Frame } from '../lib/mini'

const STATES = [
  { name: 'price', y: 66 },
  { name: 'qty', y: 164 },
  { name: 'sale', y: 262 },
]
const EFFECTS = [
  { name: 'total', y: 104, body: 'price × qty' },
  { name: 'badge', y: 224, body: 'sale ? Sale price : Regular' },
]

const c = computed(() => pick(content))

const frames = shallowRef<Frame[]>([])
const stepper = useStepper(frames)
const started = ref(false)

let world: World
let price: { value: number }
let qty: { value: number }
let sale: { value: boolean }

function act(note: string, fn: () => void) {
  frames.value = [...world.record(note, fn)]
  stepper.restart()
}

function reset() {
  world = new World()
  price = world.ref('price', 100)
  qty = world.ref('qty', 2)
  sale = world.ref('sale', false)
  started.value = false
  frames.value = [...world.record(c.value.ui.initial, () => {})]
  stepper.restart(false)
}
reset()

function start() {
  started.value = true
  act(c.value.ui.starting, () => {
    world.effect('total', () => String(price.value * qty.value))
    world.effect('badge', () => (sale.value ? `Sale ${price.value}` : 'Regular'))
  })
}

const frame = computed(() => stepper.current.value ?? frames.value[0])
const note = computed(() => explain(frame.value.trace))
const highlight = computed(() => linesFor(frame.value.trace))

const yOf = (list: { name: string; y: number }[], name: string) => list.find(n => n.name === name)!.y
const edgePath = (dep: string, eff: string) => {
  const y1 = yOf(STATES, dep)
  const y2 = yOf(EFFECTS, eff)
  return `M126 ${y1} C 216 ${y1}, 216 ${y2}, 306 ${y2}`
}

const fresh = computed(() => {
  const t = frame.value.trace
  return t.kind === 'track' ? `${t.dep}|${t.effect}` : ''
})
const pulses = computed(() => {
  const t = frame.value.trace
  return t.kind === 'trigger' ? t.effects.map(e => [t.dep, e] as const) : []
})
const readDep = computed(() => {
  const t = frame.value.trace
  return t.kind === 'get' || t.kind === 'set' || t.kind === 'trigger' ? t.dep : ''
})

const SOURCES: [string, string][] = [
  ['packages/reactivity/src/dep.ts', 'Dep, Link, track, trigger'],
  ['packages/reactivity/src/effect.ts', 'ReactiveEffect, startBatch, endBatch, prepareDeps, cleanupDeps'],
  ['packages/reactivity/src/ref.ts', 'RefImpl'],
]
</script>

<template>
  <ChapterPage :no="1" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.mechanism }}</h2>
      <div v-html="c.ui.mechanismBody"></div>
    </section>

    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="fig-grid">
          <div class="fig-main">
            <svg class="graph" viewBox="0 0 500 320" role="img" :aria-label="c.ui.aria">
              <text class="graph-col" x="66" y="16" text-anchor="middle">{{ c.ui.state }}</text>
              <text class="graph-col" x="400" y="16" text-anchor="middle">effect</text>
              <path
                v-for="[dep, eff] in frame.links"
                :key="`${dep}|${eff}`"
                class="edge"
                :class="{ 'is-fresh': fresh === `${dep}|${eff}` }"
                :d="edgePath(dep, eff)"
                pathLength="1"
              />
              <path
                v-for="[dep, eff] in pulses"
                :key="`${stepper.cursor.value}|${dep}|${eff}`"
                class="pulse"
                :d="edgePath(dep, eff)"
                pathLength="1"
              />
              <g v-for="s in STATES" :key="s.name" class="node" :class="{ 'is-on': readDep === s.name }">
                <rect x="6" :y="s.y - 36" width="120" height="72" rx="3" />
                <text x="18" :y="s.y - 11" class="node-name">{{ s.name }}</text>
                <text x="18" :y="s.y + 21" class="node-value">{{ frame.values[s.name] }}</text>
              </g>
              <g v-for="e in EFFECTS" :key="e.name" class="node is-effect" :class="{ 'is-on': frame.running === e.name }">
                <rect x="306" :y="e.y - 46" width="188" height="92" rx="3" />
                <text x="318" :y="e.y - 21" class="node-name">{{ e.name }}</text>
                <text x="318" :y="e.y + 11" class="node-value">{{ frame.outputs[e.name] ?? c.ui.notRun }}</text>
                <text x="318" :y="e.y + 33" class="node-body">{{ e.body }}</text>
              </g>
            </svg>
            <StepBar :stepper="stepper" :total="frames.length" :note="note" />
            <div class="actions">
              <button v-if="!started" class="btn is-primary" @click="start">{{ c.ui.run }}</button>
              <template v-else>
                <button class="btn" @click="act(c.ui.addPrice, () => (price.value += 100))">price + 100</button>
                <button class="btn" @click="act(c.ui.addQty, () => (qty.value += 1))">qty + 1</button>
                <button class="btn" @click="act(c.ui.doFlip, () => (sale.value = !sale.value))">{{ c.ui.flip }}</button>
                <button class="btn" @click="act(c.ui.doSame, () => (qty.value = qty.value))">{{ c.ui.same }}</button>
                <button class="btn is-quiet" @click="reset">{{ c.ui.reset }}</button>
              </template>
            </div>
          </div>
          <CodeBlock :code="MINI_SOURCE" :highlight="highlight" :caption="c.ui.codeCaption" />
        </div>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>

    <template #checks>
      <CodeBlock :code="c.ui.scene" :caption="c.ui.sceneCaption" />
    </template>
  </ChapterPage>
</template>
