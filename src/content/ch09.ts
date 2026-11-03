import type { ChapterContent } from './types'

const scene = (a: string, b: string) => `// ${a}
const theme = ref('light')
provide(themeKey, theme)

// ${b}
const theme = inject(themeKey, 'default')`

const impl = (c: string) => `function provide(key, value) {
  let provides = instance.provides
  const parentProvides = instance.parent.provides
  if (parentProvides === provides) {
    // ${c}
    provides = instance.provides = Object.create(parentProvides)
  }
  provides[key] = value
}

function inject(key, defaultValue) {
  const provides = instance.parent.provides
  if (key in provides) return provides[key]
  return defaultValue
}`

export default {
  ja: {
    lead: '<p>深い階層へ値を渡すとき、途中のコンポーネントすべてに props を通す必要はない。祖先が <code>provide</code> した値を、子孫は <code>inject</code> で受け取れる。この解決には JavaScript のプロトタイプチェーンが使われている。</p>',
    steps: [
      '<b>リアクティブにするには ref を渡す。</b>既定の設定で theme を変更すると Leaf が追従する。Leaf が読んだ ref の依存が登録されるためである。',
      '<b>値を渡すと追従しない。</b>「値を provide する」を有効にすると、theme を変更しても Leaf は変わらない。渡した時点の文字列が残るだけである。',
      '<b>最も近い祖先が優先される。</b>Middle でも provide すると、連鎖の先頭に Middle が加わり、Root の値は隠れる。',
      '<b>provide しないコンポーネントは連鎖に現れない。</b>既定の設定で Middle の行がないのは、親の <code>provides</code> をそのまま共有しているからである。',
    ],
    impl: [
      '<code>inject</code> は自分でなく親の <code>provides</code> から探す。そのため、同じコンポーネントで provide した値は自分の inject には見えない。',
      '<code>key in provides</code> で判定するので、原型をたどる処理は JavaScript に任せている。',
      'キーに <code>InjectionKey</code> を使うと、TypeScript で値の型を共有でき、名前の衝突も避けられる。',
    ],
    method: '本物の Vue。Leaf の親が持つ内部の provides を読み、プロトタイプを順にたどって表示している。provides は公開 API ではない。',
    easy: {
      intro: '<p>props は親から子へ 1 段ずつしか渡せない。ひ孫まで届けるには、間の全員を経由する必要があり、これをバケツリレーと呼ぶ。</p><p><code>provide</code> と <code>inject</code> は館内放送のようなものである。祖先が放送すると、途中を飛ばして子孫が直接受け取れる。テーマや言語など、広い範囲で使う値に向いている。</p>',
      terms: [
        { term: '祖先 / 子孫', desc: 'コンポーネントの階層で、上にあるものが祖先、下にあるものが子孫。' },
        { term: 'provide', desc: '子孫に向けて値を公開すること。' },
        { term: 'inject', desc: '祖先が公開した値を受け取ること。' },
        { term: 'バケツリレー', desc: '値を途中のコンポーネントすべてに props で渡し続けること。' },
        { term: 'プロトタイプチェーン', desc: 'オブジェクトにないプロパティを親のオブジェクトへたどって探す JavaScript の仕組み。' },
      ],
    },
    exercise: {
      title: 'ref を provide する',
      task: '親で <code>theme</code> を <code>provide</code> し、子の表示がボタンで切り替わるようにする。キーは <code>\'theme\'</code> とする。',
      todo: "provide('theme', theme) を書く",
    },
    ui: {
      figTitle: '図 9-1 provides の連鎖',
      figCaption: 'チェックを切り替えると、コンポーネントを作り直して連鎖を読み直す。緑の行が解決に使われる。',
      changeTheme: 'Root の theme を変更',
      asValue: 'ref でなく値を provide する',
      override: 'Middle でも provide する',
      chainCaption: 'Leaf から見た連鎖（上から探す）',
      none: 'なし',
      value: '値',
      above: 'その上',
      aboveDesc: 'RouterView とアプリの {n} 段（themeKey なし）',
      implCaption: '実装の要約',
      sceneCaption: '基本の使い方',
      scene: scene('祖先', '子孫（途中の階層は関係しない）'),
      implCode: impl('初回だけ、親を原型にした自分の物を作る'),
    },
  },
  en: {
    lead: '<p>To pass a value down many levels, you need not thread props through every component. A descendant can receive with <code>inject</code> what an ancestor shared with <code>provide</code>. The lookup uses the JavaScript prototype chain.</p>',
    steps: [
      '<b>Pass a ref to stay reactive.</b> With the default settings, changing theme updates Leaf, because Leaf registers a dependency on the ref it reads.',
      '<b>A plain value does not follow.</b> Turn on "provide a value" and Leaf stays the same when theme changes. It only holds the string from that moment.',
      '<b>The nearest ancestor wins.</b> If Middle also provides, it joins the head of the chain and hides the Root value.',
      '<b>Components that do not provide are absent from the chain.</b> Middle has no row by default, because it shares its parent\'s <code>provides</code> object.',
    ],
    impl: [
      '<code>inject</code> searches the parent\'s <code>provides</code>, not its own. So a value provided by a component is not visible to its own inject.',
      'The check is <code>key in provides</code>, which leaves walking the prototypes to JavaScript.',
      'Using an <code>InjectionKey</code> shares the value type through TypeScript and avoids name collisions.',
    ],
    method: 'The real Vue. The figure reads the internal provides of Leaf\'s parent and walks its prototypes. provides is not a public API.',
    easy: {
      intro: '<p>Props only go down one level at a time. To reach a great-grandchild, every component in between must pass them along. This is called prop drilling.</p><p><code>provide</code> and <code>inject</code> work like a building announcement: an ancestor broadcasts, and any descendant receives it directly. They suit values used widely, such as the theme or language.</p>',
      terms: [
        { term: 'Ancestor / descendant', desc: 'Components above in the tree are ancestors, those below are descendants.' },
        { term: 'provide', desc: 'To share a value with descendants.' },
        { term: 'inject', desc: 'To receive a value shared by an ancestor.' },
        { term: 'Prop drilling', desc: 'Passing a value through every component in between as props.' },
        { term: 'Prototype chain', desc: 'How JavaScript looks up a missing property on an object\'s parent object.' },
      ],
    },
    exercise: {
      title: 'Provide a ref',
      task: 'Use <code>provide</code> in the parent so the child display follows the button. Use <code>\'theme\'</code> as the key.',
      todo: "Write provide('theme', theme)",
    },
    ui: {
      figTitle: 'Figure 9-1 The provides chain',
      figCaption: 'Changing a checkbox rebuilds the components and reads the chain again. The green row is the one used.',
      changeTheme: 'Change the Root theme',
      asValue: 'Provide a value instead of a ref',
      override: 'Also provide in Middle',
      chainCaption: 'The chain as seen from Leaf (searched from the top)',
      none: 'none',
      value: 'value',
      above: 'Above',
      aboveDesc: '{n} levels of RouterView and the app (no themeKey)',
      implCaption: 'Summary of the implementation',
      sceneCaption: 'Basic usage',
      scene: scene('Ancestor', 'Descendant (levels in between do not matter)'),
      implCode: impl('On first use, create our own with the parent as prototype'),
    },
  },
  exercise: {
    starter: `<script setup>
import { defineComponent, inject, provide, ref } from 'vue'

const theme = ref('light')

// TODO

const Child = defineComponent({
  setup() {
    return { theme: inject('theme', 'none') }
  },
  template: '<p>{{ theme }}</p>',
})
</script>

<template>
  <button @click="theme = 'dark'">dark</button>
  <Child />
</template>
`,
    solution: `<script setup>
import { defineComponent, inject, provide, ref } from 'vue'

const theme = ref('light')

provide('theme', theme)

const Child = defineComponent({
  setup() {
    return { theme: inject('theme', 'none') }
  },
  template: '<p>{{ theme }}</p>',
})
</script>

<template>
  <button @click="theme = 'dark'">dark</button>
  <Child />
</template>
`,
    check: `assert(text('p') === 'light', '最初は light と表示されるはずです', 'It should show light first')
await click('button')
assert(text('p') === 'dark', 'ボタンで dark に変わるはずです', 'The button should change it to dark')`,
  },
} satisfies ChapterContent
