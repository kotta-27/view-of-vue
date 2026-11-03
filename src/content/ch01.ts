import type { ChapterContent } from './types'

const scene = (a: string, b: string) => `const price = ref(100)
const qty = ref(2)
const sale = ref(false)

effect(() => {          // ${a}
  text = price.value * qty.value
})
effect(() => {          // ${b}
  label = sale.value ? 'Sale ' + price.value : 'Regular'
})`

export default {
  ja: {
    lead: '<p><code>ref</code> の値を更新すると、その値を使っている処理だけが再実行される。Vue は依存関係を静的に解析しているのではなく、実行時に<strong>どの effect がどの値を読んだか</strong>を記録している。本章では、この記録と通知の仕組みを最小の実装で確認する。</p>',
    steps: [
      '<b>依存は実行時に決まる。</b>effect を実行するまで依存は存在しない。最初の実行で読まれた値だけが登録される。',
      '<b>読まれていない値は通知しない。</b><code>sale</code> が <code>false</code> の間、<code>badge</code> は <code>price</code> を読まない。このとき <code>price</code> を更新しても再実行されるのは <code>total</code> だけである。',
      '<b>依存は実行ごとに更新される。</b><code>sale</code> を反転してから <code>price</code> を更新すると、<code>badge</code> も再実行される。条件分岐で読む値が変われば、依存も変わる。',
      '<b>同じ値の代入は無視される。</b><code>Object.is</code> で比較し、変化がなければ通知しない。',
    ],
    impl: [
      '依存は <code>Set</code> ではなく <code>Dep</code> クラスで管理し、effect との対応は <code>Link</code> の双方向連結リストで持つ。',
      '再実行のたびにすべて解除するのではなく、<code>prepareDeps</code> と <code>cleanupDeps</code> で、読まれなかった依存だけを外す。',
      '通知は <code>startBatch</code> と <code>endBatch</code> で束ねられる。',
    ],
    method: '簡略実装に記録機能を加えたもの。effect の実行順と結果は、本物の @vue/reactivity と同じになることをテストで確認している。',
    easy: {
      intro: '<p>Excel を思い出してほしい。セル C1 に <code>=A1*B1</code> と書くと、A1 を変えるだけで C1 も変わる。Vue の <code>ref</code> と <code>effect</code> も同じ考え方である。</p><p><code>ref</code> は「変化を見張れる箱」で、<code>.value</code> で中身を出し入れする。<code>effect</code> は「箱の中身を使う処理」である。Vue は処理を一度実行して、どの箱を使ったかを覚える。あとは箱が変わるたびに、その処理だけをやり直す。</p>',
      terms: [
        { term: 'リアクティブ', desc: '値が変わると、それを使っている場所が自動で更新される性質。' },
        { term: 'ref', desc: '値を入れる箱。値を読み書きすると Vue がそれを検知できる。' },
        { term: 'effect', desc: 'リアクティブな値を使う処理。値が変わると再実行される。普段は描画や watchEffect の形で使う。' },
        { term: '依存', desc: 'ある処理が読んでいる値のこと。「total は price に依存する」のように言う。' },
        { term: 'getter / setter', desc: 'プロパティを読むとき、書くときに呼ばれる関数。Vue はここに検知の処理を入れている。' },
      ],
    },
    exercise: {
      title: 'watchEffect で 2 倍の値を保つ',
      task: '<code>count</code> が変わるたびに、<code>doubled</code> が <code>count</code> の 2 倍になるようにする。<code>watchEffect</code> を使う。',
      todo: 'ここに watchEffect を書く',
    },
    ui: {
      figTitle: '図 1-1 依存の登録と通知',
      figCaption: '線は依存関係を示す。ボタンを押すと処理を記録して再生する。← → キーでも一段階ずつ移動できる。',
      mechanism: '仕組み',
      mechanismBody: '<p><code>effect</code> は、実行中の関数を <code>activeEffect</code> に保持する。<code>.value</code> の getter は <code>track</code> を呼び、そのときの <code>activeEffect</code> を購読者として登録する。setter は <code>trigger</code> を呼び、購読者を再実行する。</p>',
      state: '状態',
      notRun: '未実行',
      badgeBody: 'sale ? Sale price : Regular',
      codeCaption: '最小実装の全文（実行中の行を強調）',
      sceneCaption: '図の対象コード',
      run: 'effect を実行する',
      flip: 'sale を反転',
      same: 'qty に同じ値を代入',
      reset: '初期状態に戻す',
      initial: 'ref を 3 つ作成した。まだ読まれていないため、依存は登録されていない',
      starting: 'effect を 2 つ作成する。作成と同時に 1 回実行される',
      addPrice: 'price に 100 を加える',
      addQty: 'qty に 1 を加える',
      doFlip: 'sale を反転する',
      doSame: 'qty に現在と同じ値を代入する',
      scene: scene('total', 'badge'),
      aria: '状態と effect の依存関係の図',
    },
  },
  en: {
    lead: '<p>When you update a <code>ref</code>, only the code that uses it runs again. Vue does not work out these dependencies by static analysis. It records, at run time, <strong>which effect read which value</strong>. This chapter walks through that bookkeeping using a minimal implementation.</p>',
    steps: [
      '<b>Dependencies are decided at run time.</b> None exist until an effect runs, and only the values read during the run are registered.',
      '<b>Values that were not read do not notify.</b> While <code>sale</code> is <code>false</code>, <code>badge</code> never reads <code>price</code>, so updating <code>price</code> re-runs <code>total</code> alone.',
      '<b>Dependencies are rebuilt on every run.</b> Flip <code>sale</code> and update <code>price</code>: now <code>badge</code> re-runs too. When a branch reads different values, the dependencies change with it.',
      '<b>Assigning the same value is ignored.</b> Values are compared with <code>Object.is</code>, and nothing is notified when they match.',
    ],
    impl: [
      'Dependencies live in a <code>Dep</code> class rather than a <code>Set</code>, and each dep is tied to its effects through a doubly linked list of <code>Link</code> objects.',
      'Instead of clearing everything on each run, <code>prepareDeps</code> and <code>cleanupDeps</code> remove only the dependencies that were not read again.',
      'Notifications are grouped by <code>startBatch</code> and <code>endBatch</code>.',
    ],
    method: 'A simplified implementation with recording added. Tests confirm that its effect order and results match the real @vue/reactivity.',
    easy: {
      intro: '<p>Think of a spreadsheet. Put <code>=A1*B1</code> in cell C1, and changing A1 updates C1 by itself. <code>ref</code> and <code>effect</code> follow the same idea.</p><p>A <code>ref</code> is a box whose changes can be observed. You read and write it through <code>.value</code>. An <code>effect</code> is a piece of code that uses those boxes. Vue runs it once, remembers which boxes it touched, and runs only that code again whenever one of them changes.</p>',
      terms: [
        { term: 'Reactive', desc: 'When a value changes, everything that uses it updates automatically.' },
        { term: 'ref', desc: 'A box that holds a value. Vue can detect reads and writes on it.' },
        { term: 'effect', desc: 'Code that uses reactive values and re-runs when they change. You normally meet it as rendering or watchEffect.' },
        { term: 'Dependency', desc: 'A value some code reads. We say "total depends on price".' },
        { term: 'Getter / setter', desc: 'Functions called when a property is read or written. Vue puts its tracking there.' },
      ],
    },
    exercise: {
      title: 'Keep a doubled value with watchEffect',
      task: 'Make <code>doubled</code> stay at twice <code>count</code> whenever <code>count</code> changes. Use <code>watchEffect</code>.',
      todo: 'Write the watchEffect here',
    },
    ui: {
      figTitle: 'Figure 1-1 Registering and notifying dependencies',
      figCaption: 'Lines show dependencies. Each button records the work and plays it back. The ← and → keys step through it.',
      mechanism: 'How it works',
      mechanismBody: '<p><code>effect</code> keeps the running function in <code>activeEffect</code>. The <code>.value</code> getter calls <code>track</code>, which registers the current <code>activeEffect</code> as a subscriber. The setter calls <code>trigger</code>, which re-runs the subscribers.</p>',
      state: 'State',
      notRun: 'not run',
      badgeBody: 'sale ? Sale price : Regular',
      codeCaption: 'The whole implementation (running lines are highlighted)',
      sceneCaption: 'Code shown in the figure',
      run: 'Run the effects',
      flip: 'Flip sale',
      same: 'Assign the same qty',
      reset: 'Reset',
      initial: 'Three refs created. Nothing has read them, so no dependencies exist yet',
      starting: 'Create two effects. Each runs once on creation',
      addPrice: 'Add 100 to price',
      addQty: 'Add 1 to qty',
      doFlip: 'Flip sale',
      doSame: 'Assign qty its current value',
      scene: scene('total', 'badge'),
      aria: 'Diagram of dependencies between state and effects',
    },
  },
  exercise: {
    starter: `<script setup>
import { ref, watchEffect } from 'vue'

const count = ref(0)
const doubled = ref(0)

// TODO
</script>

<template>
  <button @click="count++">count: {{ count }}</button>
  <p>doubled: {{ doubled }}</p>
</template>
`,
    solution: `<script setup>
import { ref, watchEffect } from 'vue'

const count = ref(0)
const doubled = ref(0)

watchEffect(() => {
  doubled.value = count.value * 2
})
</script>

<template>
  <button @click="count++">count: {{ count }}</button>
  <p>doubled: {{ doubled }}</p>
</template>
`,
    check: `await click('button')
await click('button')
await click('button')
await wait(30)
assert(text('p').includes('6'), 'count が 3 のとき doubled は 6 になるはずです', 'doubled should be 6 when count is 3')`,
  },
} satisfies ChapterContent
