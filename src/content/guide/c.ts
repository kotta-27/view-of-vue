import type { ChapterContent } from '../types'

const compare = `<script setup>
import { computed, reactive, ref, watch } from 'vue'

const count = ref(1)                         // one value
const user = reactive({ name: 'Aoi' })       // one object
const double = computed(() => count.value * 2) // derived value
const log = ref('')

watch(count, n => {                          // side effect on change
  log.value = 'count is now ' + n
})
</script>

<template>
  <button @click="count++">count: {{ count }}</button>
  <button @click="user.name = 'Ren'">rename</button>
  <p>{{ user.name }} / double: {{ double }}</p>
  <p>{{ log }}</p>
</template>
`

const unwrap = `const count = ref(0)

// .value is needed in script
count.value++

// Unwrapped automatically in templates
// <p>{{ count }}</p>

const state = reactive({ count: 0 })
// Replacing the object loses reactivity
// state = reactive({ count: 1 })  // NG`

export default {
  ja: {
    lead: '<p>状態を持つ API は多いが、使い分けは単純である。基本は <code>ref</code>、計算で求まる値は <code>computed</code>、変化に応じた副作用は <code>watch</code> を使う。仕組みは第 1 部で詳しく扱う。<code>computed</code> と <code>watch</code> はここで初めて出てくるので、まず下の例を動かす。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: '使い分け', body: '<p>公式は状態の宣言に <code>ref</code> を第一に勧めている。<code>reactive</code> はオブジェクトにしか使えず、丸ごと置き換えたり分割代入したりすると反応性を失う。ほかの値から決まるものは状態にせず <code>computed</code> にする。<code>watch</code> は通信や保存など、画面の外に働きかける処理に使う。</p>', run: compare },
      { title: '.value の付け外し', body: '<p>スクリプトでは <code>.value</code> が必要で、テンプレートでは自動で取り出される。</p>', show: unwrap },
    ],
    easy: {
      intro: '<p>迷ったら <code>ref</code> を使う。「値を覚えておきたい」なら <code>ref</code>、「ほかの値から計算したい」なら <code>computed</code>、「値が変わったら何かしたい」なら <code>watch</code> である。</p>',
      terms: [
        { term: '状態', desc: 'アプリが覚えておく値。画面はこの値から作られる。' },
        { term: '宣言', desc: '変数などを用意すること。' },
        { term: '副作用', desc: '通信や保存など、画面の外に影響を与える処理。' },
      ],
    },
    exercise: { title: '状態を computed に置き換える', task: '<code>total</code> を手で更新している。<code>computed</code> に書き換えて、<code>add</code> の中の更新を消す。', todo: 'total を computed にする' },
    ui: {},
  },
  en: {
    lead: '<p>There are many stateful APIs, but the choice is simple. Default to <code>ref</code>, use <code>computed</code> for derived values, and <code>watch</code> for side effects on change. Part 1 covers how they work. <code>computed</code> and <code>watch</code> are new here, so start by running the example below.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'Which to use', body: '<p>The official docs recommend <code>ref</code> as the primary way to declare state. <code>reactive</code> only works on objects and loses reactivity when replaced or destructured. Anything derivable belongs in <code>computed</code>, not in state. Use <code>watch</code> for work outside the screen, such as network calls or saving.</p>', run: compare },
      { title: 'When .value is needed', body: '<p>Scripts need <code>.value</code>. Templates unwrap it automatically.</p>', show: unwrap },
    ],
    easy: {
      intro: '<p>When unsure, use <code>ref</code>. To remember a value, <code>ref</code>. To calculate from other values, <code>computed</code>. To do something when a value changes, <code>watch</code>.</p>',
      terms: [
        { term: 'State', desc: 'Values the app remembers. The screen is built from them.' },
        { term: 'Declare', desc: 'To create something such as a variable.' },
        { term: 'Side effect', desc: 'Work that affects things outside the screen, such as a network call.' },
      ],
    },
    exercise: { title: 'Replace state with computed', task: '<code>total</code> is being updated by hand. Make it a <code>computed</code> and remove the update from <code>add</code>.', todo: 'Make total a computed' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { computed, ref } from 'vue'

const price = ref(100)
const qty = ref(1)

// TODO
const total = ref(100)

function add() {
  qty.value++
}
</script>

<template>
  <button @click="add">add</button>
  <button id="price" @click="price = 200">price 200</button>
  <p>{{ total }}</p>
</template>
`,
    solution: `<script setup>
import { computed, ref } from 'vue'

const price = ref(100)
const qty = ref(1)

const total = computed(() => price.value * qty.value)

function add() {
  qty.value++
}
</script>

<template>
  <button @click="add">add</button>
  <button id="price" @click="price = 200">price 200</button>
  <p>{{ total }}</p>
</template>
`,
    check: `await click('button')
assert(text('p') === '200', '数量 2 で 200 になるはずです', 'With qty 2 the total should be 200')
await click('#price')
assert(text('p') === '400', '単価を変えると 400 になるはずです', 'After the price change it should be 400')`,
  },
} satisfies ChapterContent
