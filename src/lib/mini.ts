// 説明用の小さなリアクティブ実装。実行の全段階を Frame として記録する。
// 第 1、2 章はこれを一段階ずつ再生する。Vue 本体との一致は tests で確かめている。

export type Trace =
  | { kind: 'begin'; note: string }
  | { kind: 'run'; effect: string }
  | { kind: 'cleanup'; effect: string }
  | { kind: 'get'; dep: string; effect: string | null }
  | { kind: 'track'; dep: string; effect: string }
  | { kind: 'set'; dep: string; from: unknown; to: unknown }
  | { kind: 'skip'; dep: string }
  | { kind: 'trigger'; dep: string; effects: string[] }
  | { kind: 'done'; effect: string; output: string }
  | { kind: 'local'; note: string }

export type Link = readonly [dep: string, effect: string]

export interface Frame {
  trace: Trace
  links: Link[]
  values: Record<string, unknown>
  outputs: Record<string, string>
  running: string | null
}

interface Eff {
  name: string
  deps: Set<string>
  run(): void
}

export const ITERATE = '[keys]'

export class World {
  frames: Frame[] = []
  private subs = new Map<string, Set<Eff>>()
  private active: Eff | null = null
  private values: Record<string, unknown> = {}
  private outputs: Record<string, string> = {}

  private emit(trace: Trace) {
    const links: Link[] = []
    for (const [dep, effects] of this.subs) {
      for (const e of effects) links.push([dep, e.name])
    }
    this.frames.push({
      trace,
      links,
      values: { ...this.values },
      outputs: { ...this.outputs },
      running: this.active?.name ?? null,
    })
  }

  /** frames を空にしてから action を実行し、その記録を返す */
  record(note: string, action: () => void): Frame[] {
    this.frames = []
    this.emit({ kind: 'begin', note })
    action()
    return this.frames
  }

  private track(dep: string) {
    const e = this.active
    this.emit({ kind: 'get', dep, effect: e?.name ?? null })
    if (!e) return
    if (!this.subs.has(dep)) this.subs.set(dep, new Set())
    const set = this.subs.get(dep)!
    if (set.has(e)) return
    set.add(e)
    e.deps.add(dep)
    this.emit({ kind: 'track', dep, effect: e.name })
  }

  private trigger(dep: string) {
    const effects = [...(this.subs.get(dep) ?? [])]
    this.emit({ kind: 'trigger', dep, effects: effects.map(e => e.name) })
    for (const e of effects) e.run()
  }

  ref<T>(name: string, value: T) {
    this.values[name] = value
    const read = () => {
      this.track(name)
      return value
    }
    const write = (next: T) => {
      if (Object.is(next, value)) {
        this.emit({ kind: 'skip', dep: name })
        return
      }
      const from = value
      value = next
      this.values[name] = next
      this.emit({ kind: 'set', dep: name, from, to: next })
      this.trigger(name)
    }
    return {
      get value() {
        return read()
      },
      set value(next: T) {
        write(next)
      },
    }
  }

  reactive<T extends Record<string, unknown>>(name: string, target: T): T {
    for (const k of Object.keys(target)) this.values[`${name}.${k}`] = target[k]
    return new Proxy(target, {
      get: (t, key, receiver) => {
        if (typeof key === 'string') this.track(`${name}.${key}`)
        return Reflect.get(t, key, receiver)
      },
      set: (t, key, next, receiver) => {
        if (typeof key !== 'string') return Reflect.set(t, key, next, receiver)
        const dep = `${name}.${key}`
        const isNew = !Object.hasOwn(t, key)
        const from = t[key]
        if (!isNew && Object.is(from, next)) {
          this.emit({ kind: 'skip', dep })
          return true
        }
        Reflect.set(t, key, next, receiver)
        this.values[dep] = next
        this.emit({ kind: 'set', dep, from, to: next })
        this.trigger(dep)
        if (isNew) this.trigger(`${name}.${ITERATE}`)
        return true
      },
      ownKeys: t => {
        this.track(`${name}.${ITERATE}`)
        return Reflect.ownKeys(t)
      },
    })
  }

  effect(name: string, fn: () => string) {
    const e: Eff = {
      name,
      deps: new Set(),
      run: () => {
        this.emit({ kind: 'run', effect: name })
        for (const dep of e.deps) this.subs.get(dep)?.delete(e)
        e.deps.clear()
        this.emit({ kind: 'cleanup', effect: name })
        const prev = this.active
        this.active = e
        const output = fn()
        this.outputs[name] = output
        this.emit({ kind: 'done', effect: name, output })
        this.active = prev
      },
    }
    e.run()
  }

