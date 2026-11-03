export interface Pitfall {
  title: string
  cause: string
  fix: string
  chapter: number | string
}

const rows = (list: [string, string, string, number | string][]): Pitfall[] =>
  list.map(([title, cause, fix, chapter]) => ({ title, cause, fix, chapter }))

export const pitfalls = {
  ja: rows([
    ['値を変えたのに画面が変わらない（分割代入）', '<code>reactive</code> から取り出した値はただの値になる。', 'プロパティのまま使うか、<code>toRefs</code> で取り出す。', 2],
    ['script で ref を読むと [object Object] になる', 'スクリプトでは <code>.value</code> が必要である。', '<code>count.value</code> と書く。テンプレートでは不要である。', 'C'],
    ['変更直後に DOM を読むと古い', 'DOM の更新はマイクロタスクまで遅れる。', '<code>await nextTick()</code> のあとで読む。', 4],
    ['setup で要素が null になる', 'DOM は <code>onMounted</code> まで存在しない。', '要素を読む処理は <code>onMounted</code> に書く。', 7],
    ['並べ替えると入力が別の行に残る', '<code>key</code> に添字を使っている。', '項目ごとに一意な ID を <code>key</code> にする。', 6],
    ['v-for の変数が v-if で読めない', '同じ要素では <code>v-if</code> が先に評価される。', '<code>computed</code> で絞り込むか、<code>template</code> で分ける。', 'D'],
    ['子で props を書き換えると警告が出る', 'props は親のもので、読み取り専用である。', '<code>emit</code> で親に依頼する。<code>v-model</code> なら <code>defineModel</code> を使う。', 8],
    ['値が同じなのに子が再描画される', '親が描画のたびに新しいオブジェクトを渡している。', '<code>computed</code> に置くか、プリミティブで渡す。', 8],
    ['provide した値が更新されない', 'ref でなく値そのものを渡している。', 'ref のまま <code>provide</code> する。', 9],
    ['watch がオブジェクトの中の変更に反応しない', '既定では ref の参照の変化だけを見る。', '<code>deep: true</code> を付けるか、getter で読むプロパティを指定する。', 11],
    ['検索で古い結果が表示される', '遅い通信が後から届いて上書きしている。', '<code>onWatcherCleanup</code> で前の通信を中止する。', 11],
    ['ページを移動してもイベントが残る', '外部への登録は自動で解除されない。', '<code>onUnmounted</code> か <code>onScopeDispose</code> で解除する。', 12],
    ['store の値が更新されない', 'store を分割代入している。', '<code>storeToRefs</code> で取り出す。', 15],
    ['URL の params が変わっても処理が走らない', '同じコンポーネントは再利用され、<code>setup</code> は再実行されない。', '<code>route.params</code> を <code>watch</code> する。', 14],
    ['shallowRef の配列に push しても変わらない', '最上位の置き換えしか追跡しない。', '新しい配列を代入する。', 18],
    ['ハイドレーションの不一致が出る', 'サーバーとブラウザで描画結果が違う。', '時刻や乱数、<code>window</code> の値は <code>onMounted</code> のあとで使う。', 19],
  ]),
  en: rows([
    ['The screen does not change (destructuring)', 'A value taken out of <code>reactive</code> is a plain value.', 'Keep using the property, or extract it with <code>toRefs</code>.', 2],
    ['A ref shows [object Object] in script', 'Scripts need <code>.value</code>.', 'Write <code>count.value</code>. Templates do not need it.', 'C'],
    ['The DOM is old right after a change', 'DOM updates wait for a microtask.', 'Read it after <code>await nextTick()</code>.', 4],
    ['An element is null in setup', 'The DOM does not exist until <code>onMounted</code>.', 'Put element access in <code>onMounted</code>.', 7],
    ['Input stays on the wrong row after sorting', '<code>key</code> uses the index.', 'Use a unique id for each item as the <code>key</code>.', 6],
    ['v-if cannot read the v-for variable', 'On one element, <code>v-if</code> is evaluated first.', 'Filter in a <code>computed</code>, or split with <code>template</code>.', 'D'],
    ['Changing a prop in a child gives a warning', 'Props belong to the parent and are read-only.', 'Ask the parent with <code>emit</code>. For <code>v-model</code>, use <code>defineModel</code>.', 8],
    ['A child re-renders with the same values', 'The parent passes a new object on every render.', 'Keep it in a <code>computed</code>, or pass primitives.', 8],
    ['A provided value does not update', 'A plain value was passed instead of a ref.', 'Provide the ref itself.', 9],
    ['watch ignores changes inside an object', 'By default it only sees the ref\'s reference change.', 'Add <code>deep: true</code>, or use a getter for the property.', 11],
    ['A search shows an old result', 'A slow response arrives late and overwrites the new one.', 'Abort the previous request with <code>onWatcherCleanup</code>.', 11],
    ['A listener survives navigation', 'Outside registrations are not removed for you.', 'Remove it in <code>onUnmounted</code> or <code>onScopeDispose</code>.', 12],
    ['A store value does not update', 'The store was destructured.', 'Extract it with <code>storeToRefs</code>.', 15],
    ['Nothing runs when URL params change', 'The same component is reused, so <code>setup</code> does not run again.', '<code>watch</code> <code>route.params</code>.', 14],
    ['push on a shallowRef array does nothing', 'Only replacing the top level is tracked.', 'Assign a new array.', 18],
    ['Hydration mismatch', 'The server and browser rendered differently.', 'Use times, random values and <code>window</code> after <code>onMounted</code>.', 19],
  ]),
}
