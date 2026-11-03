// 第 3、4 部の本文の主張を、本物の Vue で確かめる
import { describe, expect, it } from 'vitest'
import {
  computed,
  createRenderer,
  defineComponent,
  effectScope,
  getCurrentScope,
  h,
  inject,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onScopeDispose,
  onUnmounted,
  onUpdated,
  onWatcherCleanup,
  provide,
  ref,
  shallowRef,
  watch,
  watchEffect,
  type RendererOptions,
} from 'vue'

interface N { tag: string; text: string; parent: N | null; children: N[] }

const ops: RendererOptions<N, N> = {
  patchProp() {},
  insert(el, parent, anchor) {
    if (el.parent) el.parent.children.splice(el.parent.children.indexOf(el), 1)
    el.parent = parent
    const at = anchor ? parent.children.indexOf(anchor) : parent.children.length
    parent.children.splice(at, 0, el)
  },
  remove(el) {
    el.parent!.children.splice(el.parent!.children.indexOf(el), 1)
    el.parent = null
  },
  createElement: tag => ({ tag, text: '', parent: null, children: [] }),
  createText: text => ({ tag: '#text', text, parent: null, children: [] }),
  createComment: text => ({ tag: '#comment', text, parent: null, children: [] }),
  setText(n, text) { n.text = text },
  setElementText(el, text) { el.text = text },
  parentNode: n => n.parent,
  nextSibling: n => (n.parent ? (n.parent.children[n.parent.children.indexOf(n) + 1] ?? null) : null),
}

const { render } = createRenderer(ops)
const root = (): N => ({ tag: 'root', text: '', parent: null, children: [] })

describe('ライフサイクル', () => {
  it('親子の順序', async () => {
    const log: string[] = []
    const hooks = (n: string) => {
      log.push(`${n}:setup`)
      onBeforeMount(() => log.push(`${n}:beforeMount`))
      onMounted(() => log.push(`${n}:mounted`))
      onBeforeUpdate(() => log.push(`${n}:beforeUpdate`))
      onUpdated(() => log.push(`${n}:updated`))
      onBeforeUnmount(() => log.push(`${n}:beforeUnmount`))
      onUnmounted(() => log.push(`${n}:unmounted`))
    }
    const v = ref(0)
    const Child = defineComponent({ props: ['v'], setup(p) { hooks('子'); return () => h('i', String(p.v)) } })
    const Parent = defineComponent({ setup() { hooks('親'); return () => h(Child, { v: v.value }) } })
    const r = root()
    render(h(Parent), r)
    expect(log).toEqual(['親:setup', '親:beforeMount', '子:setup', '子:beforeMount', '子:mounted', '親:mounted'])
    log.length = 0
    v.value++
    await nextTick()
    expect(log).toEqual(['親:beforeUpdate', '子:beforeUpdate', '子:updated', '親:updated'])
    log.length = 0
    render(null, r)
    await nextTick()
    expect(log).toEqual(['親:beforeUnmount', '子:beforeUnmount', '子:unmounted', '親:unmounted'])
  })
})

describe('props', () => {
  it('props が変わらない子は再描画されない', async () => {
    const counts = { p: 0, a: 0, b: 0 }
    const a = ref(1)
    const A = defineComponent({ props: ['v'], setup: p => () => { counts.a++; return h('i', String(p.v)) } })
    const B = defineComponent({ props: ['v'], setup: p => () => { counts.b++; return h('i', String(p.v)) } })
    const P = defineComponent({ setup: () => () => { counts.p++; return h('div', [h(A, { v: a.value }), h(B, { v: 0 })]) } })
    render(h(P), root())
    a.value++
    await nextTick()
    expect(counts).toEqual({ p: 2, a: 2, b: 1 })
  })
  it('描画のたびに作るオブジェクトは子を再描画させる', async () => {
    let child = 0
    const n = ref(0)
    const C = defineComponent({ props: ['cfg'], setup: p => () => { child++; return h('i', String(p.cfg.x)) } })
    const P = defineComponent({ setup: () => () => h('div', [String(n.value), h(C, { cfg: { x: 1 } })]) })
    render(h(P), root())
    n.value++
    await nextTick()
    expect(child).toBe(2)
  })
  it('emit は親から渡された on ハンドラを呼ぶ', () => {
    const seen: number[] = []
    let fire = () => {}
    const C = defineComponent({ emits: ['pick'], setup(_, { emit }) { fire = () => emit('pick', 7); return () => h('i') } })
    render(h(C, { onPick: (v: number) => seen.push(v) }), root())
    fire()
    expect(seen).toEqual([7])
  })
})

