// 本文の主張を、本物の Vue で確かめる
import { describe, expect, it } from 'vitest'
import { computed, effect, isReactive, reactive, ref } from '@vue/reactivity'

describe('computed', () => {
  it('読まれるまで計算しない', () => {
    let runs = 0
    const c = computed(() => { runs++; return 1 })
    expect(runs).toBe(0)
    expect(c.value).toBe(1)
    expect(runs).toBe(1)
  })
  it('依存が変わらなければ再計算しない', () => {
    let runs = 0
    const n = ref(1)
    const c = computed(() => { runs++; return n.value * 2 })
    void c.value
    void c.value
    void c.value
    expect(runs).toBe(1)
  })
  it('依存が変わっても読まれるまで再計算しない', () => {
    let runs = 0
    const n = ref(1)
    const c = computed(() => { runs++; return n.value * 2 })
    void c.value
    n.value = 2
    n.value = 3
    expect(runs).toBe(1)
    expect(c.value).toBe(6)
    expect(runs).toBe(2)
  })
  it('結果が同じなら下流の effect は走らない', () => {
    const n = ref(1)
    let getter = 0
    let downstream = 0
    const big = computed(() => { getter++; return n.value >= 5 })
    effect(() => { downstream++; void big.value })
    expect([getter, downstream]).toEqual([1, 1])
    n.value = 2
    expect([getter, downstream]).toEqual([2, 1])
    n.value = 3
    expect([getter, downstream]).toEqual([3, 1])
    n.value = 5
    expect([getter, downstream]).toEqual([4, 2])
  })
})

describe('reactive', () => {
  it('入れ子は読んだときに Proxy になる', () => {
    const raw = { inner: { n: 1 } }
    const r = reactive(raw)
    expect(isReactive(raw.inner)).toBe(false)
    expect(isReactive(r.inner)).toBe(true)
  })
  it('分割代入すると元との関係が切れる', () => {
    const user = reactive({ age: 20 })
    let runs = 0
    effect(() => { runs++; void user.age })
    let { age } = user
    age++
    expect(age).toBe(21)
    expect(user.age).toBe(20)
    expect(runs).toBe(1)
  })
})
