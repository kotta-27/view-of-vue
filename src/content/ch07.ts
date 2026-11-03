import type { ChapterContent } from './types'

export default {
  ja: {
    lead: '<p>コンポーネントはマウント、更新、アンマウントの順に状態が変わり、各時点でフックが呼ばれる。親子がある場合、親のフックが子を包む形で実行される。本章では、実際のコンポーネントが呼んだフックの順序と、その時点の DOM を記録する。</p>',
    steps: [
      '<b>マウントは親が先に始まり、子が先に終わる。</b>親の <code>onMounted</code> が呼ばれた時点で、子の DOM はすべて存在する。',
      '<b>DOM を読めるのは <code>onMounted</code> からである。</b><code>setup</code> と <code>onBeforeMount</code> の記録は「DOM なし」になる。',
      '<b>更新の前後で DOM が変わる。</b><code>onBeforeUpdate</code> では古い内容、<code>onUpdated</code> では新しい内容が読める。',
      '<b>子の状態だけの更新に親は関わらない。</b>子の中のボタンを押すと、子のフックだけが呼ばれる。',
      '<b>アンマウントも親が先に始まり、子が先に終わる。</b>タイマーやイベントの解除は <code>onBeforeUnmount</code> か <code>onUnmounted</code> に書く。',
    ],
    impl: [
      '<code>onMounted</code> や <code>onUpdated</code> は post キューに積まれ、DOM の更新が済んだ後に実行される。第 4 章の <code>post</code> と同じ仕組みである。',
      '<code>unmountComponent</code> は <code>onBeforeUnmount</code> のフックを呼び、<code>scope.stop()</code> で effect を止めてから、描画結果をアンマウントする。<code>onUnmounted</code> は post キューに積まれる。',
    ],
    method: '本物の Vue。親子とも単一ファイルコンポーネントで、フックが実際に呼ばれた順序を記録している。順序は単体テストでも確認している。',
    easy: {
      intro: '<p>コンポーネントには一生がある。画面に現れ（マウント）、内容が変わり（更新）、画面から消える（アンマウント）。ライフサイクルフックは、その節目に「このとき、これをして」と頼んでおく仕組みである。</p><p>いちばんよく使うのは <code>onMounted</code> で、画面に出た直後に実行される。入力欄へのフォーカスやデータの取得はここに書く。</p>',
      terms: [
        { term: 'コンポーネント', desc: '画面の部品。見た目と動きをひとまとめにしたもの。' },
        { term: 'マウント', desc: 'コンポーネントを画面（DOM）に追加すること。' },
        { term: 'アンマウント', desc: 'コンポーネントを画面から取り除くこと。' },
        { term: 'フック', desc: '決まったタイミングで呼ばれるように登録する関数。' },
        { term: 'setup', desc: 'コンポーネントが作られるときに最初に実行される処理。' },
      ],
    },
    exercise: {
      title: 'マウント後にフォーカスする',
      task: '画面に表示されたらすぐ入力できるように、<code>onMounted</code> の中で入力欄にフォーカスする。',
      todo: 'onMounted で el.value.focus() を呼ぶ',
    },
    ui: {
      figTitle: '図 7-1 フックの実行順序',
      figCaption: '親と子は実際のコンポーネントである。フックの中で DOM の内容を読み、記録している。',
      stages: 'ライフサイクルの段階',
      unmounted: 'アンマウント中',
      unmount: 'アンマウント',
      mount: 'マウント',
      updateParent: '親の状態を更新',
      clear: '記録を消去',
      logCaption: '呼ばれたフック（上から実行順）',
      noDom: 'DOM なし',
    },
  },
  en: {
    lead: '<p>A component moves through mounting, updating and unmounting, and hooks are called at each point. With a parent and child, the parent hooks wrap the child hooks. This chapter records the order the hooks actually ran and what the DOM held at that moment.</p>',
    steps: [
      '<b>Mounting starts with the parent and finishes with the child first.</b> By the time the parent <code>onMounted</code> runs, all the child DOM exists.',
      '<b>The DOM is readable from <code>onMounted</code>.</b> Records for <code>setup</code> and <code>onBeforeMount</code> say "no DOM".',
      '<b>The DOM changes across an update.</b> <code>onBeforeUpdate</code> sees the old content and <code>onUpdated</code> the new.',
      '<b>A child-only update does not involve the parent.</b> Press the button in the child and only child hooks run.',
      '<b>Unmounting also starts with the parent and finishes with the child first.</b> Clear timers and listeners in <code>onBeforeUnmount</code> or <code>onUnmounted</code>.',
    ],
    impl: [
      '<code>onMounted</code> and <code>onUpdated</code> go into the post queue and run after the DOM update. It is the same mechanism as <code>post</code> in chapter 4.',
      '<code>unmountComponent</code> calls the <code>onBeforeUnmount</code> hooks, stops effects with <code>scope.stop()</code>, then unmounts the rendered tree. <code>onUnmounted</code> goes into the post queue.',
    ],
    method: 'The real Vue. Parent and child are single-file components, and the log is the order the hooks actually ran. Unit tests confirm the order too.',
    easy: {
      intro: '<p>A component has a life: it appears on screen (mount), changes (update), and leaves (unmount). Lifecycle hooks let you ask for something to happen at each of those moments.</p><p>The one you will use most is <code>onMounted</code>, which runs right after the component appears. Focusing an input or fetching data belongs there.</p>',
      terms: [
        { term: 'Component', desc: 'A piece of the screen that bundles its look and behaviour.' },
        { term: 'Mount', desc: 'To add a component to the page (the DOM).' },
        { term: 'Unmount', desc: 'To remove a component from the page.' },
        { term: 'Hook', desc: 'A function you register to be called at a fixed moment.' },
        { term: 'setup', desc: 'The code that runs first when a component is created.' },
      ],
    },
    exercise: {
      title: 'Focus after mounting',
      task: 'Let people type right away: focus the input inside <code>onMounted</code>.',
      todo: 'Call el.value.focus() in onMounted',
    },
    ui: {
      figTitle: 'Figure 7-1 Order of hook execution',
      figCaption: 'The parent and child are real components. Each hook reads the DOM and records it.',
      stages: 'Lifecycle stages',
      unmounted: 'Unmounted',
      unmount: 'Unmount',
      mount: 'Mount',
      updateParent: 'Update parent state',
      clear: 'Clear the log',
      logCaption: 'Hooks called (in order, top to bottom)',
      noDom: 'no DOM',
    },
  },
  exercise: {
    starter: `<script setup>
import { onMounted, ref } from 'vue'

const el = ref(null)

// TODO
</script>

<template>
  <input ref="el" placeholder="name" />
</template>
`,
    solution: `<script setup>
import { onMounted, ref } from 'vue'

const el = ref(null)

onMounted(() => {
  el.value.focus()
})
</script>

<template>
  <input ref="el" placeholder="name" />
</template>
`,
    check: `await wait(30)
assert(focused() === $('input'), '入力欄にフォーカスが当たっていません', 'The input is not focused')`,
  },
} satisfies ChapterContent