describe('provide / inject', () => {
  it('一番近い祖先の値が使われ、自分の provide は自分に見えない', () => {
    let got = ''
    let self = ''
    const Leaf = defineComponent({ setup() { got = inject('k') as string; return () => h('i') } })
    const Mid = defineComponent({ setup() { provide('k', '中'); self = inject('k') as string; return () => h(Leaf) } })
    const Top = defineComponent({ setup() { provide('k', '上'); return () => h(Mid) } })
    render(h(Top), root())
    expect(got).toBe('中')
    expect(self).toBe('上')
  })
  it('ref を渡せば孫の描画が追従する', async () => {
    const v = ref(1)
    const out: unknown[] = []
    const Leaf = defineComponent({ setup() { const k = inject('k') as typeof v; return () => { out.push(k.value); return h('i') } } })
    const Top = defineComponent({ setup() { provide('k', v); return () => h(Leaf) } })
    render(h(Top), root())
    v.value = 2
    await nextTick()
    expect(out).toEqual([1, 2])
  })
  it('値そのものを渡すと追従しない', async () => {
    const v = ref(1)
    const out: unknown[] = []
    const Leaf = defineComponent({ setup() { const k = inject('k'); return () => { out.push(k); return h('i') } } })
    const Top = defineComponent({ setup() { provide('k', v.value); return () => h(Leaf) } })
    render(h(Top), root())
    v.value = 2
    await nextTick()
    expect(out).toEqual([1])
  })
})

describe('スロット', () => {
  it('スロットの中身の依存は子の描画に属する', async () => {
    const counts = { p: 0, c: 0 }
    const n = ref(0)
    const C = defineComponent({ setup(_, { slots }) { return () => { counts.c++; return h('div', slots.default?.()) } } })
    const P = defineComponent({ setup: () => () => { counts.p++; return h(C, null, { default: () => String(n.value) }) } })
    render(h(P), root())
    n.value++
    await nextTick()
    expect(counts).toEqual({ p: 1, c: 2 })
  })
})

describe('watch', () => {
  it('watch は遅延実行で、watchEffect は即時実行', () => {
    const n = ref(0)
    const a: number[] = []
    const b: number[] = []
    const s1 = watch(n, v => a.push(v), { flush: 'sync' })
    const s2 = watchEffect(() => { b.push(n.value) }, { flush: 'sync' })
    expect([a, b]).toEqual([[], [0]])
    n.value = 1
    expect([a, b]).toEqual([[1], [0, 1]])
    s1()
    s2()
  })
  it('onWatcherCleanup は次の実行の直前に呼ばれる', () => {
    const n = ref(0)
    const log: string[] = []
    const stop = watch(n, v => {
      log.push(`run ${v}`)
      onWatcherCleanup(() => log.push(`clean ${v}`))
    }, { flush: 'sync' })
    n.value = 1
    n.value = 2
    stop()
    expect(log).toEqual(['run 1', 'clean 1', 'run 2', 'clean 2'])
  })
  it('shallowRef の中を変えても watch は反応せず、deep なら ref は反応する', () => {
    const s = shallowRef({ x: 1 })
    const d = ref({ x: 1 })
    const seen: string[] = []
    const a = watch(s, () => seen.push('s'), { flush: 'sync' })
    const b = watch(d, () => seen.push('plain'), { flush: 'sync' })
    const c = watch(d, () => seen.push('deep'), { flush: 'sync', deep: true })
    s.value.x++
    d.value.x++
    expect(seen).toEqual(['deep'])
    a(); b(); c()
  })
  it('once は一度だけ', () => {
    const n = ref(0)
    let runs = 0
    watch(n, () => runs++, { flush: 'sync', once: true })
    n.value = 1
    n.value = 2
    expect(runs).toBe(1)
  })
})

describe('effectScope', () => {
  it('stop で中の computed と watcher がまとめて止まり、onScopeDispose が呼ばれる', () => {
    const n = ref(0)
    let runs = 0
    let disposed = 0
    const scope = effectScope()
    let c!: { value: number }
    scope.run(() => {
      c = computed(() => n.value * 2)
      watch(n, () => runs++, { flush: 'sync' })
      onScopeDispose(() => disposed++)
    })
    n.value = 1
    expect(runs).toBe(1)
    scope.stop()
    n.value = 2
    expect(runs).toBe(1)
    expect(disposed).toBe(1)
    expect(typeof c.value).toBe('number')
  })
  it('setup の中は instance の scope の中で、アンマウントで止まる', async () => {
    const n = ref(0)
    let runs = 0
    let disposed = 0
    let inScope = false
    const C = defineComponent({
      setup() {
        inScope = !!getCurrentScope()
        watch(n, () => runs++, { flush: 'sync' })
        onScopeDispose(() => disposed++)
        return () => h('i')
      },
    })
    const r = root()
    render(h(C), r)
    n.value = 1
    render(null, r)
    n.value = 2
    expect(inScope).toBe(true)
    expect([runs, disposed]).toEqual([1, 1])
  })
})
