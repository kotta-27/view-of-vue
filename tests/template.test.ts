import { describe, expect, it } from 'vitest'
import { compile, decodeFlags } from '../src/lib/template'

describe('compile', () => {
  it('静的ノードは cached、動的ノードは patch flag つきになる', () => {
    const r = compile('<div><h1>静</h1><p :class="c">{{ m }}</p></div>')
    expect(r.errors).toEqual([])
    const [root] = r.tree
    expect(root.children[0].kind).toBe('cached')
    expect(root.children[1].kind).toBe('dynamic')
    expect(root.children[1].flags).toEqual(['TEXT', 'CLASS'])
    expect(r.code).toContain('_cache[')
  })
  it('v-for と v-if は構造として拾う', () => {
    const r = compile('<ul><li v-for="x in xs" :key="x">{{ x }}</li><b v-if="y">a</b></ul>')
    const labels = r.tree[0].children.map(n => n.label)
    expect(labels).toEqual(['v-for', 'v-if'])
    expect(r.tree[0].children[0].flags).toEqual(['KEYED_FRAGMENT'])
  })
  it('文法エラーは errors に出る', () => {
    expect(compile('<div>').errors.length).toBeGreaterThan(0)
  })
  it('長く続く静的ノードは HTML 文字列にまとめられる', () => {
    const r = compile(`<div>${'<p>静</p>'.repeat(25)}</div>`)
    expect(r.code).toContain('_createStaticVNode')
  })
  it('スロットの安定性が出力に現れる', () => {
    expect(compile('<C>{{ n }}</C>').code).toContain('_: 1 /* STABLE */')
    const dynamic = compile('<C><template v-if="ok" #default>{{ n }}</template></C>').code
    expect(dynamic).toContain('_: 2 /* DYNAMIC */')
    expect(dynamic).toContain('1024 /* DYNAMIC_SLOTS */')
  })
  it('コンポーネントの動的 props は PROPS と dynamicProps になる', () => {
    expect(compile('<C name="A" :value="a" />').code).toMatch(/8 \/\* PROPS \*\/, \["value"\]/)
  })
  it('flag を読み解く', () => {
    expect(decodeFlags(3)).toEqual(['TEXT', 'CLASS'])
    expect(decodeFlags(-1)).toEqual(['CACHED'])
    expect(decodeFlags(undefined)).toEqual([])
  })
})
