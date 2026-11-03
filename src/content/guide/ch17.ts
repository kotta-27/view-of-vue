import type { ChapterContent } from '../types'

const lazy = `import { defineAsyncComponent } from 'vue'

const Chart = defineAsyncComponent(() => import('./Chart.vue'))

// Loading and error states
const Editor = defineAsyncComponent({
  loader: () => import('./Editor.vue'),
  loadingComponent: Spinner,
  errorComponent: LoadError,
  delay: 200,
  timeout: 5000,
})`

const directive = `<script setup>
import { ref } from 'vue'

// A variable named vXxx can be used as v-xxx in script setup
const vTint = {
  mounted: (el, binding) => { el.style.color = binding.value },
  updated: (el, binding) => { el.style.color = binding.value },
}

const color = ref('tomato')
</script>

<template>
  <p v-tint="color">Colored by a directive</p>
  <button @click="color = 'teal'">teal</button>
</template>
`

const plugin = `import type { App } from 'vue'

export const i18nPlugin = {
  install(app: App, options: { locale: string }) {
    app.provide('locale', options.locale)
    app.config.globalProperties.$t = (key: string) => key
    app.component('LocaleText', LocaleText)
  },
}

// main.ts
createApp(App).use(i18nPlugin, { locale: 'ja' }).mount('#app')`

const fallthrough = `<!-- Attributes not declared as props land on the root element -->
<MyButton class="large" data-id="1" />

<script setup>
defineOptions({ inheritAttrs: false })  // Turn this off
</script>

<template>
  <div><button v-bind="$attrs">Pass them to a chosen element</button></div>
</template>`

export default {
  ja: {
    lead: '<p>アプリが大きくなると、読み込みを分ける、DOM の処理を再利用する、機能をまとめて配るといった手段が必要になる。ここではその 3 つと、属性の継承を扱う。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: '非同期コンポーネント', body: '<p><code>defineAsyncComponent</code> は、描画が必要になったときに読み込む。重いグラフやエディタを分けると、最初の読み込みが軽くなる。</p>', show: lazy },
      { title: 'カスタムディレクティブ', body: '<p>DOM を直接操作する処理を再利用する仕組みである。フォーカスや外部ライブラリの適用に向く。ほとんどの処理はコンポーネントやコンポーザブルで書けるので、DOM 操作が本質のときに使う。</p>', run: directive },
      { title: 'プラグイン', body: '<p>プラグインは <code>install</code> を持つオブジェクトで、<code>app.use</code> で登録する。コンポーネントの登録や <code>provide</code> をまとめて行える。Vue Router と Pinia もプラグインである。</p>', show: plugin },
      { title: '属性の継承', body: '<p>props として宣言していない属性は、子のルート要素へ自動で渡される。別の要素に渡したいときは <code>inheritAttrs</code> を切って <code>$attrs</code> を使う。</p>', show: fallthrough },
    ],
    easy: {
      intro: '<p>この章は、ある程度アプリを作ってから読めばよい。「最初の読み込みが遅い」と感じたら非同期コンポーネント、「同じ DOM 操作を何度も書いている」と感じたらディレクティブが解決策になる。</p>',
      terms: [
        { term: '遅延読み込み', desc: '必要になるまでファイルを読み込まないこと。' },
        { term: 'プラグイン', desc: 'アプリに機能を追加する部品。' },
        { term: 'ルート要素', desc: 'コンポーネントのテンプレートの一番外の要素。' },
      ],
    },
    exercise: { title: 'v-focus を作る', task: '<code>vFocus</code> を完成させ、マウント時に要素へフォーカスするディレクティブにする。', todo: 'mounted で el.focus() を呼ぶ' },
    ui: {},
  },
  en: {
    lead: '<p>As an app grows, you need to split loading, reuse DOM work and package features. This chapter covers those three, plus attribute inheritance.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'Async components', body: '<p><code>defineAsyncComponent</code> loads a component when it is first needed. Splitting off a heavy chart or editor lightens the initial load.</p>', show: lazy },
      { title: 'Custom directives', body: '<p>A way to reuse direct DOM work, such as focusing or applying an outside library. Most logic fits components or composables, so use one when DOM access is the point.</p>', run: directive },
      { title: 'Plugins', body: '<p>A plugin is an object with <code>install</code>, registered with <code>app.use</code>. It can register components and <code>provide</code> values in one go. Vue Router and Pinia are plugins.</p>', show: plugin },
      { title: 'Attribute inheritance', body: '<p>Attributes not declared as props pass to the child\'s root element automatically. To send them elsewhere, turn off <code>inheritAttrs</code> and use <code>$attrs</code>.</p>', show: fallthrough },
    ],
    easy: {
      intro: '<p>You can read this chapter after building something. If the first load feels slow, try async components. If you keep writing the same DOM code, try a directive.</p>',
      terms: [
        { term: 'Lazy loading', desc: 'Not loading a file until it is needed.' },
        { term: 'Plugin', desc: 'A piece that adds features to an app.' },
        { term: 'Root element', desc: 'The outermost element of a component\'s template.' },
      ],
    },
    exercise: { title: 'Write v-focus', task: 'Finish <code>vFocus</code>, a directive that focuses the element when mounted.', todo: 'Call el.focus() in mounted' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
const vFocus = {
  // TODO
}
</script>

<template>
  <input v-focus />
</template>
`,
    solution: `<script setup>
const vFocus = {
  mounted: el => el.focus(),
}
</script>

<template>
  <input v-focus />
</template>
`,
    check: `assert(focused() === $('input'), '入力欄にフォーカスが当たっていません', 'The input is not focused')`,
  },
} satisfies ChapterContent