  /** リアクティブ系を通らない操作の記録に使う */
  local(note: string) {
    this.emit({ kind: 'local', note })
  }
}

/** 第 1 章で全文を見せる実装。tests で実際に eval して動作を確かめている */
export const MINI_SOURCE = `let activeEffect = null

function track(dep) {
  if (activeEffect) {
    dep.add(activeEffect)
    activeEffect.deps.add(dep)
  }
}

function trigger(dep) {
  for (const e of [...dep]) e.run()
}

function ref(value) {
  const dep = new Set()
  return {
    get value() {
      track(dep)
      return value
    },
    set value(next) {
      if (Object.is(next, value)) return
      value = next
      trigger(dep)
    },
  }
}

function effect(fn) {
  const e = {
    deps: new Set(),
    run() {
      e.deps.forEach(dep => dep.delete(e))
      e.deps.clear()
      const prev = activeEffect
      activeEffect = e
      fn()
      activeEffect = prev
    },
  }
  e.run()
}`

/** 第 2 章で見せる reactive の実装。MINI_SOURCE の続きとして動く */
export const MINI_REACTIVE_SOURCE = `const targetMap = new WeakMap()
const ITERATE_KEY = Symbol('iterate')

function getDep(target, key) {
  if (!targetMap.has(target)) {
    targetMap.set(target, new Map())
  }
  const depsMap = targetMap.get(target)
  if (!depsMap.has(key)) {
    depsMap.set(key, new Set())
  }
  return depsMap.get(key)
}

function reactive(target) {
  return new Proxy(target, {
    get(t, key, receiver) {
      track(getDep(t, key))
      return Reflect.get(t, key, receiver)
    },
    set(t, key, value, receiver) {
      const isNew = !Object.hasOwn(t, key)
      if (!isNew && Object.is(t[key], value)) {
        return true
      }
      Reflect.set(t, key, value, receiver)
      trigger(getDep(t, key))
      if (isNew) trigger(getDep(t, ITERATE_KEY))
      return true
    },
    ownKeys(t) {
      track(getDep(t, ITERATE_KEY))
      return Reflect.ownKeys(t)
    },
  })
}`

const lineIn = (source: string, snippet: string) =>
  source.split('\n').findIndex(l => l.includes(snippet)) + 1

const lineOf = (snippet: string) => lineIn(MINI_SOURCE, snippet)

/** Trace に対応する MINI_REACTIVE_SOURCE の行番号 */
export function reactiveLinesFor(trace: Trace): number[] {
  const at = (s: string) => lineIn(MINI_REACTIVE_SOURCE, s)
  switch (trace.kind) {
    case 'get':
      return trace.dep.endsWith(ITERATE)
        ? [at('ownKeys(t) {'), at('track(getDep(t, ITERATE_KEY))')]
        : [at('get(t, key, receiver)'), at('track(getDep(t, key))')]
    case 'track':
      return [at('depsMap.has(key)'), at('return depsMap.get(key)')]
    case 'set':
      return [at('Reflect.set(t, key, value')]
    case 'skip':
      return [at('Object.is(t[key], value)')]
    case 'trigger':
      return trace.dep.endsWith(ITERATE)
        ? [at('if (isNew) trigger')]
        : [at('trigger(getDep(t, key))')]
    default:
      return []
  }
}

/** Trace に対応する MINI_SOURCE の行番号 */
export function linesFor(trace: Trace): number[] {
  switch (trace.kind) {
    case 'run':
      return [lineOf('run() {')]
    case 'cleanup':
      return [lineOf('e.deps.forEach'), lineOf('e.deps.clear')]
    case 'get':
      return [lineOf('get value()'), lineOf('      track(dep)')]
    case 'track':
      return [lineOf('dep.add(activeEffect)'), lineOf('activeEffect.deps.add')]
    case 'set':
      return [lineOf('value = next')]
    case 'skip':
      return [lineOf('if (Object.is')]
    case 'trigger':
      return [lineOf('for (const e of [...dep])')]
    case 'done':
      return [lineOf('      fn()'), lineOf('activeEffect = prev')]
    default:
      return []
  }
}
