import type { ChapterContent } from '../types'

const props = `<script setup lang="ts">
interface User {
  id: number
  name: string
}

const { user, compact = false } = defineProps<{
  user: User
  compact?: boolean
}>()

const emit = defineEmits<{
  select: [id: number]
}>()
</script>`

const refs = `import { computed, ref, useTemplateRef } from 'vue'

const count = ref(0)                    // Ref<number> is inferred
const user = ref<User | null>(null)     // Give the type when it cannot be inferred
const label = computed(() => \`#\${count.value}\`) // ComputedRef<string>

const input = useTemplateRef<HTMLInputElement>('input')
input.value?.focus()                    // null until mounted`

const inject = `import type { InjectionKey, Ref } from 'vue'

export const themeKey: InjectionKey<Ref<string>> = Symbol('theme')

provide(themeKey, ref('light'))
const theme = inject(themeKey)          // Ref<string> | undefined`

const check = `npx vue-tsc --noEmit`

export default {
  ja: {
    lead: '<p>Vue は TypeScript で書かれており、型との相性がよい。<code>&lt;script setup lang="ts"&gt;</code> にすると、props や emit の間違いを実行前に見つけられる。</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'props と emits', body: '<p>型引数で宣言すると、親の書き間違いがエラーになる。<code>?</code> を付けた props は省略できる。emit は「イベント名: 引数の型の組」で書く。</p>', show: props },
      { title: 'ref と template ref', body: '<p>多くの場合、型は推論される。初期値から決まらないときだけ <code>ref&lt;T&gt;</code> と書く。要素への参照はマウントするまで <code>null</code> なので、<code>?.</code> で読む。</p>', show: refs },
      { title: 'provide と inject', body: '<p><code>InjectionKey</code> を使うと、値の型をキーに持たせられる。実体は Symbol である。</p>', show: inject },
      { title: '型チェック', body: '<p>通常のビルドは型を検査しない。<code>.vue</code> を含めて検査するには <code>vue-tsc</code> を使う。</p>', show: check },
    ],
    easy: {
      intro: '<p>TypeScript は JavaScript に「型」を足した言語である。型は「この変数には数値が入る」という約束で、破るとコードを実行する前にエディタが教えてくれる。</p><p>小さなアプリなら JavaScript のままでよい。規模が大きくなるほど効果が出る。</p>',
      terms: [
        { term: '型', desc: '値の種類を表す約束。<code>number</code> や <code>string</code> など。' },
        { term: '推論', desc: '書かなくても TypeScript が型を判断すること。' },
        { term: 'ジェネリクス', desc: '<code>ref&lt;number&gt;</code> のように、型を引数として渡す書き方。' },
        { term: 'Symbol', desc: '必ず一意になる JavaScript の値。キーの衝突を防げる。' },
      ],
    },
    exercise: { title: 'Symbol のキーで provide する', task: '文字列のキーをやめ、<code>Symbol</code> の <code>key</code> を使って <code>provide</code> と <code>inject</code> をつなぐ。', todo: "provide('count', count) を key を使う形に直す" },
    ui: {},
  },
  en: {
    lead: '<p>Vue is written in TypeScript and works well with types. With <code>&lt;script setup lang="ts"&gt;</code>, mistakes in props and emits show up before the code runs.</p>',
    steps: [], impl: [], method: '',
    sections: [
      { title: 'props and emits', body: '<p>Declaring with a type argument turns a parent\'s typos into errors. A prop marked <code>?</code> is optional. Emits are written as event name and a tuple of argument types.</p>', show: props },
      { title: 'ref and template refs', body: '<p>Types are usually inferred. Write <code>ref&lt;T&gt;</code> only when the initial value does not settle it. Element refs are <code>null</code> until mounted, so read them with <code>?.</code>.</p>', show: refs },
      { title: 'provide and inject', body: '<p><code>InjectionKey</code> carries the value type in the key. At run time it is a Symbol.</p>', show: inject },
      { title: 'Type checking', body: '<p>A normal build does not check types. Use <code>vue-tsc</code> to check them, including <code>.vue</code> files.</p>', show: check },
    ],
    easy: {
      intro: '<p>TypeScript is JavaScript plus types. A type is a promise such as "this variable holds a number". If the code breaks the promise, your editor tells you before it runs.</p><p>JavaScript is fine for small apps. Types pay off as a project grows.</p>',
      terms: [
        { term: 'Type', desc: 'A promise about what kind of value something is, such as <code>number</code> or <code>string</code>.' },
        { term: 'Inference', desc: 'TypeScript working out a type you did not write.' },
        { term: 'Generics', desc: 'Passing a type as an argument, as in <code>ref&lt;number&gt;</code>.' },
        { term: 'Symbol', desc: 'A JavaScript value that is always unique, which prevents key collisions.' },
      ],
    },
    exercise: { title: 'Provide with a Symbol key', task: 'Stop using a string key. Connect <code>provide</code> and <code>inject</code> with the Symbol <code>key</code>.', todo: "Change provide('count', count) to use key" },
    ui: {},
  },
  exercise: {
    starter: `<script setup>
import { defineComponent, inject, provide, ref } from 'vue'

const key = Symbol('count')
const count = ref(1)

// TODO
provide('count', count)

const Child = defineComponent({
  setup: () => ({ value: inject(key, 'none') }),
  template: '<p>{{ value }}</p>',
})
</script>

<template>
  <Child />
</template>
`,
    solution: `<script setup>
import { defineComponent, inject, provide, ref } from 'vue'

const key = Symbol('count')
const count = ref(1)

provide(key, count)

const Child = defineComponent({
  setup: () => ({ value: inject(key, 'none') }),
  template: '<p>{{ value }}</p>',
})
</script>

<template>
  <Child />
</template>
`,
    check: `assert(text('p') === '1', '1 と表示されるはずです', 'It should show 1')`,
  },
} satisfies ChapterContent
