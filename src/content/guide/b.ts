import type { ChapterContent } from '../types'

const mustache = `<script setup>
import { ref } from 'vue'

const name = ref('Vue')
</script>

<template>
  <p>Hello {{ name }}</p>
  <p>{{ name.toUpperCase() }} has {{ name.length }} letters</p>
</template>
`

const bind = `<script setup>
import { ref } from 'vue'

const url = ref('https://vuejs.org')
const busy = ref(true)
</script>

<template>
  <p><a v-bind:href="url" target="_blank">Open the link</a></p>
  <p><button v-bind:disabled="busy">Save</button></p>
</template>
`

const on = `<script setup>
import { ref } from 'vue'

const count = ref(0)

function reset() {
  count.value = 0
}
</script>

<template>
  <button v-on:click="count++">{{ count }}</button>
  <button v-on:click="reset">reset</button>
</template>
`

const shorthand = `<!-- These two are the same -->
<a v-bind:href="url"></a>
<a :href="url"></a>

<!-- These two are the same -->
<button v-on:click="save"></button>
<button @click="save"></button>

<!-- Since 3.4, the value can be omitted when the names match -->
<img :src />

<!-- Bind several attributes at once -->
<input v-bind="{ id: 'name', required: true }" />`

export default {
  ja: {
    lead: '<p>テンプレートは HTML に Vue の書き方を足したものである。この章では 3 つを順に覚える。文字を埋め込む <code>{{ }}</code>、属性に値を渡す <code>v-bind</code>、イベントを受ける <code>v-on</code> である。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: '文字を埋め込む {{ }}', body: '<p>二重の波かっこの中に書いた値が、画面に表示される。値が変わると表示も変わる。中には変数のほか、JavaScript の式を 1 つ書ける。<code>if</code> のような文は書けない。テンプレートの中では <code>ref</code> の <code>.value</code> は要らない。</p>', run: mustache },
      { title: 'ディレクティブと v-bind', body: '<p><code>{{ }}</code> が使えるのは文字の部分だけで、<code>href="{{ url }}"</code> のように属性の中には書けない。属性に値を渡すには <code>v-bind</code> を使う。</p><p><code>v-</code> で始まる特別な属性をディレクティブと呼ぶ。Vue はこれを見て、DOM への処理を行う。<code>v-bind:href="url"</code> は「<code>href</code> 属性に <code>url</code> の値を結びつける」という意味で、<code>:</code> の後ろが対象の属性名、<code>"</code> の中が JavaScript の式である。</p><p><code>busy</code> を <code>false</code> にすると、<code>disabled</code> は属性ごと取り除かれる。</p>', run: bind },
      { title: 'イベントを受ける v-on', body: '<p><code>v-on</code> はイベントを受けるディレクティブである。<code>v-on:click="count++"</code> は「クリックされたら式を実行する」という意味になる。関数の名前を書くと、その関数が呼ばれる。スクリプトの中の関数では <code>.value</code> が必要なことに注意する。</p>', run: on },
      { title: '省略記法 : と @', body: '<p><code>v-bind</code> と <code>v-on</code> はとても多く使うので、省略形がある。<code>v-bind:</code> は <code>:</code>、<code>v-on:</code> は <code>@</code> と書ける。意味はまったく同じである。実際のコードはほぼ省略形で書かれており、本書もここから先は省略形を使う。第 A 章の <code>@click</code> は <code>v-on:click</code> のことだった。</p>', show: shorthand },
      { title: 'HTML を埋め込むとき', body: '<p><code>{{ }}</code> は文字として表示し、HTML として解釈しない。これは安全のためである。HTML を描画する <code>v-html</code> もあるが、利用者の入力を渡すとスクリプトを実行される危険がある。これを XSS（Cross-Site Scripting）攻撃と呼ぶ。信頼できる内容にだけ使う。</p>' },
    ],
    easy: {
      intro: '<p>まず日本語に直して読むとよい。<code>{{ name }}</code> は「ここに name の中身を出す」、<code>v-bind:href="url"</code> は「href 属性に url の中身を入れる」、<code>v-on:click="save"</code> は「クリックされたら save を実行する」である。</p><p><code>:</code> と <code>@</code> は、それぞれ <code>v-bind:</code> と <code>v-on:</code> を短く書いただけである。</p>',
      terms: [
        { term: 'ディレクティブ', desc: '<code>v-</code> で始まる、テンプレートの特別な属性。Vue への指示を書く。' },
        { term: 'v-bind', desc: '属性に値を結びつけるディレクティブ。<code>:</code> と略せる。' },
        { term: 'v-on', desc: 'イベントを受けるディレクティブ。<code>@</code> と略せる。' },
        { term: '式', desc: '値になるコード。<code>a + 1</code> や <code>fn()</code> など。' },
        { term: '属性', desc: 'HTML タグに付ける設定。<code>href</code> や <code>disabled</code> など。' },
        { term: 'イベント', desc: 'クリックや入力など、ブラウザで起きる出来事。' },
        { term: 'XSS', desc: 'Cross-Site Scripting の略。悪意のあるスクリプトをページに埋め込まれる攻撃。' },
      ],
    },
    exercise: { title: '属性を結びつける', task: '<code>disabled</code> が <code>locked</code> の値に追従するように、ボタンに <code>v-bind</code> を付ける。省略形の <code>:</code> でもよい。', todo: 'disabled を locked に結びつける' },
    ui: {},
  },
  en: {
    lead: '<p>A template is HTML plus Vue syntax. This chapter covers three things in order: <code>{{ }}</code> to insert text, <code>v-bind</code> to give attributes a value, and <code>v-on</code> to listen to events.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'Insert text with {{ }}', body: '<p>A value inside double curly braces appears on screen, and the display follows when it changes. Besides variables, you can write one JavaScript expression. Statements such as <code>if</code> do not work. Templates do not need the <code>.value</code> of a <code>ref</code>.</p>', run: mustache },
      { title: 'Directives and v-bind', body: '<p><code>{{ }}</code> only works in text. You cannot write <code>href="{{ url }}"</code> inside an attribute. To give an attribute a value, use <code>v-bind</code>.</p><p>A special attribute starting with <code>v-</code> is called a directive. Vue reads it and acts on the DOM. <code>v-bind:href="url"</code> means "bind the value of <code>url</code> to the <code>href</code> attribute". After the <code>:</code> comes the attribute name, and inside the quotes a JavaScript expression.</p><p>Set <code>busy</code> to <code>false</code> and <code>disabled</code> is removed entirely.</p>', run: bind },
      { title: 'Listen to events with v-on', body: '<p><code>v-on</code> is the directive for events. <code>v-on:click="count++"</code> means "run this expression when clicked". Give a function name and that function is called. Remember that functions in the script do need <code>.value</code>.</p>', run: on },
      { title: 'The shorthands : and @', body: '<p><code>v-bind</code> and <code>v-on</code> are used so often that they have short forms. <code>v-bind:</code> becomes <code>:</code>, and <code>v-on:</code> becomes <code>@</code>. The meaning is exactly the same. Real code nearly always uses the short forms, and so does this book from here on. The <code>@click</code> in chapter A was <code>v-on:click</code>.</p>', show: shorthand },
      { title: 'Embedding HTML', body: '<p><code>{{ }}</code> shows text and never interprets HTML, for safety. <code>v-html</code> does render HTML, but passing user input to it lets scripts run. This attack is called XSS (Cross-Site Scripting). Use it only with content you trust.</p>' },
    ],
    easy: {
      intro: '<p>Try reading them as plain sentences. <code>{{ name }}</code> means "show what is in name here". <code>v-bind:href="url"</code> means "put url in the href attribute". <code>v-on:click="save"</code> means "run save when clicked".</p><p><code>:</code> and <code>@</code> are just short ways to write <code>v-bind:</code> and <code>v-on:</code>.</p>',
      terms: [
        { term: 'Directive', desc: 'A special template attribute starting with <code>v-</code>. It gives Vue an instruction.' },
        { term: 'v-bind', desc: 'The directive that binds a value to an attribute. Shortened to <code>:</code>.' },
        { term: 'v-on', desc: 'The directive that listens to events. Shortened to <code>@</code>.' },
        { term: 'Expression', desc: 'Code that produces a value, such as <code>a + 1</code> or <code>fn()</code>.' },
        { term: 'Attribute', desc: 'A setting on an HTML tag, such as <code>href</code> or <code>disabled</code>.' },
        { term: 'Event', desc: 'Something that happens in the browser, such as a click or input.' },
        { term: 'XSS', desc: 'Short for Cross-Site Scripting. An attack that injects a malicious script into a page.' },
      ],
    },
    exercise: { title: 'Bind an attribute', task: 'Add <code>v-bind</code> to the button so <code>disabled</code> follows the value of <code>locked</code>. The short form <code>:</code> is fine too.', todo: 'Bind disabled to locked' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { ref } from 'vue'

const locked = ref(true)
</script>

<template>
  <!-- TODO -->
  <button id="save">Save</button>
  <button id="unlock" @click="locked = false">Unlock</button>
</template>
`,
    solution: `<script setup>
import { ref } from 'vue'

const locked = ref(true)
</script>

<template>
  <button id="save" :disabled="locked">Save</button>
  <button id="unlock" @click="locked = false">Unlock</button>
</template>
`,
    check: `assert($('#save').disabled, '最初は押せない状態のはずです', 'Save should start disabled')
await click('#unlock')
assert(!$('#save').disabled, 'Unlock のあとは押せるはずです', 'Save should be enabled after Unlock')`,
  },
} satisfies ChapterContent
