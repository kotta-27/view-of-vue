import type { ChapterContent } from '../types'

const events = `<script setup>
import { ref } from 'vue'

const log = ref('')
function submit() {
  log.value = 'Submitted without reload'
}
</script>

<template>
  <form @submit.prevent="submit">
    <input placeholder="Press Enter" @keyup.enter="log = 'Enter pressed'" />
    <button>Send</button>
  </form>
  <p>{{ log }}</p>
</template>
`

const form = `<script setup>
import { ref } from 'vue'

const name = ref('')
const age = ref(20)
const agree = ref(false)
const plan = ref('free')
</script>

<template>
  <input v-model.trim="name" placeholder="name" />
  <input v-model.number="age" type="number" />
  <label><input v-model="agree" type="checkbox" /> agree</label>
  <select v-model="plan">
    <option value="free">Free</option>
    <option value="pro">Pro</option>
  </select>
  <pre>{{ { name, age, agree, plan } }}</pre>
</template>
`

export default {
  ja: {
    lead: '<p>利用者の操作は <code>@</code> で受け取る。入力欄と状態の同期には <code>v-model</code> を使う。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'イベントと修飾子', body: '<p>修飾子はよくある処理を短く書く仕組みである。<code>.prevent</code> は既定の動作を止め、<code>.stop</code> は親への伝播を止め、<code>.once</code> は 1 回だけ受ける。<code>.enter</code> のようなキー修飾子もある。</p>', run: events },
      { title: 'v-model', body: '<p><code>v-model</code> は値の表示と入力の受け取りをまとめて行う。チェックボックスは真偽値、<code>select</code> は選ばれた値になる。<code>.trim</code> は前後の空白を除き、<code>.number</code> は数値に変換し、<code>.lazy</code> は入力の確定時に同期する。</p>', run: form },
    ],
    easy: {
      intro: '<p><code>v-model</code> は入力欄と変数をつなぐ紐である。入力すると変数が変わり、変数を変えると入力欄も変わる。これを双方向バインディングと呼ぶ。</p><p>フォームを送信すると、ブラウザは標準でページを読み直す。<code>@submit.prevent</code> はこれを止める定番の書き方である。</p>',
      terms: [
        { term: '修飾子', desc: '<code>.prevent</code> のように、ディレクティブの動きを調整する指定。' },
        { term: '既定の動作', desc: 'リンクの移動やフォームの送信など、ブラウザが標準で行う動作。' },
        { term: '双方向バインディング', desc: '画面の入力と変数が互いに同期すること。' },
        { term: '真偽値', desc: '<code>true</code> か <code>false</code> のどちらかの値。' },
      ],
    },
    exercise: { title: '入力を一覧に追加する', task: '<code>v-model</code> で入力欄と <code>draft</code> をつなぎ、送信で <code>items</code> に追加して欄を空にする。', todo: 'input に v-model を付ける' },
    ui: {},
  },
  en: {
    lead: '<p>User actions arrive through <code>@</code>. <code>v-model</code> keeps inputs and state in sync.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'Events and modifiers', body: '<p>Modifiers shorten common work. <code>.prevent</code> stops the default action, <code>.stop</code> stops propagation to parents, and <code>.once</code> listens one time. Key modifiers such as <code>.enter</code> exist too.</p>', run: events },
      { title: 'v-model', body: '<p><code>v-model</code> shows a value and receives input at once. A checkbox gives a boolean, and <code>select</code> gives the chosen value. <code>.trim</code> strips whitespace, <code>.number</code> converts to a number, and <code>.lazy</code> syncs when input is committed.</p>', run: form },
    ],
    easy: {
      intro: '<p><code>v-model</code> is a cord between an input and a variable. Typing changes the variable, and changing the variable updates the input. This is called two-way binding.</p><p>Submitting a form normally reloads the page. <code>@submit.prevent</code> is the usual way to stop that.</p>',
      terms: [
        { term: 'Modifier', desc: 'A suffix such as <code>.prevent</code> that adjusts a directive.' },
        { term: 'Default action', desc: 'What the browser does by itself, such as following a link or submitting a form.' },
        { term: 'Two-way binding', desc: 'Screen input and a variable staying in sync both ways.' },
        { term: 'Boolean', desc: 'A value that is either <code>true</code> or <code>false</code>.' },
      ],
    },
    exercise: { title: 'Add input to a list', task: 'Connect the input to <code>draft</code> with <code>v-model</code>. Submitting adds it to <code>items</code> and clears the field.', todo: 'Add v-model to the input' },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { ref } from 'vue'

const draft = ref('')
const items = ref([])

function add() {
  items.value.push(draft.value)
  draft.value = ''
}
</script>

<template>
  <form @submit.prevent="add">
    <!-- TODO -->
    <input />
    <button>add</button>
  </form>
  <ul><li v-for="item in items" :key="item">{{ item }}</li></ul>
</template>
`,
    solution: `<script setup>
import { ref } from 'vue'

const draft = ref('')
const items = ref([])

function add() {
  items.value.push(draft.value)
  draft.value = ''
}
</script>

<template>
  <form @submit.prevent="add">
    <input v-model="draft" />
    <button>add</button>
  </form>
  <ul><li v-for="item in items" :key="item">{{ item }}</li></ul>
</template>
`,
    check: `const input = $('input')
input.value = 'milk'
input.dispatchEvent(new Event('input'))
await tick()
await click('button')
assert(text('li') === 'milk', '入力した milk が一覧に出るはずです', 'milk should appear in the list')
assert($('input').value === '', '追加したら入力欄は空になるはずです', 'The input should be cleared')`,
  },
} satisfies ChapterContent
