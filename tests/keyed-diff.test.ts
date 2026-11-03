import { describe, expect, it } from 'vitest'
import { createRenderer, h, type RendererOptions } from 'vue'
import { createDom, diffKeyed, getSequence, type Item } from '../src/lib/keyed-diff'

interface N { tag: string; text: string; parent: N | null; children: N[] }

function realDiff(a: Item[], b: Item[]) {
  const ops = { mount: 0, unmount: 0, move: 0, text: 0 }
  let counting = false
  const fresh = new Set<N>()
  const opts: RendererOptions<N, N> = {
    patchProp() {},
    insert(el, parent, anchor) {
      if (el.parent) el.parent.children.splice(el.parent.children.indexOf(el), 1)
      el.parent = parent
      const at = anchor ? parent.children.indexOf(anchor) : parent.children.length
      parent.children.splice(at, 0, el)
      if (counting && !fresh.delete(el) && el.tag === 'li') ops.move++
    },
    remove(el) {
      el.parent!.children.splice(el.parent!.children.indexOf(el), 1)
      el.parent = null
      if (counting && el.tag === 'li') ops.unmount++
    },
    createElement(tag) {
      const n: N = { tag, text: '', parent: null, children: [] }
      if (counting) { ops.mount++; fresh.add(n) }
      return n
    },
    createText: text => ({ tag: '#text', text, parent: null, children: [] }),
    createComment: text => ({ tag: '#comment', text, parent: null, children: [] }),
    setText(n, text) { n.text = text },
    setElementText(el, text) {
      el.text = text
      if (counting && el.tag === 'li' && !fresh.has(el)) ops.text++
    },
    parentNode: n => n.parent,
    nextSibling: n => n.parent ? n.parent.children[n.parent.children.indexOf(n) + 1] ?? null : null,
  }
  const { render } = createRenderer(opts)
  const root: N = { tag: 'root', text: '', parent: null, children: [] }
  const view = (items: Item[]) => h('ul', items.map(it => h('li', { key: it.key }, it.text)))
  render(view(a), root)
  counting = true
  render(view(b), root)
  return { ops, order: root.children[0].children.map(c => c.text) }
}

const items = (s: string): Item[] => [...s].map(c => ({ key: c, text: c }))
const byIndex = (s: string): Item[] => [...s].map((c, i) => ({ key: i, text: c }))

function mine(a: Item[], b: Item[]) {
  const last = diffKeyed(a, b, createDom(a)).at(-1)!
  const { mount, unmount, move, text } = last.ops
  return { ops: { mount, unmount, move, text }, order: last.dom.map(e => e.text) }
}

describe('getSequence', () => {
  it('最長増加部分列の添字を返す', () => {
    expect(getSequence([5, 3, 4, 0])).toEqual([1, 2])
  })
})

describe('diffKeyed と本物の renderer', () => {
  const cases: [string, string][] = [
    ['ABCDEFG', 'ABECDHFG'],
    ['ABC', 'XABC'],
    ['ABC', 'ABCX'],
    ['ABC', 'AB'],
    ['ABC', 'BC'],
    ['ABCDE', 'EDCBA'],
    ['ABCDE', 'EABCD'],
    ['ABCDE', 'BCDEA'],
    ['ABCD', 'WXYZ'],
    ['ABCDEF', 'ADF'],
    ['ABCDEFGH', 'AHCFEDGB'],
    ['', 'AB'],
    ['AB', ''],
  ]
  it.each(cases)('%s → %s (key = id)', (a, b) => {
    expect(mine(items(a), items(b))).toEqual(realDiff(items(a), items(b)))
  })
  it.each(cases)('%s → %s (key = index)', (a, b) => {
    expect(mine(byIndex(a), byIndex(b))).toEqual(realDiff(byIndex(a), byIndex(b)))
  })
  it('乱数の並べ替え 500 通りでも一致する', () => {
    let seed = 42
    const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32
    const letters = 'ABCDEFGHIJKLMNOP'
    for (let n = 0; n < 500; n++) {
      const pool = [...letters].sort(() => rnd() - 0.5)
      const a = pool.slice(0, 2 + Math.floor(rnd() * 10)).join('')
      const b = [...letters].sort(() => rnd() - 0.5).slice(0, 2 + Math.floor(rnd() * 10))
        .concat([...a].slice(0, Math.floor(rnd() * a.length)))
      const uniq = [...new Set(b)].sort(() => rnd() - 0.5).join('')
      expect(mine(items(a), items(uniq)), `${a} → ${uniq}`).toEqual(realDiff(items(a), items(uniq)))
    }
  })
})

describe('要素の内部状態', () => {
  it('index を key にすると状態は位置に残り、id なら項目についていく', () => {
    const run = (mk: (s: string) => Item[]) => {
      const a = mk('ABC')
      const dom = createDom(a)
      dom[0].marked = true
      const last = diffKeyed(a, mk('CAB'), dom).at(-1)!
      return last.dom.find(e => e.marked)!.text
    }
    expect(run(items)).toBe('A')
    expect(run(byIndex)).toBe('C')
  })
})
