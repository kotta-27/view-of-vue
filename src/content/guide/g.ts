import type { ChapterContent } from '../types'

const basics = `<script setup>
import { defineComponent, ref } from 'vue'

const Greeting = defineComponent({
  props: { name: { type: String, required: true } },
  emits: ['wave'],
  template: \`
    <p>
      <slot>Hello</slot>, {{ name }}
      <button @click="$emit('wave', name)">wave</button>
    </p>
  \`,
})

const last = ref('nobody')
</script>

<template>
  <Greeting name="Aoi" @wave="n => (last = n)">Hi</Greeting>
  <Greeting name="Ren" @wave="n => (last = n)" />
  <p>last wave: {{ last }}</p>
</template>
`

const sfc = `<!-- UserCard.vue -->
<script setup lang="ts">
const { name, age = 20 } = defineProps<{ name: string; age?: number }>()
const emit = defineEmits<{ select: [id: string] }>()
</script>

<template>
  <button @click="emit('select', name)">{{ name }} ({{ age }})</button>
  <slot name="footer"></slot>
</template>

<!-- Parent -->
<UserCard name="Aoi" @select="onSelect">
  <template #footer>Footer</template>
</UserCard>`

const model = `<!-- Rating.vue -->
<script setup lang="ts">
const value = defineModel<number>({ default: 0 })
</script>

<template>
  <button @click="value++">{{ value }}</button>
</template>

<!-- Parent -->
<Rating v-model="score" />`

export default {
  ja: {
    lead: '<p>画面は部品に分けて作る。親は <code>props</code> で値を渡し、子は <code>emit</code> で知らせ、<code>slot</code> で中身を受け取る。この 3 つが部品の接続口である。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: '3 つの接続口', body: '<p>下の例は 1 つのファイルに子を定義している。実際には子を別の <code>.vue</code> に分ける。仕組みは第 8 章と第 10 章で扱う。</p>', run: basics },
      { title: '別ファイルに分ける', body: '<p><code>defineProps</code> と <code>defineEmits</code> はインポートなしで使える。3.5 からは props を分割代入しても反応性が保たれ、既定値も書ける。ファイルをインポートすれば、そのままテンプレートで使える。</p>', show: sfc },
      { title: 'defineModel', body: '<p>3.4 以降、子で <code>v-model</code> を受けるには <code>defineModel</code> を使う。</p>', show: model },
    ],
    easy: {
      intro: '<p>コンポーネントはレゴのブロックのようなものである。ボタン、カード、一覧を部品にしておけば、組み合わせて画面を作れる。</p><p>部品には入口と出口がある。<code>props</code> が入口、<code>emit</code> が出口、<code>slot</code> は中に別の部品や文字を入れる穴である。</p>',
      terms: [
        { term: 'インポート', desc: 'ほかのファイルの機能を読み込むこと。' },
        { term: 'マクロ', desc: '<code>defineProps</code> のように、コンパイル時に処理される特別な関数。' },
        { term: 'スロット', desc: '親が内容を差し込める場所。' },
      ],
    },
    exercise: { title: 'props で値を受け取る', task: '子の <code>Badge</code> に <code>label</code> を props として宣言し、表示する。', todo: "props に 'label' を宣言する" },
    ui: {},
  },
  en: {
    lead: '<p>Screens are split into components. A parent passes values with <code>props</code>, a child notifies with <code>emit</code>, and <code>slot</code> receives content. These three are a component\'s connectors.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'The three connectors', body: '<p>This example defines the child in one file. In real code it goes in its own <code>.vue</code>. Chapters 8 and 10 cover how this works.</p>', run: basics },
      { title: 'Separate files', body: '<p><code>defineProps</code> and <code>defineEmits</code> need no import. Since 3.5, destructured props stay reactive and can have defaults. An imported file can be used directly in the template.</p>', show: sfc },
      { title: 'defineModel', body: '<p>Since 3.4, a child receives <code>v-model</code> with <code>defineModel</code>.</p>', show: model },
    ],
    easy: {
      intro: '<p>Components are like building blocks. Make a button, a card and a list into pieces, and you can combine them into screens.</p><p>A piece has an entrance and an exit. <code>props</code> is the entrance, <code>emit</code> the exit, and <code>slot</code> a hole to put other content in.</p>',
      terms: [
        { term: 'Import', desc: 'Loading features from another file.' },
        { term: 'Macro', desc: 'A special function such as <code>defineProps</code>, handled at compile time.' },
        { term: 'Slot', desc: 'A place where the parent can insert content.' },
      ],
    },
    exercise: { title: 'Receive a value with props', task: 'Declare <code>label</code> as a prop of the child <code>Badge</code> and display it.', todo: "Declare 'label' in props" },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { defineComponent, ref } from 'vue'

const Badge = defineComponent({
  // TODO
  props: [],
  template: '<b>{{ label }}</b>',
})

const text = ref('new')
</script>

<template>
  <Badge :label="text" />
  <button @click="text = 'old'">change</button>
</template>
`,
    solution: `<script setup>
import { defineComponent, ref } from 'vue'

const Badge = defineComponent({
  props: ['label'],
  template: '<b>{{ label }}</b>',
})

const text = ref('new')
</script>

<template>
  <Badge :label="text" />
  <button @click="text = 'old'">change</button>
</template>
`,
    check: `assert(text('b') === 'new', 'new と表示されるはずです', 'It should show new')
await click('button')
assert(text('b') === 'old', 'old に変わるはずです', 'It should change to old')`,
  },
} satisfies ChapterContent
