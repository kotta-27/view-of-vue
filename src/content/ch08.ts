import type { ChapterContent } from './types'

export default {
  ja: {
    lead: '<p>親が再描画されても、すべての子が再描画されるわけではない。Vue は子の props を比較し、変化がなければ子の更新を省く。逆方向の通知には <code>emit</code> を使う。これはイベントの配信ではなく、親から渡されたハンドラの呼び出しである。</p>',
    steps: [
      '<b>props が同じ子は再描画されない。</b>「親の状態を更新」を押すと、親は再描画されるが A と B は再描画されない。',
      '<b>毎回作るオブジェクトは「変化」になる。</b>C の <code>:config="{ label }"</code> は親の描画のたびに新しいオブジェクトを作る。比較は同一性で行うため、中身が同じでも C は再描画される。回避するには、オブジェクトを <code>computed</code> に置くか、プリミティブに分けて渡す。',
      "<b>emit は親のハンドラの呼び出しである。</b>A のボタンは <code>emit('increment', 1)</code> を実行する。親の <code>addA</code> が <code>a</code> を更新し、親と A が再描画される。C も親の描画に伴って再描画される。",
      '<b>データの流れは一方向である。</b>子は props を直接書き換えず、<code>emit</code> で親に依頼する。状態を変える場所を親に限定できる。',
    ],
    impl: [
      '子の更新の要否は <code>shouldUpdateComponent</code> が判定する。コンパイラが <code>PROPS</code> と動的な props の名前を出力していれば、その props だけを比較する。',
      '<code>emit</code> は vnode の props から <code>onIncrement</code> のような名前のハンドラを探し、見つかれば呼ぶ。バブリングはしない。',
      '子の <code>props</code> は <code>shallowReactive</code> である。そのため子は読んだ props の変更を追跡できる。',
    ],
    method: '本物の Vue。親子とも単一ファイルコンポーネントを実行し、回数を計測している。再描画の条件は単体テストでも確認している。',
    easy: {
      intro: '<p>コンポーネント同士は props と emit で会話する。props は親から子への手紙、emit は子から親への電話である。</p><p>子は受け取った props を自分で書き換えてはいけない。変えてほしいときは emit で親に頼む。こうしておくと、値を変える場所が親の 1 か所に決まり、不具合を追いやすい。</p>',
      terms: [
        { term: 'props', desc: '親から子へ渡す値。子にとっては読み取り専用。' },
        { term: 'emit', desc: '子から親へ通知を送ること。' },
        { term: '親 / 子', desc: 'コンポーネントを配置する側が親、配置される側が子。' },
        { term: 'ハンドラ', desc: 'イベントが起きたときに呼ばれる関数。' },
        { term: '一方向データフロー', desc: 'データは親から子へ流れ、変更の依頼は子から親へ上がるという考え方。' },
      ],
    },
    exercise: {
      title: '子から親へ通知する',
      task: '子のボタンを押したら <code>add</code> イベントを値 1 とともに emit する。親はすでに受け取る準備ができている。',
      todo: 'button に @click="$emit(\'add\', 1)" を付ける',
    },
    ui: {
      figTitle: '図 8-1 再描画の範囲',
      figCaption: '回数は各コンポーネントの onUpdated で数えている。',
      updateParent: '親の状態を更新',
      parent: '親の再描画',
      a: 'A の再描画',
      b: 'B の再描画',
      c: 'C の再描画',
      codeCaption: 'PropsParent.vue（実行中のコード）',
    },
  },
  en: {
    lead: '<p>A parent re-rendering does not mean every child re-renders. Vue compares the child props and skips the update if nothing changed. For the opposite direction there is <code>emit</code>, which is not an event broadcast but a call to the handler the parent passed in.</p>',
    steps: [
      '<b>A child with the same props is not re-rendered.</b> Press "Update parent state": the parent re-renders, A and B do not.',
      '<b>An object created every time counts as a change.</b> C receives <code>:config="{ label }"</code>, a new object on each parent render. Props compare by identity, so C re-renders even though the contents match. To avoid this, keep the object in a <code>computed</code> or pass primitives.',
      "<b>emit calls the parent's handler.</b> The A button runs <code>emit('increment', 1)</code>. The parent's <code>addA</code> updates <code>a</code>, and the parent and A re-render. C follows the parent render as well.",
      '<b>Data flows one way.</b> A child does not write to its props. It asks the parent through <code>emit</code>, which keeps state changes in one place.',
    ],
    impl: [
      '<code>shouldUpdateComponent</code> decides whether a child updates. If the compiler emitted <code>PROPS</code> with the names of dynamic props, only those are compared.',
      '<code>emit</code> looks up a handler such as <code>onIncrement</code> in the vnode props and calls it if found. It does not bubble.',
      'A child\'s <code>props</code> is <code>shallowReactive</code>, which is how the child tracks the props it reads.',
    ],
    method: 'The real Vue. Single-file components run as written and the renders are counted. Unit tests confirm the re-render conditions too.',
    easy: {
      intro: '<p>Components talk through props and emit. Props are a letter from parent to child. Emit is a phone call from child to parent.</p><p>A child must not change the props it receives. When it wants a change, it asks the parent with emit. That way there is one place where the value changes, which makes bugs easier to trace.</p>',
      terms: [
        { term: 'props', desc: 'Values passed from parent to child. Read-only for the child.' },
        { term: 'emit', desc: 'Sending a notification from child to parent.' },
        { term: 'Parent / child', desc: 'The component that places another is the parent, the placed one the child.' },
        { term: 'Handler', desc: 'A function called when an event happens.' },
        { term: 'One-way data flow', desc: 'Data flows down from parent to child, and change requests go up.' },
      ],
    },
    exercise: {
      title: 'Notify the parent from a child',
      task: 'When the child button is pressed, emit an <code>add</code> event with the value 1. The parent is already listening.',
      todo: 'Add @click="$emit(\'add\', 1)" to the button',
    },
    ui: {
      figTitle: 'Figure 8-1 How far a re-render reaches',
      figCaption: 'Counts come from each component\'s onUpdated.',
      updateParent: 'Update parent state',
      parent: 'Parent renders',
      a: 'A renders',
      b: 'B renders',
      c: 'C renders',
      codeCaption: 'PropsParent.vue (running code)',
    },
  },
  exercise: {
    starter: `<script setup>
import { defineComponent, ref } from 'vue'

const count = ref(0)

const Child = defineComponent({
  emits: ['add'],
  // TODO
  template: '<button>add</button>',
})
</script>

<template>
  <Child @add="by => (count += by)" />
  <p>{{ count }}</p>
</template>
`,
    solution: `<script setup>
import { defineComponent, ref } from 'vue'

const count = ref(0)

const Child = defineComponent({
  emits: ['add'],
  template: '<button @click="$emit(\\'add\\', 1)">add</button>',
})
</script>

<template>
  <Child @add="by => (count += by)" />
  <p>{{ count }}</p>
</template>
`,
    check: `await click('button')
await click('button')
assert(text('p') === '2', '2 回押したら 2 と表示されるはずです', 'After two clicks the page should show 2')`,
  },
} satisfies ChapterContent
