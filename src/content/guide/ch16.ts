import type { ChapterContent } from '../types'

const transition = `<script setup>
import { ref } from 'vue'

const show = ref(true)
</script>

<template>
  <button @click="show = !show">toggle</button>
  <Transition name="fade">
    <p v-if="show">Fades in and out</p>
  </Transition>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity .4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
`

const teleport = `<script setup>
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <button @click="open = true">open</button>
  <Teleport to="body">
    <div v-if="open" style="border: 1px solid; padding: 8px; margin-top: 8px">
      Rendered at the end of body
      <button @click="open = false">close</button>
    </div>
  </Teleport>
</template>
`

const suspense = `<Suspense>
  <UserProfile />            <!-- Has an async setup -->
  <template #fallback>
    <p>Loading</p>
  </template>
</Suspense>`

export default {
  ja: {
    lead: '<p>Vue には追加のインストールなしで使える組み込みコンポーネントがある。出入りのアニメーション、状態の保持、DOM の移動、非同期の待ち合わせを担う。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'Transition', body: '<p>要素が現れるとき、消えるときに CSS クラスを付ける。<code>name="fade"</code> なら <code>fade-enter-from</code> などのクラスが順に付く。一覧の追加と移動には <code>TransitionGroup</code> を使う。</p>', run: transition },
      { title: 'KeepAlive', body: '<p>切り替えで消えるコンポーネントの状態を保持する。下の演習で確かめる。表示と非表示の時点では <code>onActivated</code> と <code>onDeactivated</code> が呼ばれる。</p>' },
      { title: 'Teleport', body: '<p>コンポーネントの中身を、DOM の別の場所へ描画する。モーダルやトーストのように、親の <code>overflow</code> や重なり順の影響を避けたいときに使う。論理的な親子関係は変わらない。</p>', run: teleport },
      { title: 'Suspense', body: '<p>内側の非同期処理が終わるまで代わりの内容を出す。公式は実験的な機能としており、API が変わる可能性がある。製品で使うときは注意する。</p>', show: suspense },
    ],
    easy: {
      intro: '<p>どれも特定の困りごとを解決する道具である。ふわっと出したいなら <code>Transition</code>、タブを切り替えても入力を残したいなら <code>KeepAlive</code>、画面全体に重ねるモーダルを作るなら <code>Teleport</code> を使う。</p>',
      terms: [
        { term: 'モーダル', desc: '画面の上に重ねて表示する小さな窓。' },
        { term: 'トースト', desc: '画面の端に短時間だけ出る通知。' },
        { term: 'fallback', desc: '本来の内容が用意できるまで代わりに出す内容。' },
      ],
    },
    exercise: { title: 'KeepAlive で状態を残す', task: 'タブを切り替えてもカウンターの値が残るように、<code>component</code> を <code>KeepAlive</code> で包む。', todo: 'component を KeepAlive で包む' },
    ui: {},
  },
  en: {
    lead: '<p>Vue ships built-in components that need no extra install. They handle enter and leave animation, keeping state, moving DOM and waiting for async work.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'Transition', body: '<p>It adds CSS classes as an element enters and leaves. With <code>name="fade"</code>, classes such as <code>fade-enter-from</code> are applied in turn. For list additions and moves, use <code>TransitionGroup</code>.</p>', run: transition },
      { title: 'KeepAlive', body: '<p>It keeps the state of a component that would be destroyed by switching. The exercise below shows it. <code>onActivated</code> and <code>onDeactivated</code> fire as it is shown and hidden.</p>' },
      { title: 'Teleport', body: '<p>It renders content in another place in the DOM. Use it for modals and toasts that must escape a parent\'s <code>overflow</code> or stacking. The logical parent and child relation stays the same.</p>', run: teleport },
      { title: 'Suspense', body: '<p>It shows alternative content until async work inside finishes. The official docs mark it experimental, and the API may change, so take care in production.</p>', show: suspense },
    ],
    easy: {
      intro: '<p>Each one solves a specific problem. <code>Transition</code> for gentle appearance, <code>KeepAlive</code> to keep input across tabs, and <code>Teleport</code> for a modal that covers the whole screen.</p>',
      terms: [
        { term: 'Modal', desc: 'A small window laid over the page.' },
        { term: 'Toast', desc: 'A brief notice at the edge of the screen.' },
        { term: 'Fallback', desc: 'Content shown until the real content is ready.' },
      ],
    },
    exercise: { title: 'Keep state with KeepAlive', task: 'Wrap <code>component</code> in <code>KeepAlive</code> so the counter value survives switching tabs.', todo: 'Wrap component in KeepAlive' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { defineComponent, ref, shallowRef } from 'vue'

const Counter = defineComponent({
  setup: () => ({ n: ref(0) }),
  template: '<button id="n" @click="n++">{{ n }}</button>',
})
const Other = { template: '<p>other</p>' }

const tab = shallowRef(Counter)
</script>

<template>
  <button id="a" @click="tab = Counter">counter</button>
  <button id="b" @click="tab = Other">other</button>
  <!-- TODO -->
  <component :is="tab" />
</template>
`,
    solution: `<script setup>
import { defineComponent, ref, shallowRef } from 'vue'

const Counter = defineComponent({
  setup: () => ({ n: ref(0) }),
  template: '<button id="n" @click="n++">{{ n }}</button>',
})
const Other = { template: '<p>other</p>' }

const tab = shallowRef(Counter)
</script>

<template>
  <button id="a" @click="tab = Counter">counter</button>
  <button id="b" @click="tab = Other">other</button>
  <KeepAlive>
    <component :is="tab" />
  </KeepAlive>
</template>
`,
    check: `await click('#n')
await click('#b')
await click('#a')
assert(text('#n') === '1', '戻ってもカウンターは 1 のままのはずです', 'The counter should still be 1 after returning')`,
  },
} satisfies ChapterContent
