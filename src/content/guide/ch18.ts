import type { ChapterContent } from '../types'

const test = `// Counter.test.ts
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import Counter from './Counter.vue'

it('increments on click', async () => {
  const wrapper = mount(Counter)
  await wrapper.find('button').trigger('click')
  expect(wrapper.text()).toContain('1')
})

it('emits add', async () => {
  const wrapper = mount(Counter)
  await wrapper.find('button').trigger('click')
  expect(wrapper.emitted('add')).toEqual([[1]])
})`

const memo = `<!-- Skip updates unless the listed values change -->
<li v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
  {{ item.name }}
</li>

<!-- Pass the result, not the shared value -->
<ListItem :active="item.id === activeId" />    <!-- Good -->
<ListItem :active-id="activeId" />             <!-- Every item updates -->`

const shallow = `import { shallowRef } from 'vue'

const rows = shallowRef(hugeArray)

rows.value.push(row)                  // No update
rows.value = [...rows.value, row]     // Update`

export default {
  ja: {
    lead: '<p>動くだけでなく、壊れていないと確かめられること、遅くないことも必要である。Vue のテストの標準的な構成と、性能改善の定石をまとめる。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'テストを書く', body: '<p>公式は Vite を使う場合の単体テストに Vitest を勧め、コンポーネントのマウントには <code>@vue/test-utils</code> を勧めている。DOM の更新は非同期なので、<code>trigger</code> は <code>await</code> する。実装の内部でなく、画面に出る結果を検証する。実ブラウザでの動作は Playwright などの E2E（End-to-End）テストで確かめる。</p>', show: test },
      { title: '更新を減らす', body: '<p>まず計測する。Chrome DevTools の Performance パネルと Vue DevTools で遅い箇所を特定する。そのうえで、子に渡す props を安定させる。<code>v-once</code> は一度だけ描画し、<code>v-memo</code> は条件が同じ間の更新を省く。</p>', show: memo },
      { title: '大きなデータ', body: '<p>大きな配列を <code>ref</code> に入れると、すべての階層が Proxy になる。<code>shallowRef</code> なら最上位だけを追跡するが、更新は値の置き換えでのみ伝わる。数千行の一覧は、見えている行だけ描画する仮想スクロールを使う。</p>', show: shallow },
      { title: '読み込みを軽くする', body: '<p>画面ごとの遅延読み込み（第 14 章）と非同期コンポーネント（第 17 章）で分割する。依存ライブラリは tree-shaking が効くものを選ぶ。読み込み速度が重要なページは、サーバーで描画する SSR や、事前に HTML を作る SSG を検討する（第 19 章）。</p>' },
    ],
    easy: {
      intro: '<p>テストは「このボタンを押すと 1 増える」といった確認を自動化するコードである。直したあとに同じ確認を一瞬で繰り返せる。</p><p>性能の改善は、問題が起きてからでよい。先に計測して、本当に遅い場所だけを直す。</p>',
      terms: [
        { term: '単体テスト', desc: '関数やコンポーネントを個別に確かめるテスト。' },
        { term: 'E2E テスト', desc: 'End-to-End テストの略。実際のブラウザで操作して確かめるテスト。' },
        { term: 'tree-shaking', desc: '使っていないコードをビルドから取り除く処理。' },
        { term: '仮想スクロール', desc: '見えている部分だけを描画して長い一覧を速くする手法。' },
      ],
    },
    exercise: { title: 'shallowRef を更新する', task: '<code>shallowRef</code> の配列に <code>push</code> しても画面が変わらない。値を置き換える形に直す。', todo: '配列を新しい配列で置き換える' },
    ui: {},
  },
  en: {
    lead: '<p>Working is not enough: you must be able to confirm nothing broke, and it must not be slow. This chapter sums up the standard testing setup and the usual performance fixes.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'Write tests', body: '<p>The official docs recommend Vitest for unit tests in Vite projects, and <code>@vue/test-utils</code> for mounting components. DOM updates are asynchronous, so <code>await</code> each <code>trigger</code>. Test what appears on screen rather than internals. For real browser behaviour, use E2E (End-to-End) tests such as Playwright.</p>', show: test },
      { title: 'Reduce updates', body: '<p>Measure first: find slow spots with the Chrome DevTools Performance panel and Vue DevTools. Then keep the props passed to children stable. <code>v-once</code> renders one time, and <code>v-memo</code> skips updates while its values are unchanged.</p>', show: memo },
      { title: 'Large data', body: '<p>A large array in a <code>ref</code> becomes Proxies at every level. <code>shallowRef</code> tracks only the top, but updates then come only from replacing the value. For lists of thousands of rows, use a virtual scroller that renders only visible rows.</p>', show: shallow },
      { title: 'Lighter loading', body: '<p>Split with lazy routes (chapter 14) and async components (chapter 17). Prefer dependencies that support tree-shaking. Where load speed matters, consider SSR or SSG (chapter 19).</p>' },
    ],
    easy: {
      intro: '<p>A test is code that automates a check such as "pressing this button adds 1". After a change, you can repeat the check instantly.</p><p>Performance work can wait until there is a problem. Measure first, then fix only what is really slow.</p>',
      terms: [
        { term: 'Unit test', desc: 'A test of one function or component on its own.' },
        { term: 'E2E test', desc: 'Short for End-to-End test. A test that operates a real browser.' },
        { term: 'Tree-shaking', desc: 'Removing unused code from a build.' },
        { term: 'Virtual scrolling', desc: 'Rendering only the visible part so long lists stay fast.' },
      ],
    },
    exercise: { title: 'Update a shallowRef', task: 'Calling <code>push</code> on the <code>shallowRef</code> array does not change the page. Replace the value instead.', todo: 'Replace the array with a new array' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { shallowRef } from 'vue'

const rows = shallowRef([1, 2])

function add() {
  // TODO
  rows.value.push(3)
}
</script>

<template>
  <button @click="add">add</button>
  <p>{{ rows.length }}</p>
</template>
`,
    solution: `<script setup>
import { shallowRef } from 'vue'

const rows = shallowRef([1, 2])

function add() {
  rows.value = [...rows.value, 3]
}
</script>

<template>
  <button @click="add">add</button>
  <p>{{ rows.length }}</p>
</template>
`,
    check: `await click('button')
assert(text('p') === '3', '3 と表示されるはずです', 'It should show 3')`,
  },
} satisfies ChapterContent
