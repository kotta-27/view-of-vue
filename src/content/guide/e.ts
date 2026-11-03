import type { ChapterContent } from '../types'

const bind = `<script setup>
import { computed, ref } from 'vue'

const active = ref(false)
const size = ref(18)
const box = computed(() => ({ fontSize: size.value + 'px', color: active.value ? 'tomato' : 'gray' }))
</script>

<template>
  <button @click="active = !active">toggle</button>
  <button @click="size += 2">bigger</button>
  <p :class="{ on: active }" :style="box">Styled by state</p>
</template>

<style>
.on { font-weight: bold; text-decoration: underline; }
</style>
`

const scoped = `<template>
  <p class="title">Only this component</p>
</template>

<style scoped>
.title { color: green; }
</style>`

const cssVar = `<script setup>
import { ref } from 'vue'
const color = ref('tomato')
</script>

<template>
  <p class="title">Colored from state</p>
</template>

<style scoped>
.title { color: v-bind(color); }
</style>`

export default {
  ja: {
    lead: '<p>見た目は <code>class</code> と <code>style</code> で変える。Vue ではどちらにもオブジェクトや配列を渡せるので、条件による切り替えを短く書ける。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: ':class と :style', body: '<p><code>:class</code> は第 B 章の <code>v-bind:class</code> の省略形で、Vue はここにオブジェクトも受け取れる。<code>:class="{ on: active }"</code> は <code>active</code> が真のときだけ <code>on</code> を付ける。配列で複数を並べることもできる。<code>:style</code> のキーは <code>fontSize</code> のようなキャメルケースで書ける。条件が複雑なら <code>computed</code> にまとめる。</p>', run: bind },
      { title: 'scoped', body: '<p><code>&lt;style scoped&gt;</code> の CSS は、そのコンポーネントの要素にだけ効く。ほかの部品の見た目を壊さないので、既定で付けておくとよい。</p>', show: scoped },
      { title: 'CSS から状態を使う', body: '<p><code>&lt;style&gt;</code> の中で <code>v-bind()</code> を使うと、CSS の値に状態を渡せる。名前は同じだが、第 B 章のテンプレートの <code>v-bind</code> とは別の、CSS 専用の書き方である。</p>', show: cssVar },
    ],
    easy: {
      intro: '<p>CSS のクラスは見た目の設定に付けた名前である。<code>:class</code> を使うと「この条件のときだけ、この名前を付ける」と書ける。CSS と HTML を別々に直さなくても、状態を変えるだけで見た目が変わる。</p>',
      terms: [
        { term: 'CSS', desc: '色や大きさなど、見た目を指定する言語。' },
        { term: 'クラス', desc: 'CSS を当てるために要素に付ける名前。' },
        { term: 'キャメルケース', desc: '<code>fontSize</code> のように、単語の先頭を大文字でつなぐ書き方。' },
      ],
    },
    exercise: { title: '条件でクラスを付ける', task: '<code>error</code> が真のとき、<code>p</code> に <code>bad</code> クラスが付くようにする。', todo: ':class で bad を付ける' },
    ui: {},
  },
  en: {
    lead: '<p>Appearance is changed through <code>class</code> and <code>style</code>. Vue accepts objects and arrays for both, so conditional styling stays short.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: ':class and :style', body: '<p><code>:class</code> is short for <code>v-bind:class</code> from chapter B, and Vue accepts an object here. <code>:class="{ on: active }"</code> adds <code>on</code> only while <code>active</code> is truthy. Arrays work for several classes. <code>:style</code> keys can be camelCase, such as <code>fontSize</code>. Move complex conditions into a <code>computed</code>.</p>', run: bind },
      { title: 'scoped', body: '<p>CSS in <code>&lt;style scoped&gt;</code> applies only to that component\'s elements. It cannot break other components, so it is a good default.</p>', show: scoped },
      { title: 'State in CSS', body: '<p>Inside <code>&lt;style&gt;</code>, <code>v-bind()</code> passes state into a CSS value. Despite the name, it is a CSS-only form, separate from the template <code>v-bind</code> in chapter B.</p>', show: cssVar },
    ],
    easy: {
      intro: '<p>A CSS class is a name for a set of styles. <code>:class</code> lets you say "add this name only when this condition holds". You change the state, and the appearance follows.</p>',
      terms: [
        { term: 'CSS', desc: 'The language that sets colors, sizes and other appearance.' },
        { term: 'Class', desc: 'A name on an element that CSS can target.' },
        { term: 'camelCase', desc: 'Joining words with capitals, as in <code>fontSize</code>.' },
      ],
    },
    exercise: { title: 'Add a class by condition', task: 'While <code>error</code> is true, the <code>p</code> should have the <code>bad</code> class.', todo: 'Add bad with :class' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { ref } from 'vue'

const error = ref(false)
</script>

<template>
  <button @click="error = !error">toggle</button>
  <!-- TODO -->
  <p>Message</p>
</template>

<style>
.bad { color: red; }
</style>
`,
    solution: `<script setup>
import { ref } from 'vue'

const error = ref(false)
</script>

<template>
  <button @click="error = !error">toggle</button>
  <p :class="{ bad: error }">Message</p>
</template>

<style>
.bad { color: red; }
</style>
`,
    check: `assert(!$('p').classList.contains('bad'), '最初は bad が付かないはずです', 'bad should not be there at first')
await click('button')
assert($('p').classList.contains('bad'), '押すと bad が付くはずです', 'Pressing should add bad')
await click('button')
assert(!$('p').classList.contains('bad'), 'もう一度押すと外れるはずです', 'Pressing again should remove bad')`,
  },
} satisfies ChapterContent
