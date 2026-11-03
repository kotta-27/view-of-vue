import type { ChapterContent } from './types'

export default {
  ja: {
    lead: '<p>状態を 3 回更新しても、再描画は 1 回で済む。コンポーネントの更新処理はジョブとしてキューに登録され、現在の同期処理が終わった後に、マイクロタスクでまとめて実行される。</p>',
    steps: [
      "<b>更新の集約。</b>状態を 3 回更新しても描画は 1 回である。<code>flush: 'sync'</code> の watcher だけは更新のたびに実行される。同期コードの終了時点では、DOM はまだ更新されていない。",
      '<b>親から子の順に処理される。</b>子、親の順に更新しても、描画は親、子の順になる。ジョブはコンポーネントの <code>uid</code> の順に並ぶ。親の更新で子がアンマウントされる場合に、不要な描画を避けるためである。',
      '<b>flush の分割。</b><code>await nextTick()</code> を挟むと flush が完了するため、描画は 2 回になる。',
      '<b>実行順序。</b>順序は <code>pre</code> watcher、描画、<code>post</code> watcher、<code>nextTick</code> である。更新後の DOM を読む処理は、<code>post</code> か <code>nextTick</code> に書く。',
    ],
    impl: [
      '<code>queueJob</code> はジョブの <code>flags</code> で重複登録を防ぎ、<code>findInsertionIndex</code> で id の順に挿入する。',
      '<code>queueFlush</code> は <code>resolvedPromise.then(flushJobs)</code> で実行を予約する。マイクロタスクのため、ブラウザの描画より前に完了する。',
      '<code>nextTick</code> は <code>currentFlushPromise.then(fn)</code> であり、実行中の flush の完了を待つ。',
    ],
    method: '本物の Vue。右の記録は実際の実行順序である。キューの表示は、記録と各更新の依存関係から再構成したものである。',
    easy: {
      intro: '<p>宅配便を想像してほしい。荷物が 1 個増えるたびにトラックを出すより、集めてから 1 回で運ぶ方が速い。Vue も同じで、値が何度変わっても、画面の更新は処理の区切りでまとめて 1 回行う。</p><p>このため、値を変えた直後の DOM はまだ古い。更新後の DOM を読みたいときは <code>await nextTick()</code> で更新を待つ。</p>',
      terms: [
        { term: 'DOM', desc: 'Document Object Model の略。ブラウザが画面を管理するための、HTML の木構造。' },
        { term: '同期処理', desc: '上から順に、途中で止まらず実行される処理。' },
        { term: 'マイクロタスク', desc: '今の処理が終わった直後に実行される予約。Promise の then など。' },
        { term: 'キュー', desc: '順番待ちの列。Vue は描画の仕事をここに並べる。' },
        { term: 'flush', desc: 'キューにたまった仕事をまとめて実行すること。' },
        { term: 'nextTick', desc: '次の DOM 更新が終わるのを待つための関数。' },
      ],
    },
    exercise: {
      title: '更新後の DOM を読む',
      task: 'ボタンを押すと <code>seen</code> に 1 つ古い値が入ってしまう。DOM の更新を待ってから読むように直す。',
      todo: 'DOM の更新を待つ',
    },
    ui: {
      figTitle: '図 4-1 更新の処理順序',
      figCaption: '右の記録は、コンポーネントと watcher が実際に出力した順序である。',
      three: '同期的に 3 回更新',
      childFirst: '子を先に更新',
      withTick: 'nextTick を挟む',
      syncCode: '同期処理',
      ended: '実行終了',
      render: '描画',
      queue: 'キュー',
      empty: '空',
      changes: '状態の更新',
      idle: '上のボタンを押すと、本物の Vue の実行順序を記録して再生する',
      codeCaption: '実行するコード',
      running: '実行中のコンポーネント:',
      laneSync: '同期',
      laneRender: '描画',
      stages: '処理の段階',
    },
  },
  en: {
    lead: '<p>Update state three times and the component still renders once. Update work is queued as a job, then run together in a microtask after the current synchronous code finishes.</p>',
    steps: [
      "<b>Updates are grouped.</b> Three updates, one render. Only a <code>flush: 'sync'</code> watcher runs on every update. When the synchronous code ends, the DOM is still old.",
      '<b>Parents run before children.</b> Update the child first and the parent second: the render order is still parent, then child. Jobs are sorted by component <code>uid</code>, which avoids rendering a child that the parent update would remove.',
      '<b>Splitting a flush.</b> <code>await nextTick()</code> lets the flush finish, so there are two renders.',
      '<b>Order of execution.</b> The order is <code>pre</code> watchers, render, <code>post</code> watchers, <code>nextTick</code>. Code that reads the updated DOM belongs in <code>post</code> or <code>nextTick</code>.',
    ],
    impl: [
      '<code>queueJob</code> uses the job <code>flags</code> to avoid duplicates, and <code>findInsertionIndex</code> keeps the queue sorted by id.',
      '<code>queueFlush</code> schedules the work with <code>resolvedPromise.then(flushJobs)</code>. Being a microtask, it finishes before the browser paints.',
      '<code>nextTick</code> is <code>currentFlushPromise.then(fn)</code>, so it simply waits for the running flush.',
    ],
    method: 'The real Vue. The log on the right is the actual execution order. The queue view is reconstructed from that log and the dependencies of each update.',
    easy: {
      intro: '<p>Think of a delivery truck. Collecting parcels and making one trip beats sending a truck for every parcel. Vue works the same way: however many times a value changes, the screen updates once at the end of the current work.</p><p>So right after you change a value, the DOM is still old. To read the updated DOM, wait with <code>await nextTick()</code>.</p>',
      terms: [
        { term: 'DOM', desc: 'Short for Document Object Model. The tree of HTML elements the browser keeps for the page.' },
        { term: 'Synchronous code', desc: 'Code that runs from top to bottom without pausing.' },
        { term: 'Microtask', desc: 'Work scheduled to run right after the current code, like a Promise then.' },
        { term: 'Queue', desc: 'A waiting line. Vue lines up rendering work here.' },
        { term: 'Flush', desc: 'Running all the queued work at once.' },
        { term: 'nextTick', desc: 'A function that waits for the next DOM update to finish.' },
      ],
    },
    exercise: {
      title: 'Read the DOM after the update',
      task: 'Pressing the button stores a value that is one step behind in <code>seen</code>. Wait for the DOM update before reading it.',
      todo: 'Wait for the DOM update',
    },
    ui: {
      figTitle: 'Figure 4-1 Order of update processing',
      figCaption: 'The log on the right is the order the components and watchers actually produced.',
      three: 'Update 3 times synchronously',
      childFirst: 'Update the child first',
      withTick: 'Insert nextTick',
      syncCode: 'Sync code',
      ended: 'Code ends',
      render: 'Render',
      queue: 'Queue',
      empty: 'empty',
      changes: 'State updates',
      idle: 'Press a button above to record and replay the real order of execution',
      codeCaption: 'Code being run',
      running: 'Live components:',
      laneSync: 'sync',
      laneRender: 'render',
      stages: 'Stages of processing',
    },
  },
  exercise: {
    starter: `<script setup>
import { ref, nextTick } from 'vue'

const count = ref(0)
const seen = ref('')
const el = ref(null)

async function add() {
  count.value++
  // TODO
  seen.value = el.value.textContent
}
</script>

<template>
  <button @click="add">add</button>
  <span ref="el">{{ count }}</span>
  <p>{{ seen }}</p>
</template>
`,
    solution: `<script setup>
import { ref, nextTick } from 'vue'

const count = ref(0)
const seen = ref('')
const el = ref(null)

async function add() {
  count.value++
  await nextTick()
  seen.value = el.value.textContent
}
</script>

<template>
  <button @click="add">add</button>
  <span ref="el">{{ count }}</span>
  <p>{{ seen }}</p>
</template>
`,
    check: `await click('button')
await wait(30)
assert(text('p') === '1', '1 回押したら seen は 1 になるはずです', 'After one click seen should be 1')`,
  },
} satisfies ChapterContent
