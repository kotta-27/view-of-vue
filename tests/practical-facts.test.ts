// @vitest-environment jsdom
// 入門と実践の章の主張を、本物のライブラリで確かめる
import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, defineStore, setActivePinia, storeToRefs } from 'pinia'
import {
  computed,
  defineAsyncComponent,
  defineComponent,
  h,
  isRef,
  KeepAlive,
  nextTick,
  ref,
  Suspense,
  Teleport,
  useId,
  type Directive,
} from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { compile } from '../src/lib/template'

describe('Vue Router', () => {
  const Home = { template: '<p>home</p>' }
  const make = () =>
    createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: Home },
        { path: '/users/:id', name: 'user', component: Home },
        { path: '/admin', component: Home, meta: { auth: true } },
        { path: '/login', component: Home },
      ],
    })

  it('動的な段が params に入る', async () => {
    const r = make()
    await r.push('/users/42?tab=a')
    expect(r.currentRoute.value.params.id).toBe('42')
    expect(r.currentRoute.value.query.tab).toBe('a')
  })
  it('名前と params で移動できる', async () => {
    const r = make()
    await r.push({ name: 'user', params: { id: '7' } })
    expect(r.currentRoute.value.fullPath).toBe('/users/7')
  })
  it('ガードは false で中止し、経路を返すとリダイレクトする', async () => {
    const r = make()
    await r.push('/')
    const stop = r.beforeEach(to => (to.path === '/login' ? false : undefined))
    await r.push('/login')
    expect(r.currentRoute.value.path).toBe('/')
    stop()
    r.beforeEach(to => (to.meta.auth ? '/login' : undefined))
    await r.push('/admin')
    expect(r.currentRoute.value.path).toBe('/login')
  })
})

describe('Pinia', () => {
  const useCounter = defineStore('counter', () => {
    const count = ref(1)
    const double = computed(() => count.value * 2)
    const add = () => count.value++
    return { count, double, add }
  })
  it('setup store の state、getter、action', () => {
    setActivePinia(createPinia())
    const s = useCounter()
    s.add()
    expect([s.count, s.double]).toEqual([2, 4])
  })
  it('同じ id の store は共有される', () => {
    setActivePinia(createPinia())
    useCounter().add()
    expect(useCounter().count).toBe(2)
  })
  it('分割代入は反応性を失い、storeToRefs は保つ', () => {
    setActivePinia(createPinia())
    const s = useCounter()
    const { count } = s
    const refs = storeToRefs(s)
    s.add()
    expect(count).toBe(1)
    expect(isRef(refs.count)).toBe(true)
    expect(refs.count.value).toBe(2)
    expect(refs.double.value).toBe(4)
    expect('add' in refs).toBe(false)
  })
  it('$reset は setup store では使えない', () => {
    setActivePinia(createPinia())
    expect(() => useCounter().$reset()).toThrow()
  })
})

