import type { ChapterContent } from '../types'

const setup = `import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/users/:id', name: 'user', component: () => import('./views/User.vue') },
    { path: '/:rest(.*)*', component: () => import('./views/NotFound.vue') },
  ],
})

// main.ts
createApp(App).use(router).mount('#app')`

const view = `<template>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink :to="{ name: 'user', params: { id: 7 } }">User 7</RouterLink>
  <RouterView />
</template>`

const use = `import { useRoute, useRouter } from 'vue-router'

const route = useRoute()      // Current location
const router = useRouter()    // Moves between pages

route.params.id               // '7' for /users/7
route.query.tab               // 'a' for ?tab=a
router.push({ name: 'user', params: { id: 8 } })`

const guard = `router.beforeEach(to => {
  if (to.meta.auth && !isLoggedIn()) return '/login'  // Redirect
  if (to.path === '/closed') return false             // Cancel
  // Returning nothing allows the navigation
})`

export default {
  ja: {
    lead: '<p>Vue Router は URL と画面を結びつける公式のライブラリで、SPA（Single-Page Application）を作るときに使う。ページを読み直さずに画面を切り替えられ、ブラウザの戻る操作や URL の共有もそのまま働く。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: '経路を定義する', body: '<p>経路は URL とコンポーネントの対応表である。<code>:id</code> のような動的な段は値として受け取れる。<code>() =&gt; import()</code> で書くと、その画面は開いたときに読み込まれる。</p>', show: setup },
      { title: '画面に置く', body: '<p><code>RouterView</code> が現在の画面を描画する場所で、<code>RouterLink</code> がリンクである。</p>', show: view },
      { title: 'コードから使う', body: '<p><code>useRoute</code> で現在の場所を読み、<code>useRouter</code> で移動する。params はすべて文字列である。同じコンポーネントのまま params だけ変わると <code>setup</code> は再実行されないので、変化は <code>watch</code> で受ける。</p>', show: use },
      { title: 'ナビゲーションガード', body: '<p>移動の前に割り込む処理である。<code>false</code> を返すと中止し、経路を返すとリダイレクトし、何も返さなければ許可する。第 3 引数の <code>next</code> は間違いやすいので使わなくてよい。</p>', show: guard },
    ],
    easy: {
      intro: '<p>普通のサイトはページごとに HTML を読み込む。Vue のアプリは 1 枚の HTML の中で画面を入れ替える。これを SPA と呼ぶ。Vue Router は URL を見て、どの画面を出すかを決める係である。</p><p>下の演習では、その中心の仕組みを自分で作る。</p>',
      terms: [
        { term: 'SPA', desc: 'Single-Page Application の略。1 枚の HTML の中で画面を切り替えるアプリ。' },
        { term: 'URL', desc: 'ページの住所。' },
        { term: '経路', desc: 'URL と画面の対応。ルートとも呼ぶ。' },
        { term: 'クエリ', desc: 'URL の <code>?</code> 以降に付ける追加情報。' },
        { term: 'リダイレクト', desc: '別の URL へ移すこと。' },
      ],
    },
    exercise: { title: 'ルーターの中心を作る', task: 'ブラウザで動く小さな Router を完成させる。<code>path</code> に応じたコンポーネントを <code>current</code> で返す。', todo: 'routes から path に対応するものを computed で返す' },
    ui: {},
  },
  en: {
    lead: '<p>Vue Router is the official library that connects URLs to screens, used for building an SPA (Single-Page Application). Screens change without a page reload, and the back button and shared URLs keep working.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'Define routes', body: '<p>Routes map URLs to components. A dynamic segment such as <code>:id</code> arrives as a value. With <code>() =&gt; import()</code>, a screen loads only when opened.</p>', show: setup },
      { title: 'Place them on screen', body: '<p><code>RouterView</code> is where the current screen renders, and <code>RouterLink</code> is a link.</p>', show: view },
      { title: 'Use it from code', body: '<p><code>useRoute</code> reads the current location, and <code>useRouter</code> navigates. Params are always strings. If only params change on the same component, <code>setup</code> does not run again, so react with <code>watch</code>.</p>', show: use },
      { title: 'Navigation guards', body: '<p>Guards run before a navigation. Return <code>false</code> to cancel, a location to redirect, or nothing to allow. The third <code>next</code> argument is error-prone and can be avoided.</p>', show: guard },
    ],
    easy: {
      intro: '<p>A classic site loads an HTML file per page. A Vue app swaps screens inside a single HTML page, which is called an SPA. Vue Router looks at the URL and decides which screen to show.</p><p>In the exercise below, you build the core of that yourself.</p>',
      terms: [
        { term: 'SPA', desc: 'Short for Single-Page Application. An app that switches screens inside one HTML page.' },
        { term: 'URL', desc: 'The address of a page.' },
        { term: 'Route', desc: 'A mapping from a URL to a screen.' },
        { term: 'Query', desc: 'Extra information after <code>?</code> in a URL.' },
        { term: 'Redirect', desc: 'Sending someone to a different URL.' },
      ],
    },
    exercise: { title: 'Build the core of a router', task: 'Finish a tiny router. Make <code>current</code> return the component for <code>path</code>.', todo: 'Return the matching entry from routes with computed' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { computed, ref } from 'vue'

const Home = { template: '<p>home page</p>' }
const About = { template: '<p>about page</p>' }
const routes = { '/': Home, '/about': About }

const path = ref('/')

// TODO
const current = Home
</script>

<template>
  <button @click="path = '/about'">about</button>
  <component :is="current" />
</template>
`,
    solution: `<script setup>
import { computed, ref } from 'vue'

const Home = { template: '<p>home page</p>' }
const About = { template: '<p>about page</p>' }
const routes = { '/': Home, '/about': About }

const path = ref('/')

const current = computed(() => routes[path.value])
</script>

<template>
  <button @click="path = '/about'">about</button>
  <component :is="current" />
</template>
`,
    check: `assert(text('p') === 'home page', '最初は home page です', 'It should start on home page')
await click('button')
assert(text('p') === 'about page', 'about page に切り替わるはずです', 'It should switch to about page')`,
  },
} satisfies ChapterContent
