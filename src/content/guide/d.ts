import type { ChapterContent } from '../types'

const cond = `<script setup>
import { ref } from 'vue'

const status = ref('idle')
const open = ref(true)
</script>

<template>
  <button @click="status = status === 'idle' ? 'done' : 'idle'">status</button>
  <p v-if="status === 'idle'">Waiting</p>
  <p v-else>Finished</p>

  <button @click="open = !open">open</button>
  <p v-show="open">Kept in the DOM</p>
</template>
`

const list = `<script setup>
import { computed, ref } from 'vue'

const todos = ref([
  { id: 1, text: 'Read', done: true },
  { id: 2, text: 'Write', done: false },
])

const active = computed(() => todos.value.filter(t => !t.done))
</script>

<template>
  <ul>
    <li v-for="todo in active" :key="todo.id">{{ todo.text }}</li>
  </ul>
  <p>{{ active.length }} left</p>
</template>
`

export default {
  ja: {
    lead: '<p>状態に応じて要素を出し分けるには <code>v-if</code>、配列を繰り返すには <code>v-for</code> を使う。一覧には必ず <code>key</code> を付ける。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'v-if と v-show', body: '<p><code>v-if</code> は条件が偽のとき要素を作らない。<code>v-show</code> は要素を作ったまま CSS の <code>display</code> で隠す。切り替えが多いなら <code>v-show</code>、条件が滅多に変わらないなら <code>v-if</code> が向く。</p>', run: cond },
      { title: 'v-for と key', body: '<p><code>key</code> には各項目を一意に識別する値を渡す。配列の添字を使うと、並べ替えたときに状態がずれる（第 6 章）。同じ要素に <code>v-if</code> と <code>v-for</code> を付けると <code>v-if</code> が先に評価され、ループの変数を読めない。絞り込みは <code>computed</code> で行う。</p>', run: list },
    ],
    easy: {
      intro: '<p><code>v-if</code> は「条件が合うときだけ出す」、<code>v-for</code> は「配列の数だけ繰り返す」という指示である。一覧の各行に <code>key</code> という名札を付けると、Vue がどの行かを見分けられる。</p>',
      terms: [
        { term: '配列', desc: '値を順番に並べたもの。<code>[1, 2, 3]</code>。' },
        { term: 'ディレクティブ', desc: '<code>v-</code> で始まる、テンプレートの特別な属性。' },
        { term: '一意', desc: 'ほかと重ならないこと。' },
      ],
    },
    exercise: { title: '完了していない項目だけ表示する', task: '<code>active</code> を <code>computed</code> で作り、<code>done</code> が <code>false</code> の項目だけを一覧に出す。', todo: 'done が false の項目を computed で絞り込む' },
    ui: {},
  },
  en: {
    lead: '<p>Use <code>v-if</code> to show elements conditionally and <code>v-for</code> to repeat them over an array. Lists must always have a <code>key</code>.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'v-if and v-show', body: '<p><code>v-if</code> does not create the element while the condition is false. <code>v-show</code> keeps it and hides it with CSS <code>display</code>. Prefer <code>v-show</code> for frequent toggling and <code>v-if</code> when the condition rarely changes.</p>', run: cond },
      { title: 'v-for and key', body: '<p>Give <code>key</code> a value that uniquely identifies each item. An array index shifts state when the list is reordered (chapter 6). With <code>v-if</code> and <code>v-for</code> on one element, <code>v-if</code> runs first and cannot read the loop variable. Filter with <code>computed</code> instead.</p>', run: list },
    ],
    easy: {
      intro: '<p><code>v-if</code> means "show this only when the condition holds". <code>v-for</code> means "repeat this for each item of the array". Each row gets a name tag called <code>key</code>, so Vue can tell rows apart.</p>',
      terms: [
        { term: 'Array', desc: 'Values in order: <code>[1, 2, 3]</code>.' },
        { term: 'Directive', desc: 'A special template attribute starting with <code>v-</code>.' },
        { term: 'Unique', desc: 'Not shared with anything else.' },
      ],
    },
    exercise: { title: 'Show only unfinished items', task: 'Create <code>active</code> with <code>computed</code> and list only items whose <code>done</code> is <code>false</code>.', todo: 'Filter items with done false, using computed' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { computed, ref } from 'vue'

const todos = ref([
  { id: 1, text: 'Read', done: true },
  { id: 2, text: 'Write', done: false },
])

// TODO
const active = todos
</script>

<template>
  <button @click="todos[1].done = true">finish</button>
  <ul>
    <li v-for="todo in active" :key="todo.id">{{ todo.text }}</li>
  </ul>
</template>
`,
    solution: `<script setup>
import { computed, ref } from 'vue'

const todos = ref([
  { id: 1, text: 'Read', done: true },
  { id: 2, text: 'Write', done: false },
])

const active = computed(() => todos.value.filter(t => !t.done))
</script>

<template>
  <button @click="todos[1].done = true">finish</button>
  <ul>
    <li v-for="todo in active" :key="todo.id">{{ todo.text }}</li>
  </ul>
</template>
`,
    check: `assert(document.querySelectorAll('li').length === 1 && text('li') === 'Write', 'Write だけが表示されるはずです', 'Only Write should be listed')
await click('button')
assert(document.querySelectorAll('li').length === 0, '完了すると一覧は空になるはずです', 'The list should be empty after finishing')`,
  },
} satisfies ChapterContent
