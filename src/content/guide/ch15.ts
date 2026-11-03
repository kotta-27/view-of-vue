import type { ChapterContent } from '../types'

const store = `import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const items = ref<number[]>([])                     // state
  const total = computed(() => items.value.reduce((a, b) => a + b, 0)) // getter
  function add(price: number) {                       // action
    items.value.push(price)
  }
  return { items, total, add }
})

// main.ts
createApp(App).use(createPinia()).mount('#app')`

const use = `<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from './stores/cart'

const cart = useCartStore()
const { items, total } = storeToRefs(cart)  // Keeps reactivity
const { add } = cart                        // Actions can be taken directly
</script>

<template>
  <button @click="add(100)">{{ total }}</button>
</template>`

export default {
  ja: {
    lead: '<p>複数の画面で同じ状態を使うなら、Pinia で store を作る。Pinia は Vue の公式の状態管理ライブラリである。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'store を定義する', body: '<p>セットアップ形式では、普通の Composition API と同じように書く。<code>ref</code> が state、<code>computed</code> が getter、関数が action になる。state はすべて <code>return</code> する必要がある。</p>', show: store },
      { title: 'store を使う', body: '<p>同じ id の store はアプリ全体で共有される。store を分割代入すると反応性を失うので、state と getter は <code>storeToRefs</code> で取り出す。関数はそのまま取り出してよい。</p>', show: use },
      { title: 'いつ使うか', body: '<p>すべての状態を store に入れる必要はない。1 つの画面で閉じる値はコンポーネントに置く。ログイン中の利用者やカートのように、離れた画面で共有する値を store に入れる。セットアップ形式の store には <code>$reset</code> がないので、初期化は自分で action を書く。</p>' },
    ],
    easy: {
      intro: '<p>親から子へ props で渡す方法は、離れた画面同士では大変になる。store は全員が見に行ける共有の黒板である。誰かが書き換えると、見ている画面がすべて更新される。</p><p>本質は「コンポーネントの外に置いた状態」である。下の演習で確かめる。</p>',
      terms: [
        { term: '状態管理', desc: '複数の画面で使う状態を 1 か所で扱うこと。' },
        { term: 'store', desc: '共有する状態と、その操作をまとめたもの。' },
        { term: 'getter', desc: 'store の状態から計算した値。' },
        { term: 'action', desc: 'store の状態を変更する関数。' },
      ],
    },
    exercise: { title: '共有される状態を作る', task: '2 つのカウンターが同じ値を共有するように、<code>count</code> を <code>useCounter</code> の外へ移す。', todo: 'count を関数の外へ移す' },
    ui: {},
  },
  en: {
    lead: '<p>When several screens use the same state, create a store with Pinia, the official state management library for Vue.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'Define a store', body: '<p>A setup store reads like the normal Composition API. <code>ref</code> becomes state, <code>computed</code> a getter, and a function an action. All state must be returned.</p>', show: store },
      { title: 'Use a store', body: '<p>Stores with the same id are shared across the app. Destructuring a store loses reactivity, so extract state and getters with <code>storeToRefs</code>. Functions can be taken directly.</p>', show: use },
      { title: 'When to use one', body: '<p>Not all state belongs in a store. Keep values local to one screen in the component. Use a store for values shared across distant screens, such as the current user or a cart. Setup stores have no <code>$reset</code>, so write an action for resetting.</p>' },
    ],
    easy: {
      intro: '<p>Passing props from parent to child gets painful between distant screens. A store is a shared blackboard everyone can read. When someone changes it, every screen looking at it updates.</p><p>At heart, it is state kept outside the components. The exercise below shows that.</p>',
      terms: [
        { term: 'State management', desc: 'Handling state used by several screens in one place.' },
        { term: 'Store', desc: 'Shared state and the operations on it.' },
        { term: 'Getter', desc: 'A value calculated from store state.' },
        { term: 'Action', desc: 'A function that changes store state.' },
      ],
    },
    exercise: { title: 'Create shared state', task: 'Move <code>count</code> outside <code>useCounter</code> so the two counters share one value.', todo: 'Move count outside the function' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { defineComponent, ref } from 'vue'

function useCounter() {
  // TODO
  const count = ref(0)
  return { count }
}

const Counter = defineComponent({
  setup: () => useCounter(),
  template: '<button @click="count++">{{ count }}</button>',
})
</script>

<template>
  <Counter />
  <Counter />
</template>
`,
    solution: `<script setup>
import { defineComponent, ref } from 'vue'

const count = ref(0)

function useCounter() {
  return { count }
}

const Counter = defineComponent({
  setup: () => useCounter(),
  template: '<button @click="count++">{{ count }}</button>',
})
</script>

<template>
  <Counter />
  <Counter />
</template>
`,
    check: `const buttons = document.querySelectorAll('button')
buttons[0].click()
await tick()
assert(buttons[1].textContent === '1', '片方を押すともう片方も 1 になるはずです', 'Pressing one should make the other show 1')`,
  },
} satisfies ChapterContent
