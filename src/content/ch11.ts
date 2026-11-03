import type { ChapterContent } from './types'

const compare = (a: string, b: string) => `watch(count, (next, prev) => {
  // ${a}
})

watchEffect(() => {
  // ${b}
  console.log(count.value)
})`

const race = (c: string) => `watch(term, async q => {
  const controller = new AbortController()

  // ${c}
  onWatcherCleanup(() => controller.abort())

  const data = await search(q, controller.signal)
  result.value = data
})`

export default {
  ja: {
    lead: '<p><code>computed</code> が値を作るのに対し、<code>watch</code> は変化に応じて副作用を実行する。どちらも第 1 章の effect を土台にしており、違いは実行のタイミングと依存の決まり方にある。非同期処理では、古い結果が新しい結果を上書きしないよう、後始末も必要になる。</p>',
    steps: [
      '<b>watch は遅延実行である。</b>作成時には実行されず、対象を明示する。新旧の値を受け取れる。作成時にも実行するには <code>immediate: true</code> を指定する。',
      '<b>watchEffect は即時実行である。</b>作成時に 1 回実行し、読んだ値を自動で追跡する。図の初期値が 1 なのはこのためである。',
      '<b>読んでいない値には反応しない。</b>other を更新しても、どちらも実行されない。',
      '<b>非同期処理には後始末が要る。</b>図 11-2 で <code>onWatcherCleanup</code> を外すと、後から届いた A の結果が B の結果を上書きする。有効にすると、B の実行前に A が中止される。',
    ],
    impl: [
      '<code>watch</code> は内部で <code>ReactiveEffect</code> を作る。ref を監視するとき、getter は <code>source.value</code> を読むだけである。',
      '<code>deep: true</code> は <code>traverse</code> で値を再帰的に読み、すべての階層を依存に加える。大きなオブジェクトでは費用がかかる。',
      '<code>onWatcherCleanup</code> は 3.5 で追加された。同期的に呼ぶ必要があり、<code>await</code> の後では使えない。コールバックの第 3 引数の <code>onCleanup</code> も同じ働きをする。',
      '<code>once: true</code> を指定すると、1 回実行した後に自身を停止する。',
    ],
    method: '本物の Vue。図 11-2 の検索は setTimeout で遅延を再現した模擬処理で、watch と onWatcherCleanup は本物である。',
    easy: {
      intro: '<p><code>computed</code> は「値を計算する」もの、<code>watch</code> は「値が変わったら何かをする」ものである。通信、保存、ログの出力のように、画面の外に働きかける処理は watch に書く。これを副作用と呼ぶ。</p><p>検索のように時間のかかる処理では、先に出した依頼の結果が、あとの依頼より遅く届くことがある。古い依頼を取り消す後始末をしないと、画面に古い結果が残る。</p>',
      terms: [
        { term: '副作用', desc: '通信や保存など、値を返す以外に外の世界へ影響を与える処理。' },
        { term: 'watch', desc: '指定した値の変化に応じて処理を実行する関数。' },
        { term: 'watchEffect', desc: '使った値を自動で追跡し、変化すると再実行する関数。' },
        { term: '非同期処理', desc: '通信のように、結果が後から届く処理。<code>await</code> で待つ。' },
        { term: '競合状態', desc: '処理の完了順によって結果が変わってしまう問題。' },
      ],
    },
    exercise: {
      title: '変更の履歴を残す',
      task: '<code>watch</code> を使い、<code>count</code> が変わるたびに <code>history</code> の末尾へ <code>"前の値->新しい値"</code> の文字列を追加する。',
      todo: 'watch で history.value.push(`${prev}->${next}`) する',
    },
    ui: {
      fig1Title: '図 11-1 watch と watchEffect の違い',
      fig1Caption: '本物の watch と watchEffect の実行回数である。other はどちらからも読まれていない。',
      fig2Title: '図 11-2 古いレスポンスの上書き',
      fig2Caption: 'A の応答は 900ms、B の応答は 200ms かかるものとして、遅延を再現している。',
      watchRuns: 'watch の実行',
      effectRuns: 'watchEffect の実行',
      received: 'watch が受け取った値',
      sceneCaption: '図の対象コード',
      useCleanup: 'onWatcherCleanup で中止する',
      run: 'A のあとすぐ B を検索',
      input: '入力',
      shown: '表示',
      active: '実行中',
      good: '入力と表示が一致している',
      raceCaption: '後始末を入れたコード',
      logLabel: '記録',
      compare: compare('count が変わったときだけ実行する', '作成時に 1 回実行し、読んだ値を自動で追跡する'),
      race: race('次の実行の直前と、停止時に呼ばれる'),
    },
  },
  en: {
    lead: '<p>Where <code>computed</code> produces a value, <code>watch</code> runs side effects in response to changes. Both build on the effect from chapter 1. They differ in when they run and how dependencies are chosen. With asynchronous work you also need cleanup, so an old result cannot overwrite a newer one.</p>',
    steps: [
      '<b>watch is lazy.</b> It does not run on creation, you name its source, and it receives the new and old values. Add <code>immediate: true</code> to run on creation too.',
      '<b>watchEffect runs immediately.</b> It runs once on creation and tracks whatever it reads. That is why the figure starts at 1.',
      '<b>Values that were not read cause no reaction.</b> Updating other runs neither of them.',
      '<b>Asynchronous work needs cleanup.</b> In figure 11-2, without <code>onWatcherCleanup</code> the late result for A overwrites the result for B. With it, A is aborted before B runs.',
    ],
    impl: [
      '<code>watch</code> creates a <code>ReactiveEffect</code> internally. For a ref, the getter just reads <code>source.value</code>.',
      '<code>deep: true</code> walks the value with <code>traverse</code>, adding every level as a dependency. This costs more on large objects.',
      '<code>onWatcherCleanup</code> was added in 3.5. It must be called synchronously, so it cannot be used after <code>await</code>. The <code>onCleanup</code> third argument of the callback does the same job.',
      'With <code>once: true</code>, a watcher stops itself after one run.',
    ],
    method: 'The real Vue. The search in figure 11-2 is simulated with setTimeout delays, while watch and onWatcherCleanup are real.',
    easy: {
      intro: '<p><code>computed</code> calculates a value. <code>watch</code> does something when a value changes. Work that reaches outside the screen, such as network calls, saving or logging, goes in watch. Such work is called a side effect.</p><p>With slow work like a search, an earlier request can finish after a later one. Unless you cancel the old request, the old result stays on screen.</p>',
      terms: [
        { term: 'Side effect', desc: 'Work that affects the outside world, such as a network call or saving.' },
        { term: 'watch', desc: 'Runs code in response to changes in the values you name.' },
        { term: 'watchEffect', desc: 'Tracks the values it uses and re-runs when they change.' },
        { term: 'Asynchronous', desc: 'Work whose result arrives later, such as a network call. You wait with <code>await</code>.' },
        { term: 'Race condition', desc: 'A bug where the result depends on which work happens to finish first.' },
      ],
    },
    exercise: {
      title: 'Keep a history of changes',
      task: 'Use <code>watch</code> so each change of <code>count</code> appends the string <code>"previous->next"</code> to <code>history</code>.',
      todo: 'In watch, call history.value.push(`${prev}->${next}`)',
    },
    ui: {
      fig1Title: 'Figure 11-1 watch versus watchEffect',
      fig1Caption: 'Run counts of the real watch and watchEffect. Neither one reads other.',
      fig2Title: 'Figure 11-2 An old response overwrites a new one',
      fig2Caption: 'Delays are simulated: A takes 900ms and B takes 200ms.',
      watchRuns: 'watch runs',
      effectRuns: 'watchEffect runs',
      received: 'Value received by watch',
      sceneCaption: 'Code shown in the figure',
      useCleanup: 'Abort with onWatcherCleanup',
      run: 'Search A, then B right away',
      input: 'Input',
      shown: 'Shown',
      active: 'Running',
      good: 'Input and display match',
      raceCaption: 'Code with cleanup',
      logLabel: 'log',
      compare: compare('Runs only when count changes', 'Runs once on creation and tracks what it reads'),
      race: race('Called just before the next run, and on stop'),
    },
  },
  exercise: {
    starter: `<script setup>
import { ref, watch } from 'vue'

const count = ref(0)
const history = ref([])

// TODO
</script>

<template>
  <button @click="count++">add</button>
  <p>{{ history.join(' ') }}</p>
</template>
`,
    solution: `<script setup>
import { ref, watch } from 'vue'

const count = ref(0)
const history = ref([])

watch(count, (next, prev) => {
  history.value.push(\`\${prev}->\${next}\`)
})
</script>

<template>
  <button @click="count++">add</button>
  <p>{{ history.join(' ') }}</p>
</template>
`,
    check: `await click('button')
await click('button')
assert(text('p') === '0->1 1->2', '0->1 1->2 と表示されるはずです', 'The page should show 0->1 1->2')`,
  },
} satisfies ChapterContent
