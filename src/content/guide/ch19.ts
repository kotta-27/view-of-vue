import type { ChapterContent } from '../types'

const ssr = `import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'

const app = createSSRApp({
  data: () => ({ count: 1 }),
  template: '<button>{{ count }}</button>',
})

const html = await renderToString(app)  // '<button>1</button>'`

const client = `// Browser side: use createSSRApp, not createApp, so the HTML is reused
import { createSSRApp } from 'vue'
createSSRApp(App).mount('#app')`

const safe = `<script setup>
import { onMounted, ref } from 'vue'

// window does not exist on the server
const width = ref(0)
onMounted(() => {
  width.value = window.innerWidth
})
</script>`

const deploy = `npm run build     # Writes the site to dist/
npm run preview   # Checks the build locally`

export default {
  ja: {
    lead: '<p>ここまでの Vue はブラウザの中で画面を作っていた。サーバーで HTML を作る SSR（Server-Side Rendering）と、完成したアプリの配信方法を確認する。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'SSR とハイドレーション', body: '<p>SSR ではサーバーがコンポーネントを HTML にして返す。最初の表示が速く、検索エンジンにも読まれやすい（SEO、Search Engine Optimization）。ブラウザは同じアプリを作り、DOM と対応づけてイベントを取り付ける。これをハイドレーションと呼ぶ。</p>', show: ssr },
      { title: 'ブラウザ側の起動', body: '<p>ブラウザでは <code>createApp</code> でなく <code>createSSRApp</code> を使う。サーバーの HTML と結果が食い違うとハイドレーションの不一致になるので、時刻や乱数を描画に直接使わない。</p>', show: client },
      { title: 'サーバーで動かないコード', body: '<p><code>setup</code> はサーバーでも実行される。<code>window</code> や <code>document</code> の処理は <code>onMounted</code> に書く。<code>onMounted</code> はブラウザでしか呼ばれない。</p>', show: safe },
      { title: 'Nuxt と配信', body: '<p>公式は SSR が必要ならフレームワークの利用を強く勧めている。Vue では Nuxt が代表的で、経路、SSR、データ取得が揃っている。SSR が不要なら、ビルドした静的ファイルを配信するだけでよい。事前に HTML を生成する SSG（Static Site Generation）も選べる。サブディレクトリに置く場合は Vite の <code>base</code> を設定する。</p>', show: deploy },
    ],
    easy: {
      intro: '<p>普通の Vue アプリは、JavaScript が動いてから画面を作る。SSR は先にサーバーで画面を作って送る方法で、表示が速くなる。</p><p>個人の学習や管理画面なら SSR はいらない。<code>npm run build</code> でできたファイルを公開するだけで済む。</p>',
      terms: [
        { term: 'SSR', desc: 'Server-Side Rendering の略。サーバーで HTML を作ってから送る方式。' },
        { term: 'SSG', desc: 'Static Site Generation の略。ビルド時に全ページの HTML を作っておく方式。' },
        { term: 'ハイドレーション', desc: 'サーバーの HTML に、ブラウザ側の Vue を接続する処理。' },
        { term: 'デプロイ', desc: '作ったアプリを公開すること。' },
        { term: 'SEO', desc: 'Search Engine Optimization の略。検索エンジンに正しく読まれるようにする工夫。' },
      ],
    },
    exercise: { title: 'ブラウザの処理を onMounted に移す', task: '<code>ready</code> を <code>onMounted</code> の中で <code>true</code> にする。サーバーでは <code>server</code>、ブラウザでは <code>client</code> と表示される形である。', todo: 'onMounted で ready を true にする' },
    ui: {},
  },
  en: {
    lead: '<p>So far Vue has built the screen in the browser. This chapter looks at SSR (Server-Side Rendering), where the server produces the HTML, and at shipping a finished app.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'SSR and hydration', body: '<p>With SSR, the server renders components to HTML. The first paint is fast and search engines read it easily, which helps SEO (Search Engine Optimization). The browser then creates the same app, matches it to the DOM and attaches listeners. This is hydration.</p>', show: ssr },
      { title: 'Starting in the browser', body: '<p>In the browser, use <code>createSSRApp</code> instead of <code>createApp</code>. If the output differs from the server HTML, you get a hydration mismatch, so do not render times or random values directly.</p>', show: client },
      { title: 'Code that cannot run on the server', body: '<p><code>setup</code> runs on the server too. Put <code>window</code> and <code>document</code> access in <code>onMounted</code>, which is called only in the browser.</p>', show: safe },
      { title: 'Nuxt and shipping', body: '<p>The official docs strongly recommend a framework if you need SSR. Nuxt is the main choice for Vue, with routing, SSR and data fetching included. Without SSR, just serve the built static files. Pre-generating HTML with SSG (Static Site Generation) is another option. For a subdirectory, set Vite\'s <code>base</code>.</p>', show: deploy },
    ],
    easy: {
      intro: '<p>A normal Vue app builds the screen after its JavaScript runs. SSR builds the screen on the server first and sends it, so it appears faster.</p><p>You do not need SSR for learning projects or admin screens. Publishing the files from <code>npm run build</code> is enough.</p>',
      terms: [
        { term: 'SSR', desc: 'Short for Server-Side Rendering. Producing HTML on the server before sending it.' },
        { term: 'SSG', desc: 'Short for Static Site Generation. Producing the HTML for every page at build time.' },
        { term: 'Hydration', desc: 'Connecting browser-side Vue to HTML from the server.' },
        { term: 'Deploy', desc: 'To publish an app you built.' },
        { term: 'SEO', desc: 'Short for Search Engine Optimization. Making pages easy for search engines to read.' },
      ],
    },
    exercise: { title: 'Move browser work to onMounted', task: 'Set <code>ready</code> to <code>true</code> inside <code>onMounted</code>. The page then says <code>server</code> on the server and <code>client</code> in the browser.', todo: 'Set ready to true in onMounted' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { onMounted, ref } from 'vue'

const ready = ref(false)

// TODO
</script>

<template>
  <p>{{ ready ? 'client' : 'server' }}</p>
</template>
`,
    solution: `<script setup>
import { onMounted, ref } from 'vue'

const ready = ref(false)

onMounted(() => {
  ready.value = true
})
</script>

<template>
  <p>{{ ready ? 'client' : 'server' }}</p>
</template>
`,
    check: `await tick()
assert(text('p') === 'client', 'client と表示されるはずです', 'It should show client')`,
  },
} satisfies ChapterContent
