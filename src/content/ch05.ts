import type { ChapterContent } from './types'

export default {
  ja: {
    lead: '<p>テンプレートは実行前に render 関数へ変換される。コンパイラはこの段階で動的な部分を特定し、静的な部分をキャッシュし、動的なノードには変更の種類を示す <code>PatchFlags</code> を付与する。これにより、実行時の比較を大幅に減らせる。</p>',
    steps: [
      '<b>PatchFlags はビットフラグである。</b><code>3 /* TEXT, CLASS */</code> は 1 と 2 の論理和で、テキストと class だけを比較すればよいことを示す。',
      '<b>静的な要素はキャッシュされる。</b>Vue 3.5 では <code>_cache[n]</code> に格納され、2 回目以降の描画で再利用される。フラグは <code>-1 /* CACHED */</code> である。',
      '<b>比較の対象は動的なノードに限られる。</b>「静的中心」の例を見ると、要素数に対して比較対象はごく少ない。更新の費用はテンプレートの大きさではなく、動的なノードの数で決まる。',
    ],
    impl: [
      '<code>openBlock</code> と <code>createElementBlock</code> で作られる Block は、内側の動的ノードを平坦な配列 <code>dynamicChildren</code> に集める。更新時はツリーを走査せず、<code>patchBlockChildren</code> でこの配列だけを処理する。',
      '静的な属性オブジェクトは <code>_hoisted_1</code> として render 関数の外に出される。イベントハンドラも <code>_cache</code> に格納される。',
      '静的なノードが多く連続すると、HTML 文字列にまとめられる（<code>createStaticVNode</code>）。',
    ],
    method: '本物の @vue/compiler-sfc をブラウザ内で実行している。解析結果の表示は、コンパイラが返す AST（Abstract Syntax Tree、コードの構造を表す木）を読み取ったものである。',
    easy: {
      intro: '<p>テンプレートは、そのままではブラウザで動かない。Vue はまず、テンプレートを JavaScript の関数に変換する。これがコンパイルで、できた関数を render 関数と呼ぶ。</p><p>変換のとき、Vue は「ここは絶対に変わらない」「ここは文字だけ変わる」と印をつけておく。おかげで画面の更新時に、変わるかもしれない場所だけを調べれば済む。</p>',
      terms: [
        { term: 'テンプレート', desc: '<code>&lt;template&gt;</code> に書く、HTML に似た画面の定義。' },
        { term: 'コンパイル', desc: 'ある形式のコードを別の形式に変換すること。' },
        { term: 'render 関数', desc: '画面の内容を表すオブジェクト（vnode）を返す関数。' },
        { term: 'vnode', desc: '画面の要素を表す JavaScript のオブジェクト。仮想 DOM の 1 要素。' },
        { term: '静的 / 動的', desc: '変わらない部分が静的、変わりうる部分が動的。' },
        { term: 'ビットフラグ', desc: '複数の条件を 1 つの数値の各ビットで表す方法。' },
      ],
    },
    exercise: {
      title: 'v-once で再描画を省く',
      task: '初期値の行は最初の値のまま固定したい。<code>#first</code> の要素に <code>v-once</code> を付け、更新の対象から外す。',
      todo: 'この行に v-once を付ける',
    },
    ui: {
      figTitle: '図 5-1 コンパイル結果',
      figCaption: '入力に応じて、本物のコンパイラがブラウザ内で再実行される。',
      basic: '基本',
      list: 'リスト',
      branch: '条件分岐',
      mostlyStatic: '静的中心',
      template: 'テンプレート（編集可能）',
      elements: '要素数',
      checked: '更新時の比較対象',
      cached: 'キャッシュ',
      analysis: '解析結果',
      output: '生成された render 関数',
      flags: 'PatchFlags の一覧（使用中のものを強調）',
    },
  },
  en: {
    lead: '<p>A template is turned into a render function before it runs. At that stage the compiler identifies what is dynamic, caches what is static, and marks dynamic nodes with <code>PatchFlags</code> that say what can change. This cuts down the work needed at run time.</p>',
    steps: [
      '<b>PatchFlags are bit flags.</b> <code>3 /* TEXT, CLASS */</code> is 1 OR 2, meaning only the text and class need comparing.',
      '<b>Static elements are cached.</b> In Vue 3.5 they go into <code>_cache[n]</code> and are reused from the second render on, flagged <code>-1 /* CACHED */</code>.',
      '<b>Only dynamic nodes are compared.</b> In the "Mostly static" example, very few nodes are compared relative to the element count. Update cost depends on the number of dynamic nodes, not on template size.',
    ],
    impl: [
      'A Block, created by <code>openBlock</code> and <code>createElementBlock</code>, collects its dynamic descendants into a flat array, <code>dynamicChildren</code>. Updates skip the tree and process that array with <code>patchBlockChildren</code>.',
      'Static prop objects are moved outside the render function as <code>_hoisted_1</code>. Event handlers are stored in <code>_cache</code> too.',
      'Long runs of static nodes are merged into an HTML string (<code>createStaticVNode</code>).',
    ],
    method: 'The real @vue/compiler-sfc running in your browser. The analysis is read from the AST (Abstract Syntax Tree, a tree describing the code) the compiler returns.',
    easy: {
      intro: '<p>A browser cannot run a template as it is. Vue first converts it into a JavaScript function. That step is compilation, and the result is called a render function.</p><p>While converting, Vue marks what can never change and what only changes its text. So when the screen updates, Vue checks just the parts that might have changed.</p>',
      terms: [
        { term: 'Template', desc: 'The HTML-like screen definition you write in <code>&lt;template&gt;</code>.' },
        { term: 'Compile', desc: 'To convert code from one form into another.' },
        { term: 'Render function', desc: 'A function that returns objects (vnodes) describing the screen.' },
        { term: 'vnode', desc: 'A JavaScript object describing one screen element, a node of the virtual DOM.' },
        { term: 'Static / dynamic', desc: 'Parts that never change are static. Parts that can change are dynamic.' },
        { term: 'Bit flag', desc: 'A way to store several conditions in the bits of one number.' },
      ],
    },
    exercise: {
      title: 'Skip re-rendering with v-once',
      task: 'The first line should keep its initial value. Add <code>v-once</code> to the <code>#first</code> element so updates skip it.',
      todo: 'Add v-once to this line',
    },
    ui: {
      figTitle: 'Figure 5-1 Compilation output',
      figCaption: 'The real compiler re-runs in your browser as you type.',
      basic: 'Basic',
      list: 'List',
      branch: 'Conditional',
      mostlyStatic: 'Mostly static',
      template: 'Template (editable)',
      elements: 'Elements',
      checked: 'Compared on update',
      cached: 'Cached',
      analysis: 'Analysis',
      output: 'Generated render function',
      flags: 'PatchFlags (those in use are highlighted)',
    },
  },
  exercise: {
    starter: `<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">add</button>
  <!-- TODO -->
  <p id="first">first: {{ count }}</p>
  <p id="now">now: {{ count }}</p>
</template>
`,
    solution: `<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">add</button>
  <p id="first" v-once>first: {{ count }}</p>
  <p id="now">now: {{ count }}</p>
</template>
`,
    check: `await click('button')
assert(text('#now').includes('1'), '#now は更新されるはずです', '#now should update')
assert(text('#first').includes('0'), '#first は 0 のままのはずです', '#first should stay at 0')`,
  },
} satisfies ChapterContent
