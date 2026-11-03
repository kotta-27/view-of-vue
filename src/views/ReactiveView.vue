<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'
import StepBar from '../components/StepBar.vue'
import ChapterPage from '../components/ChapterPage.vue'
import { useStepper } from '../composables/useStepper'
import content from '../content/ch02'
import { pick, say } from '../lib/settings'
import { explain } from '../lib/explain'
import { ITERATE, MINI_REACTIVE_SOURCE, reactiveLinesFor, World, type Frame } from '../lib/mini'

const KEYS = ['name', 'age', 'city', ITERATE]
const EFFECTS = [
  { name: 'A', body: 'user.name' },
  { name: 'B', body: 'user.age' },
  { name: 'C', body: 'Object.keys(user).length' },
]

const c = computed(() => pick(content))

const frames = shallowRef<Frame[]>([])
const stepper = useStepper(frames)

let world: World
let user: { name: string; age: number; city?: string }

function reset() {
  world = new World()
  const created = world.reactive('user', { name: 'Aoi', age: 20 } as Record<string, unknown>)
  user = created as typeof user
  frames.value = [
    ...world.record(c.value.ui.starting, () => {
      world.effect('A', () => String(user.name))
      world.effect('B', () => String(user.age))
      world.effect('C', () => `${Object.keys(user).length} ${c.value.ui.keysCount}`)
    }),
  ]
  stepper.restart(false)
  stepper.seek(frames.value.length - 1)
}
reset()

function act(note: string, fn: () => void) {
  frames.value = [...world.record(note, fn)]
  stepper.restart()
}

function destructure() {
  act(c.value.ui.doDestructure, () => {
    let { age } = user
    age++
    const kept = world.frames.at(-1)!.values['user.age']
    world.local(
      say(
        `ローカル変数 age は ${age} になった。Proxy を経由しないため user.age は ${kept} のままで、通知も発生しない`,
        `The local age is now ${age}. It bypasses the Proxy, so user.age stays ${kept} and nothing is notified`,
      ),
    )
  })
}

const frame = computed(() => stepper.current.value ?? frames.value[0])
const note = computed(() => explain(frame.value.trace))
const highlight = computed(() => reactiveLinesFor(frame.value.trace))

const rows = computed(() =>
  KEYS.map(key => {
    const dep = `user.${key}`
    return {
      key,
      dep,
      effects: frame.value.links.filter(([d]) => d === dep).map(([, e]) => e),
      value: frame.value.values[dep],
    }
  }).filter(r => r.effects.length > 0 || r.value !== undefined),
)

const trap = computed(() => {
  const t = frame.value.trace
  if (t.kind === 'get') return t.dep.endsWith(ITERATE) ? 'ownKeys' : 'get'
  if (t.kind === 'set' || t.kind === 'skip') return 'set'
  return ''
})
const activeDep = computed(() => {
  const t = frame.value.trace
  return 'dep' in t ? t.dep : ''
})
const called = computed(() => {
  const t = frame.value.trace
  return t.kind === 'trigger' ? t.effects : []
})

const SOURCES: [string, string][] = [
  ['packages/reactivity/src/reactive.ts', 'reactive, createReactiveObject'],
  ['packages/reactivity/src/baseHandlers.ts', 'MutableReactiveHandler'],
  ['packages/reactivity/src/collectionHandlers.ts', 'mutableCollectionHandlers'],
  ['packages/reactivity/src/dep.ts', 'targetMap, ITERATE_KEY, track, trigger'],
]
</script>

<template>
  <ChapterPage :no="2" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.mechanism }}</h2>
      <div v-html="c.ui.mechanismBody"></div>
    </section>

    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="fig-grid">
          <div class="fig-main">
            <div class="traps">
              <span class="traps-label">Proxy</span>
              <span class="trap" :class="{ 'is-on': trap === 'get' }">get</span>
              <span class="trap" :class="{ 'is-on': trap === 'set' }">set</span>
              <span class="trap" :class="{ 'is-on': trap === 'ownKeys' }">ownKeys</span>
            </div>

            <div class="depmap">
              <div>
                <h3>targetMap<small>WeakMap</small></h3>
                <div class="dep-target">user</div>
              </div>
              <div>
                <h3>depsMap<small>{{ c.ui.depsMapNote }}</small></h3>
                <div v-for="r in rows" :key="r.key" class="dep-row" :class="{ 'is-on': activeDep === r.dep }">
                  <span class="dep-key">{{ r.key === ITERATE ? 'ITERATE_KEY' : r.key }}</span>
                  <span v-if="r.value !== undefined" class="dep-val">{{ r.value }}</span>
                  <span class="dep-subs">
                    <i
                      v-for="e in r.effects"
                      :key="e"
                      class="chip"
                      :class="{ 'is-hot': called.includes(e) && activeDep === r.dep }"
                    >{{ e }}</i>
                    <i v-if="!r.effects.length" class="chip-none">{{ c.ui.none }}</i>
                  </span>
                </div>
              </div>
            </div>

            <ul class="effect-list">
              <li v-for="e in EFFECTS" :key="e.name" :class="{ 'is-on': frame.running === e.name }">
                <b>{{ e.name }}</b>
                <code>{{ e.body }}</code>
                <span>{{ frame.outputs[e.name] ?? c.ui.notRun }}</span>
              </li>
            </ul>
            <StepBar :stepper="stepper" :total="frames.length" :note="note" />
            <div class="actions">
              <button class="btn" @click="act(c.ui.doName, () => (user.name = user.name === 'Aoi' ? 'Ren' : 'Aoi'))">{{ c.ui.updName }}</button>
              <button class="btn" @click="act(c.ui.doAge, () => user.age++)">user.age++</button>
              <button class="btn" @click="act(c.ui.doCity, () => (user.city = user.city === 'Kyoto' ? 'Nara' : 'Kyoto'))">{{ c.ui.addCity }}</button>
              <button class="btn is-warn" @click="destructure">{{ c.ui.destructure }}</button>
              <button class="btn is-quiet" @click="reset">{{ c.ui.reset }}</button>
            </div>
          </div>
          <CodeBlock :code="MINI_REACTIVE_SOURCE" :highlight="highlight" :caption="c.ui.codeCaption" />
        </div>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>
  </ChapterPage>
</template>