describe('組み込みコンポーネント', () => {
  it('KeepAlive は切り替えても状態を保ち、activated が呼ばれる', async () => {
    const A = defineComponent({
      name: 'A',
      setup() {
        const n = ref(0)
        return { n }
      },
      template: '<button @click="n++">{{ n }}</button>',
    })
    const B = { name: 'B', template: '<i>b</i>' }
    const show = ref(true)
    const w = mount(defineComponent({
      setup: () => () => h(KeepAlive, null, { default: () => h(show.value ? A : B) }),
    }))
    await w.find('button').trigger('click')
    show.value = false
    await nextTick()
    show.value = true
    await nextTick()
    expect(w.find('button').text()).toBe('1')
  })
  it('Teleport は DOM を別の場所へ移す', () => {
    const box = document.createElement('div')
    box.id = 'modal'
    document.body.append(box)
    const w = mount(defineComponent({
      setup: () => () => h('div', [h(Teleport, { to: '#modal' }, h('p', 'inside'))]),
    }))
    expect(box.textContent).toBe('inside')
    expect(w.text()).toBe('')
    w.unmount()
    box.remove()
  })
  it('Suspense は非同期 setup の間 fallback を出す', async () => {
    const Slow = defineComponent({
      async setup() {
        await Promise.resolve()
        return () => h('p', 'ready')
      },
    })
    const w = mount(defineComponent({
      setup: () => () => h(Suspense, null, { default: () => h(Slow), fallback: () => h('i', 'wait') }),
    }))
    expect(w.text()).toBe('wait')
    await flushPromises()
    await nextTick()
    expect(w.text()).toBe('ready')
  })
  it('defineAsyncComponent は読み込み後に描画する', async () => {
    const Lazy = defineAsyncComponent(async () => ({ template: '<p>lazy</p>' }))
    const w = mount(defineComponent({ setup: () => () => h('div', h(Lazy)) }))
    expect(w.text()).toBe('')
    await flushPromises()
    await nextTick()
    expect(w.text()).toBe('lazy')
  })
  it('カスタムディレクティブの mounted と updated', async () => {
    const seen: unknown[] = []
    const vLog: Directive<HTMLElement, number> = {
      mounted: (_, b) => seen.push(`m${b.value}`),
      updated: (_, b) => seen.push(`u${b.value}`),
    }
    const w = mount(defineComponent({
      directives: { log: vLog },
      data: () => ({ n: 1 }),
      template: '<p v-log="n">{{ n }}</p>',
    }))
    ;(w.vm as unknown as { n: number }).n = 2
    await nextTick()
    expect(seen).toEqual(['m1', 'u2'])
  })
  it('プラグインは install を 1 回呼び、provide と globalProperties を使える', () => {
    const install = vi.fn((app, opts) => {
      app.provide('greet', opts.word)
      app.config.globalProperties.$hi = () => opts.word
    })
    const Comp = { inject: ['greet'], template: '<p>{{ greet }} {{ $hi() }}</p>' }
    const w = mount(Comp, { global: { plugins: [[{ install }, { word: 'yo' }]] } })
    expect(install).toHaveBeenCalledOnce()
    expect(w.text()).toBe('yo yo')
  })
})

describe('SSR', () => {
  it('renderToString は HTML を返し、onMounted はサーバーで呼ばれない', async () => {
    const { createSSRApp, onMounted } = await import('vue')
    const { renderToString } = await import('vue/server-renderer')
    let mounted = false
    const app = createSSRApp({
      setup() {
        onMounted(() => (mounted = true))
        return () => h('button', '1')
      },
    })
    expect(await renderToString(app)).toBe('<button>1</button>')
    expect(mounted).toBe(false)
  })
})

describe('テストの書き方', () => {
  it('クリックと emit を検証できる', async () => {
    const C = defineComponent({
      emits: ['add'],
      setup: (_, { emit }) => () => h('button', { onClick: () => emit('add', 1) }, 'x'),
    })
    const w = mount(C)
    await w.find('button').trigger('click')
    expect(w.emitted('add')).toEqual([[1]])
  })
})

describe('v-memo と新しい API', () => {
  it('v-memo の値が同じなら更新を省く', async () => {
    const w = mount(defineComponent({
      data: () => ({ key: 1, text: 'a' }),
      template: '<p v-memo="[key]">{{ text }}</p>',
    }))
    const vm = w.vm as unknown as { key: number; text: string }
    vm.text = 'b'
    await nextTick()
    expect(w.text()).toBe('a')
    vm.key = 2
    await nextTick()
    expect(w.text()).toBe('b')
  })
  it('useId はコンポーネントごとに違う値を返す', () => {
    const ids: string[] = []
    const C = defineComponent({ setup() { ids.push(useId()); return () => h('i') } })
    mount(defineComponent({ setup: () => () => h('div', [h(C), h(C)]) }))
    expect(ids[0]).not.toBe(ids[1])
  })
  it('v-model はコンポーネントで modelValue と update:modelValue になる', () => {
    expect(compile('<C v-model="v" />').code).toMatch(/modelValue: _ctx\.v/)
    expect(compile('<C v-model="v" />').code).toMatch(/"onUpdate:modelValue"/)
  })
  it('v-if と v-show の出力の違い', () => {
    expect(compile('<p v-show="a">x</p>').code).toContain('_vShow')
    expect(compile('<p v-if="a">x</p>').code).toContain('_createCommentVNode')
  })
})
