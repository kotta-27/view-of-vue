import type { ChapterContent } from './types'

const scope = (c: string, d: string) => `const scope = effectScope()

scope.run(() => {
  const double = computed(() => count.value * 2)
  watch(double, value => console.log(value))
  onScopeDispose(() => console.log('${d}'))
})

// ${c}
scope.stop()`

export default {
  ja: {
    lead: '<p>コンポーザブルは、状態を持つロジックを切り出した関数である。特別な仕組みではなく、<code>setup</code> の中から呼ばれる普通の関数にすぎない。鍵になるのは、その中で作った effect や後始末がコンポーネントの寿命に結びつくことである。これを担うのが <code>effectScope</code> である。</p>',
    steps: [
      '<b>コンポーザブルはただの関数である。</b><code>useBusValue</code> は <code>ref</code> を作り、それを返しているだけである。',
      '<b>外部への登録は自動では解除されない。</b>解除を無効にしてマウントとアンマウントを繰り返すと、リスナーが増え続ける。',
      '<b><code>onScopeDispose</code> で後始末を登録する。</b>有効にするとアンマウント時に解除される。<code>onUnmounted</code> と違い、コンポーネントの外の <code>effectScope</code> でも動く。',
      '<b>Vue の effect は自動で止まる。</b><code>setup</code> の中で作った <code>computed</code> や <code>watch</code> は、コンポーネントのスコープに集められ、アンマウント時に止まる。',
    ],
    impl: [
      '各コンポーネントのインスタンスは自分の <code>EffectScope</code> を持つ。<code>setup</code> はこのスコープの中で実行される。',
      'スコープの中で作られた effect は、スコープに記録される。第 7 章で見た <code>unmountComponent</code> の <code>scope.stop()</code> が、これらをまとめて止める。',
      '<code>onScopeDispose</code> はスコープの外で呼ぶと何もしない。呼び出し時にスコープがあることは <code>getCurrentScope</code> で確認できる。',
    ],
    method: '本物の Vue。コンポーネントを実際にマウントとアンマウントし、リスナーの数を数えている。effectScope の動作は単体テストでも確認している。',
    easy: {
      intro: '<p>同じ処理を複数のコンポーネントで使いたいとき、関数に切り出す。それがコンポーザブルで、名前は <code>use</code> で始める習慣がある。</p><p>イベントの登録のように外の世界へ働きかけたら、片付けも必要である。部屋を出るときに電気を消すのと同じで、片付けを忘れると使われない処理が残り続ける。これをメモリリークと呼ぶ。</p>',
      terms: [
        { term: 'コンポーザブル', desc: 'リアクティブな状態を持つロジックを再利用するための関数。' },
        { term: 'リスナー', desc: 'イベントが起きたときに呼ばれるよう登録した関数。' },
        { term: 'メモリリーク', desc: '不要になったものが解放されず、メモリを使い続ける問題。' },
        { term: 'スコープ', desc: 'effect をまとめて管理し、一度に止められる単位。' },
      ],
    },
    exercise: {
      title: 'コンポーザブルを作る',
      task: '<code>useToggle</code> を完成させる。<code>on</code>（ref）と、それを反転する <code>toggle</code> を返す。2 つのボタンは別々に動くこと。',
      todo: 'ref と toggle 関数を作って返す',
    },
    ui: {
      figTitle: '図 12-1 後始末とコンポーネントの寿命',
      figCaption: 'バスはコンポーネントの外にある簡単なイベント配信器である。解除しない限り、リスナーは残り続ける。',
      unmounted: 'アンマウント中',
      mount: 'マウント',
      unmount: 'アンマウント',
      send: 'バスへ値を送る',
      reset: '初期状態に戻す',
      cleanup: 'onScopeDispose で解除する',
      mounts: 'マウント回数',
      listeners: '残っているリスナー',
      sent: '送った値',
      leak: 'アンマウント済みのリスナーが残っている',
      ok: 'リスナーの数はマウント中のコンポーネントと一致している',
      codeCaption: 'useBusValue.ts（実行中のコード）',
      scopeCaption: 'effectScope を直接使う例',
      scope: scope('中の computed と watch をまとめて止める', 'cleanup'),
    },
  },
  en: {
    lead: '<p>A composable is a function that extracts stateful logic. It is not a special feature, just a plain function called from <code>setup</code>. What matters is that the effects and cleanup created inside are tied to the component\'s lifetime. <code>effectScope</code> handles that.</p>',
    steps: [
      '<b>A composable is just a function.</b> <code>useBusValue</code> creates a <code>ref</code> and returns it.',
      '<b>Outside registrations are not removed for you.</b> Turn off the cleanup and keep mounting and unmounting: the listeners pile up.',
      '<b>Register cleanup with <code>onScopeDispose</code>.</b> With it on, the listener goes away on unmount. Unlike <code>onUnmounted</code>, it also works in an <code>effectScope</code> outside any component.',
      '<b>Vue effects stop on their own.</b> A <code>computed</code> or <code>watch</code> created in <code>setup</code> is collected in the component scope and stops on unmount.',
    ],
    impl: [
      'Every component instance has its own <code>EffectScope</code>, and <code>setup</code> runs inside it.',
      'Effects created in a scope are recorded there. The <code>scope.stop()</code> in <code>unmountComponent</code>, seen in chapter 7, stops them all.',
      'Outside a scope, <code>onScopeDispose</code> does nothing. <code>getCurrentScope</code> tells you whether one exists.',
    ],
    method: 'The real Vue. Components really mount and unmount, and the listeners are counted. Unit tests confirm how effectScope behaves too.',
    easy: {
      intro: '<p>When several components need the same logic, move it into a function. That is a composable, and by convention the name starts with <code>use</code>.</p><p>If you register something outside, such as an event listener, you must also clean up. It is like switching off the light when leaving a room. Forget, and unused code stays around. This is called a memory leak.</p>',
      terms: [
        { term: 'Composable', desc: 'A function for reusing logic that has reactive state.' },
        { term: 'Listener', desc: 'A function registered to be called when an event happens.' },
        { term: 'Memory leak', desc: 'Things no longer needed are never released and keep using memory.' },
        { term: 'Scope', desc: 'A unit that groups effects so they can be stopped together.' },
      ],
    },
    exercise: {
      title: 'Write a composable',
      task: 'Finish <code>useToggle</code>. Return <code>on</code> (a ref) and a <code>toggle</code> function that flips it. The two buttons must work independently.',
      todo: 'Create a ref and a toggle function, and return them',
    },
    ui: {
      figTitle: 'Figure 12-1 Cleanup and component lifetime',
      figCaption: 'The bus is a small event emitter outside any component. Listeners stay until removed.',
      unmounted: 'Unmounted',
      mount: 'Mount',
      unmount: 'Unmount',
      send: 'Send a value to the bus',
      reset: 'Reset',
      cleanup: 'Remove with onScopeDispose',
      mounts: 'Mounts',
      listeners: 'Listeners remaining',
      sent: 'Value sent',
      leak: 'Listeners from unmounted components remain',
      ok: 'The listener count matches the mounted components',
      codeCaption: 'useBusValue.ts (running code)',
      scopeCaption: 'Using effectScope directly',
      scope: scope('Stops the computed and watch inside at once', 'cleanup'),
    },
  },
  exercise: {
    starter: `<script setup>
import { ref } from 'vue'

function useToggle() {
  // TODO
}

const a = useToggle()
const b = useToggle()
</script>

<template>
  <button id="a" @click="a.toggle">{{ a.on.value }}</button>
  <button id="b" @click="b.toggle">{{ b.on.value }}</button>
</template>
`,
    solution: `<script setup>
import { ref } from 'vue'

function useToggle() {
  const on = ref(false)
  const toggle = () => {
    on.value = !on.value
  }
  return { on, toggle }
}

const a = useToggle()
const b = useToggle()
</script>

<template>
  <button id="a" @click="a.toggle">{{ a.on.value }}</button>
  <button id="b" @click="b.toggle">{{ b.on.value }}</button>
</template>
`,
    check: `await click('#a')
assert(text('#a') === 'true' && text('#b') === 'false', '2 つのボタンは別々に切り替わるはずです', 'The two buttons should toggle independently')`,
  },
} satisfies ChapterContent
