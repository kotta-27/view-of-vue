<script setup lang="ts">
import { computed, defineComponent, h, nextTick, ref, shallowRef, watch, type Ref } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'
import StepBar from '../components/StepBar.vue'
import ChapterPage from '../components/ChapterPage.vue'
import { useStepper } from '../composables/useStepper'
import content from '../content/ch04'
import { pick, say } from '../lib/settings'

type Lane = 'sync' | 'pre' | 'render' | 'post' | 'tick' | 'note'

interface Entry {
  lane: Lane
  text: string
  /** この書き換えで列に並ぶ仕事 */
  jobs?: string[]
  /** この記録で列から降りる仕事 */
  job?: string
}

interface SchedFrame {
  entry: Entry
  index: number
  queue: string[]
  flushes: number
}

const JOB_ORDER = ['pre watcher', 'Parent', 'Child', 'post watcher']
const COUNT_JOBS = ['pre watcher', 'Parent', 'post watcher']

const c = computed(() => pick(content))
const laneLabel = (lane: Lane) =>
  ({ sync: c.value.ui.laneSync, pre: 'pre', render: c.value.ui.laneRender, post: 'post', tick: 'tick', note: '—' })[lane]

let entries: Entry[] = []
let recording = false
const log = (lane: Lane, text: string, extra: Partial<Entry> = {}) => {
  if (recording) entries.push({ lane, text, ...extra })
}

// 本物のコンポーネント。実行順の記録はここから取る
const count = ref(0)
const childCount = ref(0)
const parentEl = ref<HTMLElement>()
const domText = () => parentEl.value?.textContent ?? ''

const Child = defineComponent({
  setup: () => () => {
    log('render', say(`Child を描画 (child = ${childCount.value})`, `Render Child (child = ${childCount.value})`), { job: 'Child' })
    return h('span', `child ${childCount.value}`)
  },
})

const Parent = defineComponent({
  setup() {
    watch(count, v => log('sync', `sync watcher: count = ${v}`), { flush: 'sync' })
    watch(count, v => log('pre', `pre watcher: count = ${v}, DOM = ${domText()}`, { job: 'pre watcher' }))
    watch(count, v => log('post', `post watcher: count = ${v}, DOM = ${domText()}`, { job: 'post watcher' }), { flush: 'post' })
    return () => {
      log('render', say(`Parent を描画 (count = ${count.value})`, `Render Parent (count = ${count.value})`), { job: 'Parent' })
      return h('p', { class: 'sched-real-row' }, [h('span', { ref: parentEl }, `${count.value}`), ' ', h(Child)])
    }
  },
})

function bump(target: Ref<number>, name: string, jobs: string[]) {
  log('sync', `${name}.value++ (${target.value} → ${target.value + 1})`, { jobs })
  target.value++
}

function endSync() {
  log('note', say(`同期コードの終了時点。DOM は ${domText()} のまま`, `Synchronous code ended. The DOM is still ${domText()}`))
}

async function finish() {
  nextTick(() => log('tick', `nextTick callback: DOM = ${domText()}`))
  await nextTick()
}

const SCENARIOS = [
  {
    name: 'three',
    code: `count.value++
count.value++
count.value++
nextTick(() => console.log(el.textContent))`,
    async run() {
      bump(count, 'count', COUNT_JOBS)
      bump(count, 'count', COUNT_JOBS)
      bump(count, 'count', COUNT_JOBS)
      endSync()
      await finish()
    },
  },
  {
    name: 'childFirst',
    code: `child.value++   // child first
count.value++   // parent second
nextTick(() => console.log(el.textContent))`,
    async run() {
      bump(childCount, 'child', ['Child'])
      bump(count, 'count', COUNT_JOBS)
      endSync()
      await finish()
    },
  },
  {
    name: 'withTick',
    code: `count.value++
await nextTick()   // flushes here
count.value++
await nextTick()   // second flush`,
    async run() {
      bump(count, 'count', COUNT_JOBS)
      log('note', say('await nextTick() で待機する', 'Wait with await nextTick()'))
      await nextTick()
      log('note', say('待機が終わり、処理を再開する', 'Done waiting, resume'))
      bump(count, 'count', COUNT_JOBS)
      endSync()
      await finish()
    },
  },
]

