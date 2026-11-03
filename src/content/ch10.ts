import type { ChapterContent } from './types'

export default {
  ja: {
    lead: '<p>スロットの中身は親のテンプレートに書くが、実行されるのは子の描画中である。コンパイラはスロットの中身を関数に変換して子へ渡す。この構造により、スロットの中で読んだ状態の依存は子に属する。</p>',
    steps: [
      '<b>スロットは関数である。</b>出力の <code>default: _withCtx(...)</code> がスロットの本体で、子の描画中に呼ばれる。',
      '<b>依存は子に属する。</b>図 10-1 で n を更新しても親は再描画されない。子の描画中に n が読まれるので、子だけが更新される。',
      '<b>スコープ付きスロットは引数を受け取る。</b>子が <code>&lt;slot :item="item"&gt;</code> と書くと、その値が関数の引数になる。親から子のデータを読めるのは、この引数の仕組みによる。',
      '<b>構造が変わるスロットは印が変わる。</b>通常は <code>_: 1 /* STABLE */</code> で、親の再描画だけでは子を更新しない。<code>v-if</code> などで構造が変わると <code>_: 2 /* DYNAMIC */</code> と <code>1024 /* DYNAMIC_SLOTS */</code> が付き、親の更新に伴って子も更新される。',
    ],
    impl: [
      '<code>withCtx</code> は関数を親のインスタンスに結びつける。子の描画中に実行されても、親の文脈で解決される。',
      '子のテンプレートの <code>&lt;slot&gt;</code> は <code>renderSlot</code> に変換され、ここで渡された関数を呼ぶ。',
      '<code>shouldUpdateComponent</code> は <code>DYNAMIC_SLOTS</code> があれば、props の比較をせずに更新する。',
    ],
    method: '本物の Vue。図 10-1 は単一ファイルコンポーネントを実行し、図 10-2 は本物のコンパイラの出力を表示している。',
    easy: {
      intro: '<p>スロットは、コンポーネントに開けた「穴」である。カードの枠は子が作り、中身は親が決める、といった分担ができる。</p><p>子の <code>&lt;slot&gt;</code> の位置に、親が書いた内容が差し込まれる。スコープ付きスロットを使うと、子が持つデータを穴越しに親へ渡せる。一覧の 1 行の見た目だけを親が決めたいときに便利である。</p>',
      terms: [
        { term: 'スロット', desc: '親が内容を差し込める、コンポーネントの中の場所。' },
        { term: 'スコープ付きスロット', desc: '子がスロットへデータを渡し、親がそれを使える形のスロット。' },
        { term: 'v-slot', desc: 'スロットに渡された値を受け取るディレクティブ。<code>#default</code> と略せる。' },
        { term: 'ディレクティブ', desc: '<code>v-if</code> や <code>v-for</code> のように、テンプレートで使う特別な属性。' },
      ],
    },
    exercise: {
      title: 'スロットへデータを渡す',
      task: '子の <code>&lt;slot&gt;</code> に <code>item</code> を渡し、親の <code>v-slot</code> で受け取れるようにする。',
      todo: 'slot に :item="item" を付ける',
    },
    ui: {
      figTitle: '図 10-1 スロットの依存の所属',
      figCaption: 'n を読むのは親のテンプレートだが、再描画されるのは子だけである。',
      fig2Title: '図 10-2 スロットのコンパイル結果',
      fig2Caption: '本物のコンパイラの出力である。末尾の _ の値に注目する。',
      update: 'n を更新',
      parent: '親の再描画',
      child: '子の再描画',
      plain: '通常',
      scoped: 'スコープ付き',
      dynamic: '動的',
      template: 'テンプレート',
      output: '生成された render 関数',
      codeCaption: 'SlotParent.vue（実行中のコード）',
    },
  },
  en: {
    lead: '<p>Slot content is written in the parent template but runs while the child renders. The compiler turns it into a function and passes that to the child. As a result, state read inside a slot belongs to the child\'s dependencies.</p>',
    steps: [
      '<b>A slot is a function.</b> <code>default: _withCtx(...)</code> in the output is the slot body, called during the child render.',
      '<b>Dependencies belong to the child.</b> Updating n in figure 10-1 does not re-render the parent. n is read during the child render, so only the child updates.',
      '<b>Scoped slots take arguments.</b> When a child writes <code>&lt;slot :item="item"&gt;</code>, that value becomes an argument of the function. This is how a parent can read child data.',
      '<b>A slot whose structure changes is flagged differently.</b> Normally it is <code>_: 1 /* STABLE */</code>, and a parent render alone does not update the child. If <code>v-if</code> or similar changes the structure, it gets <code>_: 2 /* DYNAMIC */</code> and <code>1024 /* DYNAMIC_SLOTS */</code>, and the child updates along with the parent.',
    ],
    impl: [
      '<code>withCtx</code> binds the function to the parent instance, so it resolves in the parent context even while running in the child render.',
      'A <code>&lt;slot&gt;</code> in the child template compiles to <code>renderSlot</code>, which calls the function that was passed in.',
      'With <code>DYNAMIC_SLOTS</code>, <code>shouldUpdateComponent</code> updates without comparing props.',
    ],
    method: 'The real Vue. Figure 10-1 runs single-file components, and figure 10-2 shows the output of the real compiler.',
    easy: {
      intro: '<p>A slot is a hole left in a component. The child can draw the frame of a card while the parent decides what goes inside.</p><p>Whatever the parent writes is placed where the child has <code>&lt;slot&gt;</code>. With a scoped slot, the child can hand data through the hole to the parent. That helps when the parent should decide only how each row of a list looks.</p>',
      terms: [
        { term: 'Slot', desc: 'A place inside a component where the parent can insert content.' },
        { term: 'Scoped slot', desc: 'A slot that receives data from the child for the parent to use.' },
        { term: 'v-slot', desc: 'The directive that receives slot values. Shortened to <code>#default</code>.' },
        { term: 'Directive', desc: 'A special template attribute, such as <code>v-if</code> or <code>v-for</code>.' },
      ],
    },
    exercise: {
      title: 'Pass data into a slot',
      task: 'Pass <code>item</code> to the child <code>&lt;slot&gt;</code> so the parent can receive it with <code>v-slot</code>.',
      todo: 'Add :item="item" to the slot',
    },
    ui: {
      figTitle: 'Figure 10-1 Who owns slot dependencies',
      figCaption: 'The parent template reads n, yet only the child re-renders.',
      fig2Title: 'Figure 10-2 Compiled slots',
      fig2Caption: 'Output of the real compiler. Look at the value of _ at the end.',
      update: 'Update n',
      parent: 'Parent renders',
      child: 'Child renders',
      plain: 'Plain',
      scoped: 'Scoped',
      dynamic: 'Dynamic',
      template: 'Template',
      output: 'Generated render function',
      codeCaption: 'SlotParent.vue (running code)',
    },
  },
  exercise: {
    starter: `<script setup>
import { defineComponent } from 'vue'

const List = defineComponent({
  data: () => ({ items: ['a', 'b'] }),
  // TODO
  template: '<ul><li v-for="item in items"><slot></slot></li></ul>',
})
</script>

<template>
  <List v-slot="{ item }">item: {{ item }}</List>
</template>
`,
    solution: `<script setup>
import { defineComponent } from 'vue'

const List = defineComponent({
  data: () => ({ items: ['a', 'b'] }),
  template: '<ul><li v-for="item in items"><slot :item="item"></slot></li></ul>',
})
</script>

<template>
  <List v-slot="{ item }">item: {{ item }}</List>
</template>
`,
    check: `const rows = [...document.querySelectorAll('li')].map(li => li.textContent.trim())
assert(rows.join() === 'item: a,item: b', 'item: a と item: b が表示されるはずです', 'The rows should show item: a and item: b')`,
  },
} satisfies ChapterContent
