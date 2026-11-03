import { describe, expect, it } from 'vitest'
import { effect, reactive, ref } from '@vue/reactivity'
import { ITERATE, MINI_REACTIVE_SOURCE, MINI_SOURCE, World } from '../src/lib/mini'

type RefLike = { value: number | boolean }

function scenario(
  makeRef: (name: string, v: number | boolean) => RefLike,
  makeEffect: (name: string, fn: () => string) => void,
) {
  const price = makeRef('price', 100) as { value: number }
  const qty = makeRef('qty', 2) as { value: number }
  const sale = makeRef('sale', false) as { value: boolean }
  makeEffect('total', () => String(price.value * qty.value))
  makeEffect('badge', () => (sale.value ? `特価 ${price.value}` : '通常'))
  price.value = 200
  sale.value = true
  price.value = 300
  qty.value = 3
  qty.value = 3
  sale.value = false
  price.value = 400
}

describe('mini World と本物の Vue', () => {
  it('同じ順序で effect が走り、同じ結果を出す', () => {
    const mine: string[] = []
    const world = new World()
    scenario(
      (n, v) => world.ref(n, v),
      (n, fn) => world.effect(n, () => { const o = fn(); mine.push(`${n}:${o}`); return o }),
    )
    const real: string[] = []
    scenario(
      (_, v) => ref(v) as RefLike,
      (n, fn) => { effect(() => { real.push(`${n}:${fn()}`) }) },
    )
    expect(mine).toEqual(real)
    expect(mine.length).toBeGreaterThan(5)
  })

  it('reactive も同じ順序で動く（新規キーは keys 読み取りを起こす）', () => {
    const run = (make: (o: Record<string, unknown>) => Record<string, unknown>, eff: (n: string, f: () => string) => void) => {
      const user = make({ name: '葵', age: 20 })
      eff('A', () => String(user.name))
      eff('B', () => String(user.age))
      eff('C', () => String(Object.keys(user).length))
      user.name = '蓮'
      user.age = 21
      user.age = 21
      user.city = '京都'
      user.city = '奈良'
    }
    const world = new World()
    const mine: string[] = []
    run(o => world.reactive('user', o), (n, f) => world.effect(n, () => { const o = f(); mine.push(`${n}:${o}`); return o }))
    const real: string[] = []
    run(o => reactive(o), (n, f) => { effect(() => { real.push(`${n}:${f()}`) }) })
    expect(mine).toEqual(real)
  })

  it('分岐で読まなくなった依存は解除される', () => {
    const w = new World()
    const price = w.ref('price', 100)
    const sale = w.ref('sale', true)
    w.effect('badge', () => (sale.value ? String(price.value) : '通常'))
    const on = w.frames.at(-1)!.links
    expect(on).toContainEqual(['price', 'badge'])
    sale.value = false
    expect(w.frames.at(-1)!.links).not.toContainEqual(['price', 'badge'])
  })

  it('分割代入したローカル変数の変更は何も起こさない', () => {
    const w = new World()
    const user = w.reactive('user', { age: 20 })
    w.effect('B', () => String(user.age))
    const frames = w.record('x', () => {
      let { age } = user
      age++
      w.local(String(age))
    })
    expect(frames.some(f => f.trace.kind === 'trigger')).toBe(false)
    expect(frames.some(f => f.trace.kind === 'track')).toBe(false)
  })

  it('ITERATE 依存の名前が links に出る', () => {
    const w = new World()
    const user = w.reactive('user', { a: 1 } as Record<string, number>)
    w.effect('C', () => String(Object.keys(user).length))
    expect(w.frames.at(-1)!.links).toContainEqual([`user.${ITERATE}`, 'C'])
  })
})

describe('MINI_SOURCE', () => {
  it('掲載コードはそのまま動く', () => {
    const { ref: r, effect: e } = new Function(`${MINI_SOURCE}\nreturn { ref, effect }`)() as {
      ref: <T>(v: T) => { value: T }
      effect: (fn: () => void) => void
    }
    const a = r(1)
    const flag = r(true)
    const seen: number[] = []
    let runs = 0
    e(() => { runs++; seen.push(flag.value ? a.value : -1) })
    a.value = 2
    a.value = 2
    flag.value = false
    a.value = 3
    expect(seen).toEqual([1, 2, -1])
    expect(runs).toBe(3)
  })
})

describe('MINI_REACTIVE_SOURCE', () => {
  it('掲載コードはそのまま動く', () => {
    const { reactive: re, effect: e } = new Function(
      `${MINI_SOURCE}\n${MINI_REACTIVE_SOURCE}\nreturn { reactive, effect }`,
    )() as {
      reactive: <T extends object>(v: T) => T
      effect: (fn: () => void) => void
    }
    const user = re<Record<string, unknown>>({ name: '葵', age: 20 })
    const names: unknown[] = []
    const sizes: number[] = []
    e(() => { names.push(user.name) })
    e(() => { sizes.push(Object.keys(user).length) })
    user.age = 21
    user.name = '蓮'
    user.name = '蓮'
    user.city = '京都'
    expect(names).toEqual(['葵', '蓮'])
    expect(sizes).toEqual([2, 3])
  })
})
