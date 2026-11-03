import type { ChapterContent } from './types'

const scene = (note: string, sub: string) => `const count = ref(1)

const isBig = computed(() => {
  return count.value >= 5
})

function isBigFn() {       // ${note}
  return count.value >= 5
}

watchEffect(() => {        // ${sub}
  console.log(isBig.value)
})`

export default {
  ja: {
    lead: '<p><code>computed</code> と通常の関数の違いは、再計算の条件にある。読まれるまで計算せず、依存が変わらなければ計算せず、再計算しても結果が同じなら購読者を実行しない。本章では、本物の <code>computed</code> の実行回数を計測してこれを確認する。</p>',
    steps: [
      '<b>キャッシュ。</b>「読む」を 5 回押す。通常の関数は 5 回実行され、<code>computed</code> の getter は 1 回だけ実行される。',
      '<b>遅延評価。</b>購読なしで <code>count</code> を更新しても getter は実行されない。次に読まれるまで再計算は延期される。',
      '<b>購読者がいる場合。</b>購読を開始して <code>count</code> を 5 未満の範囲で更新すると、更新のたびに getter が実行される。購読者の再実行の要否を判定するためである。結果は <code>false</code> のままなので、購読者は実行されない。',
      '<b>結果の変化。</b><code>count</code> を 5 にすると結果が <code>true</code> に変わり、購読者が実行される。',
    ],
    impl: [
      'リアクティブな値が更新されるたびに <code>globalVersion</code> が増える。<code>refreshComputed</code> はこの値が変わっていなければ、依存を調べずに処理を終える。',
      '結果の比較には <code>hasChanged</code> を使う。変化したときだけ <code>dep.version</code> を増やし、購読者は version の差で再実行を判断する。',
      '購読者がいなくなると、<code>computed</code> は依存先からも購読を解除する。',
    ],
    method: '本物の Vue。ref、computed、watchEffect をそのまま実行し、回数を計測している。「未計算」の表示のみ、最後に計算したときの count との比較による推定である。',
    easy: {
      intro: '<p><code>computed</code> は、ほかの値から計算した結果を覚えておく入れ物である。たとえばカートの合計金額。商品が変わらない限り、何度見ても計算し直さず、覚えた答えを返す。</p><p>普通の関数でも同じ値は作れる。違いは、関数は呼ぶたびに計算するのに対して、<code>computed</code> は必要になるまで計算しない点である。重い計算ほど差が出る。</p>',
      terms: [
        { term: 'computed', desc: 'ほかの値から計算され、結果が記憶される値。' },
        { term: 'キャッシュ', desc: '計算結果を保存して、次回はそれを使うこと。' },
        { term: '遅延評価', desc: '実際に必要になるまで計算を先延ばしにすること。' },
        { term: '購読者', desc: 'ある値の変化を待っている処理。描画や watchEffect など。' },
      ],
    },
    exercise: {
      title: '合計を computed で求める',
      task: '<code>total</code> が <code>items</code> の合計になるようにする。<code>computed</code> を使い、ボタンで要素を追加したときも表示が追従するようにする。',
      todo: 'computed で合計を求める。ヒント: items.value.reduce((a, b) => a + b, 0)',
    },
    ui: {
      figTitle: '図 3-1 computed のデータフロー',
      figCaption: '矢印上の赤い点は、再計算または購読者の実行が起きたことを示す。',
      aria: 'count から isBig を経て購読者へ至るデータフロー図',
      stale: '未計算',
      fresh: '計算済み',
      subscriber: '購読者',
      reads: '読み取り回数',
      getter: 'computed の getter',
      fn: '通常の関数',
      effectRuns: '購読者の実行',
      read: 'isBig.value を読む',
      subscribe: '購読を開始',
      unsubscribe: '購読を解除',
      empty: '操作の履歴がここに表示される。',
      sceneCaption: '図の対象コード',
      scene: scene('比較用の通常の関数', '購読者'),
      ranGetter: 'getter を実行',
      cached: 'キャッシュを返却',
      ranEffect: '購読者を実行',
      skipped: '結果が同じため購読者は実行しない',
      didRead: 'isBig.value を読み取り',
      didSub: '購読を開始',
      didUnsub: '購読を解除',
    },
  },
  en: {
    lead: '<p>The difference between <code>computed</code> and a plain function is when it recalculates. It does not calculate until read, does not recalculate unless a dependency changed, and does not run subscribers if the result is the same. This chapter measures how often the real <code>computed</code> runs.</p>',
    steps: [
      '<b>Caching.</b> Press "Read" five times. The plain function runs five times, and the <code>computed</code> getter runs once.',
      '<b>Lazy evaluation.</b> Update <code>count</code> with no subscriber and the getter does not run. Recalculation waits for the next read.',
      '<b>With a subscriber.</b> Subscribe and change <code>count</code> while it stays below 5. The getter runs each time, because Vue must decide whether the subscriber needs to re-run. The result stays <code>false</code>, so the subscriber does not run.',
      '<b>When the result changes.</b> Bring <code>count</code> to 5. The result becomes <code>true</code> and the subscriber runs.',
    ],
    impl: [
      'Every update to a reactive value increments <code>globalVersion</code>. If it has not changed, <code>refreshComputed</code> returns without checking any dependency.',
      'Results are compared with <code>hasChanged</code>. Only a change increments <code>dep.version</code>, and subscribers use the version difference to decide whether to re-run.',
      'When the last subscriber leaves, a <code>computed</code> also unsubscribes from its own dependencies.',
    ],
    method: 'The real Vue. ref, computed and watchEffect run unchanged and the runs are counted. Only the "stale" label is an estimate, made by comparing with the count at the last calculation.',
    easy: {
      intro: '<p>A <code>computed</code> remembers a result derived from other values. Think of a shopping cart total. As long as the items stay the same, it returns the remembered answer without adding everything up again.</p><p>A plain function can produce the same value. The difference is that a function calculates on every call, while <code>computed</code> waits until the answer is needed. The heavier the work, the more this matters.</p>',
      terms: [
        { term: 'computed', desc: 'A value derived from other values, with its result remembered.' },
        { term: 'Cache', desc: 'Saving a result so it can be reused next time.' },
        { term: 'Lazy evaluation', desc: 'Putting off a calculation until it is actually needed.' },
        { term: 'Subscriber', desc: 'Code waiting for a value to change, such as rendering or watchEffect.' },
      ],
    },
    exercise: {
      title: 'Compute a total with computed',
      task: 'Make <code>total</code> the sum of <code>items</code>. Use <code>computed</code>, so the display follows when the button adds an item.',
      todo: 'Compute the sum with computed. Hint: items.value.reduce((a, b) => a + b, 0)',
    },
    ui: {
      figTitle: 'Figure 3-1 Data flow of computed',
      figCaption: 'A red dot on an arrow means a recalculation or a subscriber run happened.',
      aria: 'Data flow from count through isBig to the subscriber',
      stale: 'stale',
      fresh: 'up to date',
      subscriber: 'Subscriber',
      reads: 'Reads',
      getter: 'computed getter',
      fn: 'Plain function',
      effectRuns: 'Subscriber runs',
      read: 'Read isBig.value',
      subscribe: 'Subscribe',
      unsubscribe: 'Unsubscribe',
      empty: 'The history of your actions appears here.',
      sceneCaption: 'Code shown in the figure',
      scene: scene('a plain function, for comparison', 'the subscriber'),
      ranGetter: 'getter ran',
      cached: 'returned the cache',
      ranEffect: 'subscriber ran',
      skipped: 'same result, subscriber skipped',
      didRead: 'read isBig.value',
      didSub: 'subscribed',
      didUnsub: 'unsubscribed',
    },
  },
  exercise: {
    starter: `<script setup>
import { ref, computed } from 'vue'

const items = ref([100, 200])

// TODO
const total = 0
</script>

<template>
  <button @click="items.push(300)">add 300</button>
  <p>{{ total }}</p>
</template>
`,
    solution: `<script setup>
import { ref, computed } from 'vue'

const items = ref([100, 200])

const total = computed(() => items.value.reduce((a, b) => a + b, 0))
</script>

<template>
  <button @click="items.push(300)">add 300</button>
  <p>{{ total }}</p>
</template>
`,
    check: `assert(text('p') === '300', '最初の合計は 300 です', 'The first total should be 300')
await click('button')
assert(text('p') === '600', '追加後の合計は 600 です', 'After adding, the total should be 600')`,
  },
} satisfies ChapterContent
