import type { ChapterContent } from './types'

const pseudo = (c: string[]) => `// 1. ${c[0]}
while (same(c1[i], c2[i])) patch(i, i++)

// 2. ${c[1]}
while (same(c1[e1], c2[e2])) patch(e1--, e2--)

// 3. ${c[2]}
if (i > e1) mountRest()
else if (i > e2) unmountRest()
else {
  // 4. ${c[3]}
  const keyToNewIndex = new Map()

  // 5. ${c[4]}
  for (const old of middle) patchOrUnmount(old)

  // 6. ${c[5]}
  const seq = getSequence(newIndexToOldIndex)

  // 7. ${c[6]}
  for (let i = last; i >= 0; i--) mountOrMove(i)
}`

export default {
  ja: {
    lead: '<p>リストの順序が変わったとき、Vue はすべての要素を作り直さない。<code>key</code> で同じ要素を特定し、最長増加部分列を求めて、DOM の移動回数を最小にする。</p>',
    steps: [
      '<b>末尾を先頭へ移動。</b>移動は 1 回で済む。残りの要素が増加部分列に含まれるためである。',
      '<b>逆順。</b>最悪の場合でも、要素数 n に対して移動は n − 1 回である。',
      '<b>index を key にする場合。</b>要素を 1 つ選び、<code>:key="index"</code> に切り替えて並べ替える。移動は 0 回だが、テキスト更新が増え、内部状態は別の項目に残る。<code>:key="item.id"</code> では状態が項目に追従する。',
    ],
    impl: [
      '走査は先頭から、配置は末尾から行う。後ろの要素が確定していれば、それを <code>anchor</code> として <code>insertBefore</code> できる。',
      '<code>moved</code> が立たなければ <code>getSequence</code> は呼ばれない。追加や削除だけの場合は計算を省く。',
      'コンパイラが <code>KEYED_FRAGMENT</code> を付けた Fragment は、この処理へ直接進む。',
    ],
    method: 'patchKeyedChildren の処理を写した実装。本物の createRenderer に記録用の DOM を渡し、最終的な順序と操作回数が一致することを 526 通りの入力でテストしている。',
    easy: {
      intro: '<p><code>v-for</code> で作った一覧の順番が変わったとき、Vue は「どの行がどの行か」を <code>key</code> で見分ける。key は行の名札である。</p><p>名札があれば、行を作り直さずに移動するだけで済む。入力欄の文字やチェック状態も行についていく。<code>index</code>（行番号）を名札にすると、並べ替えのたびに名札の中身が入れ替わり、状態が別の行に残る不具合が起きる。</p>',
      terms: [
        { term: 'v-for', desc: '配列の要素ごとに要素を繰り返し描画するディレクティブ。' },
        { term: 'key', desc: '一覧の各行を見分けるための一意な値。' },
        { term: 'index', desc: '配列の中の位置を表す番号。0 から始まる。' },
        { term: '差分更新', desc: '全体を作り直さず、変わった所だけを更新すること。' },
        { term: '最長増加部分列', desc: '列の中から、順序を保ったまま増え続ける最も長い部分を選んだもの。' },
      ],
    },
    exercise: {
      title: '状態が行についていくようにする',
      task: '入力欄に文字を入れて「reverse」を押すと、文字が別の行に残る。<code>key</code> を直し、文字が行についていくようにする。',
      todo: 'key を直す',
    },
    ui: {
      figTitle: '図 6-1 patchKeyedChildren の実行過程',
      figCaption: '緑の要素は最長増加部分列に含まれ、移動しない。赤い点は DOM 要素が持つ内部状態を表す。',
      overview: 'アルゴリズムの概要',
      overviewBody: '<p>先頭と末尾の一致部分を処理した後、残った区間について、各要素の新旧の位置を対応づける。位置の並びのうち最長増加部分列に含まれる要素は相対順序が保たれているため、移動しなくてよい。残りの要素だけを移動する。</p>',
      keyKind: 'key の種類',
      addHead: '先頭に追加',
      removeTail: '末尾を削除',
      tailToHead: '末尾を先頭へ移動',
      headToTail: '先頭を末尾へ移動',
      reverse: '逆順',
      changeMiddle: '中間を変更',
      shuffle: 'シャッフル',
      customLabel: '新しい順序を英字で入力',
      customPlaceholder: '例 ACBX',
      apply: '適用',
      oldList: '旧リスト',
      newList: '新リスト',
      pickOp: '操作を選択する',
      toggleState: 'の内部状態を切り替える',
      move: '移動',
      mount: '作成',
      unmount: '削除',
      textUpdate: 'テキスト更新',
      lis: '増加部分列の添字',
      idle: 'DOM の要素を押すと、その要素に内部状態が付く。並べ替えると状態の行き先を確認できる',
      warn: 'index を key にすると、要素のテキストだけが更新され、内部状態は同じ位置に残る。入力中の文字やチェック状態が別の行へ移る不具合は、これが原因である。',
      pseudoCaption: 'patchKeyedChildren の要約',
      pseudo: pseudo(['先頭から同じ key を処理する', '末尾から同じ key を処理する', '片方が尽きたら、追加か削除のみ', 'key から新しい位置を引く表を作る', '旧リストを走査し、patch か削除', '移動しなくてよい最大の並びを求める', '末尾から順に、作成か移動']),
      start: '開始',
      head: '1. 先頭側の照合',
      tail: '2. 末尾側の照合',
      phaseMount: '3. 追加',
      phaseUnmount: '3. 削除',
      map: '4. 対応表の作成',
      scan: '5. 旧リストの走査',
      phaseLis: '6. 最長増加部分列',
      place: '7. 配置',
      done: '完了',
    },
  },
  en: {
    lead: '<p>When a list changes order, Vue does not rebuild every element. It identifies elements by <code>key</code> and uses the longest increasing subsequence to minimise DOM moves.</p>',
    steps: [
      '<b>Move the last item to the front.</b> One move is enough, because the other items form an increasing subsequence.',
      '<b>Reverse.</b> Even in this worst case, a list of n items takes n − 1 moves.',
      '<b>Using index as the key.</b> Pick an element, switch to <code>:key="index"</code> and reorder. There are no moves, but text updates increase and the internal state stays on a different item. With <code>:key="item.id"</code> the state follows its item.',
    ],
    impl: [
      'Scanning goes from the front, placing from the back. Once the following element is settled, it can serve as the <code>anchor</code> for <code>insertBefore</code>.',
      '<code>getSequence</code> runs only if <code>moved</code> was set, so pure additions and removals skip it.',
      'A Fragment that the compiler flagged <code>KEYED_FRAGMENT</code> goes straight to this code path.',
    ],
    method: 'A port of patchKeyedChildren. Tests give the real createRenderer a recording DOM and confirm that the final order and operation counts match across 526 inputs.',
    easy: {
      intro: '<p>When a <code>v-for</code> list changes order, Vue tells the rows apart by their <code>key</code>. A key is a name tag for a row.</p><p>With name tags, rows can be moved instead of rebuilt, and typed text or checkbox state moves along with them. If you use the <code>index</code> (row number) as the tag, the tags are reassigned on every reorder, and state ends up on the wrong row.</p>',
      terms: [
        { term: 'v-for', desc: 'A directive that renders an element once for each array item.' },
        { term: 'key', desc: 'A unique value that identifies each row of a list.' },
        { term: 'index', desc: 'The position in an array, starting from 0.' },
        { term: 'Diffing', desc: 'Updating only what changed instead of rebuilding everything.' },
        { term: 'Longest increasing subsequence', desc: 'The longest set of items that already appear in increasing order.' },
      ],
    },
    exercise: {
      title: 'Make state follow its row',
      task: 'Type into an input and press "reverse": the text stays on the wrong row. Fix the <code>key</code> so the text follows its row.',
      todo: 'Fix the key',
    },
    ui: {
      figTitle: 'Figure 6-1 patchKeyedChildren step by step',
      figCaption: 'Green items are in the longest increasing subsequence and do not move. A red dot is internal state held by a DOM element.',
      overview: 'The algorithm',
      overviewBody: '<p>After handling the matching head and tail, Vue maps old and new positions for the remaining range. Items in the longest increasing subsequence of those positions keep their relative order, so they stay. Only the rest move.</p>',
      keyKind: 'Kind of key',
      addHead: 'Add to front',
      removeTail: 'Remove last',
      tailToHead: 'Move last to front',
      headToTail: 'Move first to end',
      reverse: 'Reverse',
      changeMiddle: 'Change middle',
      shuffle: 'Shuffle',
      customLabel: 'Type a new order in letters',
      customPlaceholder: 'e.g. ACBX',
      apply: 'Apply',
      oldList: 'Old list',
      newList: 'New list',
      pickOp: 'Choose an operation',
      toggleState: ': toggle internal state',
      move: 'Moves',
      mount: 'Created',
      unmount: 'Removed',
      textUpdate: 'Text updates',
      lis: 'Subsequence indexes',
      idle: 'Press a DOM element to give it internal state, then reorder to see where the state goes',
      warn: 'With index as the key, only the text of each element updates and internal state stays in place. This is why typed text or checkbox state jumps to another row.',
      pseudoCaption: 'Summary of patchKeyedChildren',
      pseudo: pseudo(['Handle matching keys from the head', 'Handle matching keys from the tail', 'If one side is exhausted, only add or remove', 'Build a table from key to new position', 'Scan the old list: patch or remove', 'Find the largest set that need not move', 'From the tail, create or move']),
      start: 'Start',
      head: '1. Match from head',
      tail: '2. Match from tail',
      phaseMount: '3. Add',
      phaseUnmount: '3. Remove',
      map: '4. Build the table',
      scan: '5. Scan the old list',
      phaseLis: '6. Longest increasing subsequence',
      place: '7. Place',
      done: 'Done',
    },
  },
  exercise: {
    starter: `<script setup>
import { ref } from 'vue'

const rows = ref([
  { id: 'a', name: 'Apple' },
  { id: 'b', name: 'Banana' },
  { id: 'c', name: 'Cherry' },
])
</script>

<template>
  <button @click="rows.reverse()">reverse</button>
  <!-- TODO -->
  <div v-for="(row, index) in rows" :key="index" class="row">
    {{ row.name }} <input />
  </div>
</template>
`,
    solution: `<script setup>
import { ref } from 'vue'

const rows = ref([
  { id: 'a', name: 'Apple' },
  { id: 'b', name: 'Banana' },
  { id: 'c', name: 'Cherry' },
])
</script>

<template>
  <button @click="rows.reverse()">reverse</button>
  <div v-for="row in rows" :key="row.id" class="row">
    {{ row.name }} <input />
  </div>
</template>
`,
    check: `const first = [...document.querySelectorAll('.row')].find(r => r.textContent.includes('Apple'))
first.querySelector('input').value = 'memo'
await click('button')
const moved = [...document.querySelectorAll('.row')].find(r => r.textContent.includes('Apple'))
assert(moved.querySelector('input').value === 'memo', '入力した文字は Apple の行についていくはずです', 'The typed text should stay on the Apple row')`,
  },
} satisfies ChapterContent