function toFrames(list: Entry[]): SchedFrame[] {
  let flushes = 0
  let inFlush = false
  let queue: string[] = []
  return list.map((entry, index) => {
    if (entry.jobs) {
      inFlush = false
      queue = [...new Set([...queue, ...entry.jobs])].sort(
        (a, b) => JOB_ORDER.indexOf(a) - JOB_ORDER.indexOf(b),
      )
    }
    if (entry.job) {
      if (!inFlush) flushes++
      inFlush = true
      queue = queue.filter(j => j !== entry.job)
    }
    return { entry, index, queue, flushes }
  })
}

const frames = shallowRef<SchedFrame[]>([])
const stepper = useStepper(frames)
const scenario = ref(SCENARIOS[0])
const running = ref(false)

async function depart(s: (typeof SCENARIOS)[number]) {
  if (running.value) return
  running.value = true
  scenario.value = s
  entries = []
  recording = true
  await s.run()
  recording = false
  frames.value = toFrames(entries)
  running.value = false
  stepper.restart()
}

const frame = computed(() => stepper.current.value)
const shown = computed(() => (frame.value ? frames.value.slice(0, frame.value.index + 1) : []))
const renderCount = computed(() => shown.value.filter(f => f.entry.lane === 'render').length)
const changeCount = computed(() => shown.value.filter(f => f.entry.jobs).length)

const stages = computed((): { lane: Lane; label: string; sub: string }[] => [
  { lane: 'sync', label: c.value.ui.syncCode, sub: 'sync' },
  { lane: 'note', label: c.value.ui.ended, sub: 'microtask' },
  { lane: 'pre', label: 'pre', sub: 'watcher' },
  { lane: 'render', label: c.value.ui.render, sub: 'patch' },
  { lane: 'post', label: 'post', sub: 'watcher' },
  { lane: 'tick', label: 'nextTick', sub: 'then' },
])
const stageIndex = computed(() => stages.value.findIndex(s => s.lane === frame.value?.entry.lane))

const SOURCES: [string, string][] = [
  ['packages/runtime-core/src/scheduler.ts', 'queueJob, queueFlush, flushJobs, nextTick'],
  ['packages/runtime-core/src/apiWatch.ts', 'doWatch'],
]
</script>

<template>
  <ChapterPage :no="4" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="actions is-top">
          <button
            v-for="s in SCENARIOS"
            :key="s.name"
            class="btn"
            :class="{ 'is-primary': scenario === s }"
            :disabled="running"
            @click="depart(s)"
          >
            {{ (c.ui as Record<string, string>)[s.name] }}
          </button>
        </div>

        <div class="fig-grid">
          <div class="fig-main">
            <ol class="pipe" :aria-label="c.ui.stages">
              <li
                v-for="(s, i) in stages"
                :key="s.lane"
                :class="{ 'is-on': i === stageIndex, 'is-past': stageIndex > i }"
              >
                {{ s.label }}<small>{{ s.sub }}</small>
              </li>
            </ol>

            <div class="queue">
              <span class="queue-label">{{ c.ui.queue }}</span>
              <TransitionGroup name="tile" tag="div" class="queue-tiles">
                <span v-for="j in frame?.queue ?? []" :key="j" class="job">{{ j }}</span>
              </TransitionGroup>
              <span v-if="!frame?.queue.length" class="queue-empty">{{ c.ui.empty }}</span>
            </div>

            <dl class="meters is-small">
              <div><dt>{{ c.ui.changes }}</dt><dd>{{ changeCount }}</dd></div>
              <div class="is-key"><dt>{{ c.ui.render }}</dt><dd>{{ renderCount }}</dd></div>
              <div><dt>flush</dt><dd>{{ frame?.flushes ?? 0 }}</dd></div>
            </dl>

            <StepBar
              :stepper="stepper"
              :total="frames.length"
              :note="frame?.entry.text ?? c.ui.idle"
            />
          </div>

          <div class="sched-side">
            <CodeBlock :code="scenario.code" :caption="c.ui.codeCaption" />
            <ol class="runlog">
              <li v-for="f in shown" :key="f.index" :class="`lane-${f.entry.lane}`">
                <span>{{ laneLabel(f.entry.lane) }}</span>{{ f.entry.text }}
              </li>
            </ol>
          </div>
        </div>

        <div class="sched-real">
          <span>{{ c.ui.running }}</span>
          <Parent />
        </div>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>
  </ChapterPage>
</template>
