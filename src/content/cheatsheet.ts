type Row = [code: string, ja: string, en: string]

interface Group {
  title: { ja: string; en: string }
  rows: Row[]
}

export const cheatsheet: Group[] = [
  {
    title: { ja: 'テンプレート', en: 'Templates' },
    rows: [
      ['{{ value }}', '文字を埋め込む', 'Insert text'],
      [':href="url"', '属性を結びつける', 'Bind an attribute'],
      ['@click="fn"', 'イベントを受ける', 'Listen to an event'],
      ['@submit.prevent', '既定の動作を止める', 'Stop the default action'],
      ['@keyup.enter', '特定のキーで受ける', 'Listen for a key'],
      ['v-if / v-else-if / v-else', '条件で要素を作る', 'Create elements by condition'],
      ['v-show', 'CSS で表示を切り替える', 'Toggle display with CSS'],
      ['v-for="x in xs" :key="x.id"', '繰り返す', 'Repeat over a list'],
      ['v-model', '入力と同期する', 'Sync with an input'],
      ['v-model.trim / .number / .lazy', '入力値を調整する', 'Adjust the input value'],
      [':class="{ on: active }"', '条件でクラスを付ける', 'Add a class by condition'],
      [':style="{ fontSize: size }"', 'スタイルを結びつける', 'Bind styles'],
      ['v-once / v-memo="[a]"', '更新を省く', 'Skip updates'],
      ['v-html', 'HTML を描画する（信頼できる内容のみ）', 'Render HTML (trusted content only)'],
    ],
  },
  {
    title: { ja: 'リアクティビティ', en: 'Reactivity' },
    rows: [
      ['ref(0)', '値の状態。script では .value', 'State. Use .value in script'],
      ['reactive({})', 'オブジェクトの状態', 'Object state'],
      ['computed(() => a.value * 2)', '計算結果を記憶する', 'Remembered derived value'],
      ['watch(a, (next, prev) => {})', '変化に応じて実行する', 'Run on change'],
      ['watchEffect(() => {})', '読んだ値を追跡して実行する', 'Run, tracking what is read'],
      ['onWatcherCleanup(fn)', '次の実行の前に後始末する', 'Clean up before the next run'],
      ['nextTick()', 'DOM の更新を待つ', 'Wait for the DOM update'],
      ['toRefs(state)', 'reactive を ref に分ける', 'Split reactive into refs'],
      ['shallowRef(v)', '最上位だけ追跡する', 'Track the top level only'],
      ['effectScope()', 'effect をまとめて止める', 'Stop effects together'],
    ],
  },
  {
    title: { ja: 'コンポーネント', en: 'Components' },
    rows: [
      ['defineProps<{ id: number }>()', 'props を宣言する', 'Declare props'],
      ['defineEmits<{ save: [id: number] }>()', 'イベントを宣言する', 'Declare events'],
      ['defineModel<number>()', 'v-model を受ける', 'Receive v-model'],
      ['<slot name="footer" />', 'スロットを置く', 'Place a slot'],
      ['<template #footer>', 'スロットへ渡す', 'Fill a slot'],
      ['provide(key, value) / inject(key)', '離れた子孫へ渡す', 'Pass to distant descendants'],
      ['useTemplateRef("el")', '要素を参照する', 'Reference an element'],
      ['useId()', '一意な ID を作る', 'Create a unique id'],
    ],
  },
  {
    title: { ja: 'ライフサイクル', en: 'Lifecycle' },
    rows: [
      ['onMounted(fn)', 'DOM を読める。通信の開始', 'DOM is ready. Start fetching'],
      ['onUpdated(fn)', '更新の直後', 'Right after an update'],
      ['onUnmounted(fn)', '後始末', 'Clean up'],
      ['onActivated / onDeactivated', 'KeepAlive の切り替え', 'KeepAlive switching'],
    ],
  },
  {
    title: { ja: '組み込みコンポーネント', en: 'Built-in components' },
    rows: [
      ['<Transition name="fade">', '出入りのアニメーション', 'Enter and leave animation'],
      ['<TransitionGroup>', '一覧のアニメーション', 'List animation'],
      ['<KeepAlive>', '切り替えで状態を保つ', 'Keep state across switches'],
      ['<Teleport to="body">', 'DOM の別の場所へ描画する', 'Render elsewhere in the DOM'],
      ['<Suspense>', '非同期を待つ（実験的）', 'Wait for async (experimental)'],
      ['<component :is="comp">', '動的に切り替える', 'Switch dynamically'],
    ],
  },
  {
    title: { ja: 'Router と Pinia', en: 'Router and Pinia' },
    rows: [
      ['<RouterLink to="/"> / <RouterView />', 'リンクと表示場所', 'Link and display area'],
      ['useRoute() / useRouter()', '現在地の読み取りと移動', 'Read the location and navigate'],
      ['router.beforeEach(to => false)', '移動を中止する', 'Cancel a navigation'],
      ['() => import("./Page.vue")', '画面を遅延読み込みする', 'Lazy-load a screen'],
      ['defineStore("id", () => {})', 'store を定義する', 'Define a store'],
      ['storeToRefs(store)', '反応性を保って取り出す', 'Extract while keeping reactivity'],
    ],
  },
]
