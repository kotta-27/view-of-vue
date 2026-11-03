import type { ChapterContent } from './types'

export default {
  ja: {
    lead: '<p><code>ref</code> は <code>.value</code> だけを監視すればよい。一方、キーの数が定まらないオブジェクトでは、すべての操作を捕捉する必要がある。<code>reactive</code> はオブジェクトを <code>Proxy</code> で包み、依存をキーごとに管理する。</p>',
    steps: [
      '<b>通知はキー単位で行われる。</b><code>user.age++</code> で再実行されるのは B だけで、A と C には通知されない。',
      '<b>キーの増減は <code>ITERATE_KEY</code> で追跡する。</b>C はキーの一覧を読むため、特定のプロパティには依存しない。<code>ownKeys</code> はこの読み取りを <code>ITERATE_KEY</code> に登録し、キーの追加時に C へ通知する。',
      '<b>分割代入すると反応性が失われる。</b>取り出した値はプリミティブであり、以後の操作は Proxy を経由しない。プロパティのまま参照するか、<code>toRefs</code> を使う。',
    ],
    impl: [
      '入れ子のオブジェクトは、読まれた時点で初めて Proxy になる。',
      '配列と Map、Set には専用の処理があり、走査には <code>ARRAY_ITERATE_KEY</code> や <code>MAP_KEY_ITERATE_KEY</code> も使う。',
      '購読者がいなくなった <code>Dep</code> は <code>depsMap</code> から削除される。図の簡略実装では残る。',
    ],
    method: '簡略実装に記録機能を加えたもの。effect の実行順と結果は、本物の reactive と同じになることをテストで確認している。右のコードもテストで実行している。',
    easy: {
      intro: '<p><code>ref</code> が値 1 つの箱なら、<code>reactive</code> はオブジェクトまるごとの見張り番である。オブジェクトに受付係（Proxy）を立て、読み書きをすべて受付で通す。受付は「誰がどのキーを読んだか」を帳簿に書いておき、そのキーが変わった人にだけ知らせる。</p><p><code>const { age } = user</code> のように取り出すと、受付を通らない数字のコピーを持つことになる。これが分割代入で反応性が失われる理由である。</p>',
      terms: [
        { term: 'オブジェクト', desc: '<code>{ name: "葵", age: 20 }</code> のように、キーと値の組をまとめたもの。' },
        { term: 'Proxy', desc: 'オブジェクトの読み書きを横取りできる JavaScript の標準機能。' },
        { term: 'キー', desc: 'オブジェクトの項目名。<code>user.age</code> の <code>age</code>。' },
        { term: '分割代入', desc: 'オブジェクトから値を取り出して変数に入れる書き方。<code>const { age } = user</code>。' },
        { term: 'プリミティブ', desc: '数値や文字列など、オブジェクトでない単純な値。' },
        { term: 'WeakMap', desc: 'オブジェクトをキーにできる表。不要になったオブジェクトを保持し続けない。' },
      ],
    },
    exercise: {
      title: '分割代入で失った反応性を取り戻す',
      task: 'ボタンを押しても表示が変わらない。<code>toRefs</code> を使って <code>count</code> がリアクティブのまま取り出されるように直す。',
      todo: 'この行を toRefs を使って直す',
    },
    ui: {
      figTitle: '図 2-1 targetMap の内容',
      figCaption: '右端の A、B、C は各キーの Dep に登録された effect を示す。',
      mechanism: '仕組み',
      mechanismBody: '<p>依存は <code>targetMap</code> に格納される。これは対象オブジェクトをキーとする <code>WeakMap</code> で、値はプロパティ名から <code>Dep</code> を引く <code>Map</code> である。したがって、あるプロパティの更新で通知されるのは、そのプロパティを読んだ effect だけである。</p>',
      none: 'なし',
      notRun: '未実行',
      keysCount: '個',
      codeCaption: '第 1 章の実装に追加するコード',
      updName: 'user.name を更新',
      addCity: 'user.city を追加',
      destructure: '分割代入して age++',
      reset: '初期状態に戻す',
      starting: 'effect を 3 つ作成する',
      doName: 'user.name を更新する',
      doAge: 'user.age に 1 を加える',
      doCity: '新しいキー city を追加する',
      doDestructure: 'const { age } = user のあと age++ する',
      depsMapNote: 'Map: key → Dep',
    },
  },
  en: {
    lead: '<p>A <code>ref</code> only has to watch <code>.value</code>. An object can have any number of keys, so every operation on it must be intercepted. <code>reactive</code> wraps the object in a <code>Proxy</code> and tracks dependencies per key.</p>',
    steps: [
      '<b>Notifications are per key.</b> <code>user.age++</code> re-runs B only. A and C are not notified.',
      '<b>Adding keys is tracked with <code>ITERATE_KEY</code>.</b> C reads the list of keys, not any single property. <code>ownKeys</code> registers that read under <code>ITERATE_KEY</code>, so C is notified when a key is added.',
      '<b>Destructuring loses reactivity.</b> The extracted value is a primitive, and nothing after that goes through the Proxy. Keep using the property, or use <code>toRefs</code>.',
    ],
    impl: [
      'Nested objects become Proxies only when they are read.',
      'Arrays, Map and Set have dedicated handling, and iteration also uses <code>ARRAY_ITERATE_KEY</code> and <code>MAP_KEY_ITERATE_KEY</code>.',
      'A <code>Dep</code> with no subscribers is removed from <code>depsMap</code>. The simplified version in the figure keeps it.',
    ],
    method: 'A simplified implementation with recording added. Tests confirm that its effect order and results match the real reactive, and the code on the right is executed by the tests too.',
    easy: {
      intro: '<p>If a <code>ref</code> is a box for one value, <code>reactive</code> is a guard for a whole object. A receptionist (the Proxy) stands in front of the object and handles every read and write. The receptionist notes who read which key, and tells only those people when that key changes.</p><p><code>const { age } = user</code> takes a plain copy of the number that never passes the receptionist again. That is why destructuring loses reactivity.</p>',
      terms: [
        { term: 'Object', desc: 'A group of key and value pairs, such as <code>{ name: "Aoi", age: 20 }</code>.' },
        { term: 'Proxy', desc: 'A standard JavaScript feature that can intercept reads and writes on an object.' },
        { term: 'Key', desc: 'The name of a property. The <code>age</code> in <code>user.age</code>.' },
        { term: 'Destructuring', desc: 'Pulling values out of an object into variables: <code>const { age } = user</code>.' },
        { term: 'Primitive', desc: 'A simple value that is not an object, such as a number or a string.' },
        { term: 'WeakMap', desc: 'A map keyed by objects that does not keep unused objects alive.' },
      ],
    },
    exercise: {
      title: 'Restore reactivity after destructuring',
      task: 'The display does not change when you press the button. Use <code>toRefs</code> so that <code>count</code> stays reactive when it is extracted.',
      todo: 'Fix this line with toRefs',
    },
    ui: {
      figTitle: 'Figure 2-1 Contents of targetMap',
      figCaption: 'A, B and C on the right are the effects registered in the Dep of each key.',
      mechanism: 'How it works',
      mechanismBody: '<p>Dependencies are stored in <code>targetMap</code>, a <code>WeakMap</code> keyed by the target object. Each value is a <code>Map</code> from property name to <code>Dep</code>. So updating a property notifies only the effects that read that property.</p>',
      none: 'none',
      notRun: 'not run',
      keysCount: 'keys',
      codeCaption: 'Added to the implementation from chapter 1',
      updName: 'Update user.name',
      addCity: 'Add user.city',
      destructure: 'Destructure, then age++',
      reset: 'Reset',
      starting: 'Create three effects',
      doName: 'Update user.name',
      doAge: 'Add 1 to user.age',
      doCity: 'Add a new key, city',
      doDestructure: 'const { age } = user, then age++',
      depsMapNote: 'Map: key → Dep',
    },
  },
  exercise: {
    starter: `<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({ count: 0 })

// TODO
const { count } = state

function add() {
  state.count++
}
</script>

<template>
  <button @click="add">add</button>
  <p>{{ count }}</p>
</template>
`,
    solution: `<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({ count: 0 })

const { count } = toRefs(state)

function add() {
  state.count++
}
</script>

<template>
  <button @click="add">add</button>
  <p>{{ count }}</p>
</template>
`,
    check: `await click('button')
await click('button')
assert(text('p') === '2', '2 回押したら 2 と表示されるはずです', 'After two clicks the page should show 2')`,
  },
} satisfies ChapterContent
