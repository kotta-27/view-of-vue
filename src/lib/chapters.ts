export interface Localized {
  ja: string
  en: string
}

export interface Chapter {
  /** 表示する章番号。入門の部は英字 */
  no: number | string
  title: Localized
  summary: Localized
  apis: string
  path: string
}

export interface Part {
  no: number
  title: Localized
  chapters: Chapter[]
}

export const PARTS: Part[] = [
  {
    no: 0,
    title: { ja: '入門', en: 'Getting started' },
    chapters: [
      {
        no: 'A',
        title: { ja: '最初のアプリ', en: 'Your first app' },
        summary: { ja: '開発環境を作り、単一ファイルコンポーネントを動かす。', en: 'Set up a project and run a single-file component.' },
        apis: 'createApp, SFC, ref',
        path: '/start',
      },
      {
        no: 'B',
        title: { ja: 'テンプレート構文', en: 'Template syntax' },
        summary: { ja: '文字の埋め込み、属性、イベントの書き方を覚える。', en: 'Text, attributes and events in templates.' },
        apis: 'v-bind, v-on',
        path: '/template-syntax',
      },
      {
        no: 'C',
        title: { ja: 'リアクティブの基本', en: 'Reactivity basics' },
        summary: { ja: 'ref、reactive、computed、watch を使い分ける。', en: 'Choosing between ref, reactive, computed and watch.' },
        apis: 'ref, reactive, computed',
        path: '/reactivity-basics',
      },
      {
        no: 'D',
        title: { ja: '条件とリスト', en: 'Conditions and lists' },
        summary: { ja: '要素の出し分けと繰り返しを書く。', en: 'Showing, hiding and repeating elements.' },
        apis: 'v-if, v-show, v-for',
        path: '/conditions-lists',
      },
      {
        no: 'E',
        title: { ja: 'クラスとスタイル', en: 'Classes and styles' },
        summary: { ja: '状態に応じて見た目を変える。', en: 'Changing appearance from state.' },
        apis: ':class, :style, scoped',
        path: '/class-style',
      },
      {
        no: 'F',
        title: { ja: 'イベントとフォーム', en: 'Events and forms' },
        summary: { ja: '入力を受け取り、状態と同期する。', en: 'Taking input and syncing it with state.' },
        apis: 'v-on, v-model',
        path: '/events-forms',
      },
      {
        no: 'G',
        title: { ja: 'コンポーネントの基本', en: 'Component basics' },
        summary: { ja: '画面を部品に分け、値を受け渡す。', en: 'Splitting screens into components and passing values.' },
        apis: 'props, emits, slots, defineModel',
        path: '/component-basics',
      },
    ],
  },
  {
    no: 1,
    title: { ja: 'リアクティビティ', en: 'Reactivity' },
    chapters: [
      {
        no: 1,
        title: { ja: 'ref と effect', en: 'ref and effect' },
        summary: { ja: '実行中に読まれた値を依存として記録し、書き込み時に再実行する。', en: 'Records values read during a run, and re-runs on write.' },
        apis: 'ref, track, trigger',
        path: '/ref-effect',
      },
      {
        no: 2,
        title: { ja: 'reactive と Proxy', en: 'reactive and Proxy' },
        summary: { ja: 'Proxy で読み書きを捕捉し、依存をオブジェクトとキーの単位で管理する。', en: 'Intercepts reads and writes with Proxy, tracking per object and key.' },
        apis: 'reactive, targetMap, ITERATE_KEY',
        path: '/reactive',
      },
      {
        no: 3,
        title: { ja: 'computed', en: 'computed' },
        summary: { ja: '遅延評価とキャッシュ、結果が同じ場合の下流の抑制を確認する。', en: 'Lazy evaluation, caching, and stopping work when the result is unchanged.' },
        apis: 'computed, refreshComputed',
        path: '/computed',
      },
    ],
  },
  {
    no: 2,
    title: { ja: 'レンダリング', en: 'Rendering' },
    chapters: [
      {
        no: 4,
        title: { ja: 'スケジューラ', en: 'The scheduler' },
        summary: { ja: '更新をキューに集約し、マイクロタスクで一度に処理する。', en: 'Groups updates in a queue and runs them together in a microtask.' },
        apis: 'queueJob, flushJobs, nextTick',
        path: '/scheduler',
      },
      {
        no: 5,
        title: { ja: 'テンプレートコンパイラ', en: 'The template compiler' },
        summary: { ja: '静的な部分をキャッシュし、動的な部分に PatchFlags を付ける。', en: 'Caches static parts and marks dynamic parts with PatchFlags.' },
        apis: 'compile, PatchFlags, Block',
        path: '/compiler',
      },
      {
        no: 6,
        title: { ja: 'key つき差分更新', en: 'Keyed diffing' },
        summary: { ja: '最長増加部分列を使い、DOM の移動回数を最小にする。', en: 'Uses the longest increasing subsequence to minimise DOM moves.' },
        apis: 'patchKeyedChildren, getSequence',
        path: '/keyed-diff',
      },
    ],
  },
  {
    no: 3,
    title: { ja: 'コンポーネント', en: 'Components' },
    chapters: [
      {
        no: 7,
        title: { ja: 'ライフサイクル', en: 'Lifecycle' },
        summary: { ja: '親子のフックが実行される順序と、各時点で DOM が読めるかを確認する。', en: 'The order of parent and child hooks, and when the DOM can be read.' },
        apis: 'onMounted, onUpdated, onUnmounted',
        path: '/lifecycle',
      },
      {
        no: 8,
        title: { ja: 'props と emits', en: 'props and emits' },
        summary: { ja: '子が再描画される条件と、emit が親のハンドラを呼ぶ仕組みを見る。', en: 'When a child re-renders, and how emit calls the parent handler.' },
        apis: 'shouldUpdateComponent, emit',
        path: '/props-emits',
      },
      {
        no: 9,
        title: { ja: 'provide と inject', en: 'provide and inject' },
        summary: { ja: 'プロトタイプチェーンで祖先の値を解決する。', en: 'Resolves ancestor values through the prototype chain.' },
        apis: 'provide, inject, InjectionKey',
        path: '/provide-inject',
      },
      {
        no: 10,
        title: { ja: 'スロット', en: 'Slots' },
        summary: { ja: 'スロットは子の描画中に呼ばれる関数であり、依存も子に属する。', en: 'A slot is a function called during the child render, so its dependencies belong to the child.' },
        apis: 'renderSlot, withCtx',
        path: '/slots',
      },
    ],
  },
  {
    no: 4,
    title: { ja: '再利用', en: 'Reuse' },
    chapters: [
      {
        no: 11,
        title: { ja: 'watch と watchEffect', en: 'watch and watchEffect' },
        summary: { ja: '実行のタイミングと依存の決まり方の違い、競合の防ぎ方を確認する。', en: 'When each runs, how dependencies are chosen, and how to avoid races.' },
        apis: 'watch, watchEffect, onWatcherCleanup',
        path: '/watch',
      },
      {
        no: 12,
        title: { ja: 'コンポーザブルと effectScope', en: 'Composables and effectScope' },
        summary: { ja: '状態を持つロジックを関数に切り出し、後始末をスコープに任せる。', en: 'Extracts stateful logic into functions and leaves cleanup to scopes.' },
        apis: 'effectScope, onScopeDispose',
        path: '/composables',
      },
    ],
  },
  {
    no: 5,
    title: { ja: '実践', en: 'In practice' },
    chapters: [
      {
        no: 13,
        title: { ja: 'TypeScript', en: 'TypeScript' },
        summary: { ja: 'props、emits、ref に型を付ける。', en: 'Typing props, emits and refs.' },
        apis: 'defineProps, InjectionKey',
        path: '/typescript',
      },
      {
        no: 14,
        title: { ja: 'Vue Router', en: 'Vue Router' },
        summary: { ja: 'URL と画面を結びつける。', en: 'Connecting URLs to screens.' },
        apis: 'createRouter, RouterView',
        path: '/router',
      },
      {
        no: 15,
        title: { ja: 'Pinia', en: 'Pinia' },
        summary: { ja: 'アプリ全体の状態を管理する。', en: 'Managing app-wide state.' },
        apis: 'defineStore, storeToRefs',
        path: '/pinia',
      },
      {
        no: 16,
        title: { ja: '組み込みコンポーネント', en: 'Built-in components' },
        summary: { ja: 'アニメーション、保持、移動、非同期待ちを扱う。', en: 'Animation, caching, moving DOM and async waits.' },
        apis: 'Transition, KeepAlive, Teleport, Suspense',
        path: '/built-ins',
      },
      {
        no: 17,
        title: { ja: '非同期と拡張', en: 'Async and extensions' },
        summary: { ja: '遅延読み込み、カスタムディレクティブ、プラグインを作る。', en: 'Lazy loading, custom directives and plugins.' },
        apis: 'defineAsyncComponent, app.use',
        path: '/extending',
      },
      {
        no: 18,
        title: { ja: 'テストと性能', en: 'Testing and performance' },
        summary: { ja: '動作を自動で確かめ、遅い箇所を直す。', en: 'Testing behaviour and fixing slow spots.' },
        apis: 'Vitest, v-memo, shallowRef',
        path: '/testing-performance',
      },
      {
        no: 19,
        title: { ja: 'SSR と Nuxt', en: 'SSR and Nuxt' },
        summary: { ja: 'サーバーで描画する仕組みと、配信方法を知る。', en: 'How server rendering works, and how to ship.' },
        apis: 'createSSRApp, hydration',
        path: '/ssr',
      },
    ],
  },
]

export const CHAPTERS = PARTS.flatMap(p => p.chapters)

export const chapterBy = (no: number | string) => CHAPTERS.find(c => c.no === no)!

/** 各章を読む前に知っておくとよい章 */
export const NEEDS: Record<string, (number | string)[]> = {
  B: ['A'],
  C: ['A', 'B'],
  D: ['B', 'C'],
  E: ['B', 'C'],
  F: ['C', 'D'],
  G: ['C', 'D', 'F'],
  1: ['C'],
  2: [1],
  3: [1],
  4: ['D', 1],
  5: ['B', 'D'],
  6: ['D'],
  7: ['G'],
  8: ['G'],
  9: ['G'],
  10: ['G'],
  11: ['C', 1],
  12: ['G', 7, 11],
  13: ['G'],
  14: ['G'],
  15: ['C', 'G'],
  16: ['G'],
  17: ['G'],
  18: ['G'],
  19: ['G', 7],
}

/** 演習の進捗に使う識別子 */
export const chapterId = (no: number | string) =>
  typeof no === 'string' ? chapterBy(no).path.slice(1) : `ch${no}`
