import type { ChapterContent } from '../types'

const counter = `<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">Clicks: {{ count }}</button>
</template>

<style>
button { font-weight: bold; }
</style>
`

const create = `npm create vue@latest
cd my-app
npm install
npm run dev`

const main = `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`

export default {
  ja: {
    lead: '<p>Vue のアプリは、部品（コンポーネント）を組み合わせて作る。この章では開発環境を用意し、最初のコンポーネントを動かす。</p>',
    steps: [],
    impl: [],
    method: '',
    sections: [
      { title: '開発環境を作る', body: '<p>公式のツール create-vue を使う。Node.js <code>^22.18.0</code> または <code>24.12.0</code> 以上が必要である。質問にはすべて既定の答えで進めてよい。起動すると表示された URL で開発中の画面を確認でき、ファイルを保存すると自動で反映される。</p>', show: create },
      { title: '単一ファイルコンポーネント', body: '<p>Vue の部品は、単一ファイルコンポーネント（Single-File Component、略して SFC）という形式で書く。<code>.vue</code> ファイルは 3 つの部分でできている。<code>&lt;script setup&gt;</code> に処理、<code>&lt;template&gt;</code> に画面、<code>&lt;style&gt;</code> に見た目を書く。下のコードを書き換えて実行してみる。</p>', run: counter },
      { title: '書いたコードを読む', body: '<p>上のカウンターに出てきた 3 つを、順に見る。どれも次の章で詳しく扱うので、ここでは意味がつかめればよい。</p><ol class="walk"><li><code>const count = ref(0)</code>: <code>ref</code> は値を入れる箱である。中身の <code>0</code> が変わると、Vue がそれに気づく。第 C 章で詳しく見る。</li><li><code>{{ count }}</code>: テンプレートに書くと、箱の中身がそこに表示される。第 B 章で詳しく見る。</li><li><code>@click="count++"</code>: 「クリックされたら <code>count</code> を 1 増やす」という指定である。これも第 B 章で扱う。</li></ol><p>値が変わると、表示は Vue が自動で更新する。画面を書き換える処理は書いていない。これが Vue の基本的な考え方である。</p>' },
      { title: 'アプリを起動する', body: '<p><code>main.ts</code> がアプリの入口である。<code>createApp</code> で最上位のコンポーネントからアプリを作り、<code>mount</code> で HTML の要素に取り付ける。</p>', show: main },
    ],
    easy: {
      intro: '<p>Vue は画面を作るための道具である。HTML に「ここにこの値を出す」と書いておくと、値が変わったときに Vue が画面を直してくれる。自分で画面を書き換える処理を書かなくてよい。</p><p>まず上のカウンターを動かし、<code>Clicks</code> の文字を変えて実行してみるとよい。</p>',
      terms: [
        { term: 'フレームワーク', desc: 'アプリを作るための土台。決まった形に沿って書くと、多くの処理を任せられる。' },
        { term: 'Node.js', desc: 'ブラウザの外で JavaScript を動かす環境。開発ツールの実行に使う。' },
        { term: 'npm', desc: 'JavaScript の部品を入れたり、コマンドを実行したりする道具。' },
        { term: 'ビルド', desc: '書いたコードを、ブラウザで動く形に変換してまとめること。' },
      ],
    },
    exercise: { title: '値を増やすボタンを作る', task: 'ボタンを押すたびに <code>count</code> が 2 ずつ増えるようにする。', todo: 'count を 2 増やす処理を @click に書く' },
    ui: {},
  },
  en: {
    lead: '<p>A Vue app is built by combining pieces called components. This chapter sets up a project and runs your first component.</p>',
    steps: [],
    impl: [],
    method: '',
    sections: [
      { title: 'Set up a project', body: '<p>Use the official tool, create-vue. It needs Node.js <code>^22.18.0</code> or <code>24.12.0</code> and above. The default answers are fine for every question. Once running, open the printed URL. Saved files update the page automatically.</p>', show: create },
      { title: 'Single-file components', body: '<p>Vue components are written as Single-File Components, or SFCs for short. A <code>.vue</code> file has three parts: logic in <code>&lt;script setup&gt;</code>, the screen in <code>&lt;template&gt;</code>, and appearance in <code>&lt;style&gt;</code>. Try editing the code below and running it.</p>', run: counter },
      { title: 'Read the code you wrote', body: '<p>Look at the three things in the counter above. Each gets its own coverage soon, so a rough idea is enough for now.</p><ol class="walk"><li><code>const count = ref(0)</code>: a <code>ref</code> is a box for a value. When the <code>0</code> inside changes, Vue notices. Chapter C covers it.</li><li><code>{{ count }}</code>: in a template, this shows what is in the box. Chapter B covers it.</li><li><code>@click="count++"</code>: this says "add 1 to <code>count</code> when clicked". Chapter B covers this too.</li></ol><p>When the value changes, Vue updates the display. You wrote no code that edits the screen. That is the basic idea of Vue.</p>' },
      { title: 'Start the app', body: '<p><code>main.ts</code> is the entry point. <code>createApp</code> creates an app from the top component, and <code>mount</code> attaches it to an HTML element.</p>', show: main },
    ],
    easy: {
      intro: '<p>Vue is a tool for building screens. You mark in the HTML where a value should appear, and when the value changes, Vue fixes the screen for you. You do not write code that edits the page yourself.</p><p>Start by running the counter above. Then change the word <code>Clicks</code> and run it again.</p>',
      terms: [
        { term: 'Framework', desc: 'A foundation for building apps. If you follow its shape, it handles a lot of the work.' },
        { term: 'Node.js', desc: 'Runs JavaScript outside the browser. Development tools use it.' },
        { term: 'npm', desc: 'A tool that installs JavaScript packages and runs commands.' },
        { term: 'Build', desc: 'Converting and bundling your code into a form browsers can run.' },
      ],
    },
    exercise: { title: 'Make a button that adds', task: 'Make each button press increase <code>count</code> by 2.', todo: 'Add 2 to count in @click' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <!-- TODO -->
  <button @click="count">{{ count }}</button>
</template>
`,
    solution: `<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count += 2">{{ count }}</button>
</template>
`,
    check: `await click('button')
await click('button')
assert(text('button') === '4', '2 回押したら 4 になるはずです', 'After two clicks it should show 4')`,
  },
} satisfies ChapterContent
