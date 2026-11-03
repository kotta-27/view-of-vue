// runtime-core の patchKeyedChildren を、途中経過を記録しながら忠実に写したもの。
// 操作回数と結果の DOM 順は tests で本物の createRenderer と突き合わせている。

import { say } from './settings'

export interface Item {
  key: string | number
  text: string
}

export interface DomEl {
  id: number
  key: string | number
  text: string
  marked: boolean
}

export type Phase = 'start' | 'head' | 'tail' | 'mount' | 'unmount' | 'map' | 'scan' | 'lis' | 'place' | 'done'

export interface Ops {
  patch: number
  text: number
  mount: number
  unmount: number
  move: number
}

export interface DiffFrame {
  phase: Phase
  note: string
  i: number
  e1: number
  e2: number
  dom: DomEl[]
  touched: number | null
  ops: Ops
  doneOld: number[]
  doneNew: number[]
  source: number[] | null
  lis: number[] | null
  s2: number
}

/** runtime-core の getSequence と同じ。source 中の 0 は新規ノードを表す */
export function getSequence(arr: number[]): number[] {
  const p = arr.slice()
  const result = [0]
  let i: number, j: number, u: number, v: number, c: number
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    if (arrI !== 0) {
      j = result[result.length - 1]
      if (arr[j] < arrI) {
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      while (u < v) {
        c = (u + v) >> 1
        if (arr[result[c]] < arrI) u = c + 1
        else v = c
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) p[i] = result[u - 1]
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}

let nextElId = 1

export function createDom(items: Item[]): DomEl[] {
  return items.map(it => ({ id: nextElId++, key: it.key, text: it.text, marked: false }))
}

export function diffKeyed(c1: Item[], c2: Item[], initial: DomEl[]): DiffFrame[] {
  const frames: DiffFrame[] = []
  const dom = initial.map(el => ({ ...el }))
  const elOfOld = c1.map(it => dom.find(el => el.key === it.key)!)
  const elOfNew: (DomEl | undefined)[] = c2.map(() => undefined)
  const ops: Ops = { patch: 0, text: 0, mount: 0, unmount: 0, move: 0 }
  const doneOld = new Set<number>()
  const doneNew = new Set<number>()
  let i = 0
  const l2 = c2.length
  let e1 = c1.length - 1
  let e2 = l2 - 1
  let source: number[] | null = null
  let lis: number[] | null = null
  let s2 = 0

  const snap = (phase: Phase, note: string, touched: number | null = null) => {
    frames.push({
      phase,
      note,
      i,
      e1,
      e2,
      dom: dom.map(el => ({ ...el })),
      touched,
      ops: { ...ops },
      doneOld: [...doneOld],
      doneNew: [...doneNew],
      source: source && [...source],
      lis: lis && [...lis],
      s2,
    })
  }

  const patch = (oldIndex: number, newIndex: number) => {
    const el = elOfOld[oldIndex]
    elOfNew[newIndex] = el
    ops.patch++
    if (el.text !== c2[newIndex].text) {
      el.text = c2[newIndex].text
      ops.text++
    }
    doneOld.add(oldIndex)
    doneNew.add(newIndex)
    return el
  }

  const insertBefore = (el: DomEl, anchor: DomEl | undefined) => {
    const at = dom.indexOf(el)
    if (at >= 0) dom.splice(at, 1)
    const to = anchor ? dom.indexOf(anchor) : dom.length
    dom.splice(to, 0, el)
  }

  const mount = (newIndex: number, anchor: DomEl | undefined) => {
    const el: DomEl = {
      id: nextElId++,
      key: c2[newIndex].key,
      text: c2[newIndex].text,
      marked: false,
    }
    elOfNew[newIndex] = el
    insertBefore(el, anchor)
    ops.mount++
    doneNew.add(newIndex)
    return el
  }

  const unmount = (oldIndex: number) => {
    const el = elOfOld[oldIndex]
    dom.splice(dom.indexOf(el), 1)
    ops.unmount++
    doneOld.add(oldIndex)
  }

  snap('start', say('旧リストと新リストの比較を開始する', 'Start comparing the old and new lists'))

  while (i <= e1 && i <= e2) {
    if (c1[i].key !== c2[i].key) {
      snap('head', say(`先頭から ${i + 1} 番目で key が異なる。先頭側の照合を終える`, `Keys differ at position ${i + 1} from the head. Head matching ends`))
      break
    }
    const el = patch(i, i)
    i++
    snap('head', say(`先頭側で一致: ${c2[i - 1].key}。移動せず内容のみ patch する`, `Head match: ${c2[i - 1].key}. Patch contents without moving`), el.id)
  }

  while (i <= e1 && i <= e2) {
    if (c1[e1].key !== c2[e2].key) {
      snap('tail', say('末尾側でも key が異なる。残りが変更区間である', 'Keys differ at the tail too. The rest is the changed range'))
      break
    }
    const el = patch(e1, e2)
    const key = c2[e2].key
    e1--
    e2--
    snap('tail', say(`末尾側で一致: ${key}。移動せず内容のみ patch する`, `Tail match: ${key}. Patch contents without moving`), el.id)
  }

  if (i > e1) {
    if (i <= e2) {
      const nextPos = e2 + 1
      const anchor = nextPos < l2 ? elOfNew[nextPos] : undefined
      while (i <= e2) {
        const el = mount(i, anchor)
        const key = c2[i].key
        i++
        snap('mount', say(`旧リストを走査し終えた。${key} を新規に作成して挿入する`, `Old list exhausted. Create ${key} and insert it`), el.id)
      }
    }
  } else if (i > e2) {
    while (i <= e1) {
      const key = c1[i].key
      unmount(i)
      i++
      snap('unmount', say(`新リストを走査し終えた。${key} を削除する`, `New list exhausted. Remove ${key}`))
    }
  } else {
    const s1 = i
    s2 = i
    const keyToNewIndexMap = new Map<string | number, number>()
    for (i = s2; i <= e2; i++) keyToNewIndexMap.set(c2[i].key, i)
    let patched = 0
    const toBePatched = e2 - s2 + 1
    let moved = false
    let maxNewIndexSoFar = 0
    const newIndexToOldIndexMap = Array.from({ length: toBePatched }, () => 0)
    source = newIndexToOldIndexMap
    i = s1
    snap('map', say(`変更区間の ${toBePatched} 件について、key から新しい位置を引く表を作る`, `Build a key-to-position table for the ${toBePatched} changed items`))

    for (i = s1; i <= e1; i++) {
      const key = c1[i].key
      if (patched >= toBePatched) {
        unmount(i)
        snap('scan', say(`${key}: 新リスト側はすべて対応済みのため削除する`, `${key}: every new item is matched, so remove it`))
        continue
      }
      const newIndex = keyToNewIndexMap.get(key)
      if (newIndex === undefined) {
        unmount(i)
        snap('scan', say(`${key}: 新リストに存在しないため削除する`, `${key}: not in the new list, so remove it`))
      } else {
        newIndexToOldIndexMap[newIndex - s2] = i + 1
        const wentBack = newIndex < maxNewIndexSoFar
        if (wentBack) moved = true
        else maxNewIndexSoFar = newIndex
        const el = patch(i, newIndex)
        patched++
        snap(
          'scan',
          wentBack
            ? say(`${key}: 新しい位置が直前までの最大値より小さい。移動が必要である`, `${key}: new position is below the maximum so far. A move is needed`)
            : say(`${key}: 新しい位置は ${newIndex}。順序は保たれている`, `${key}: new position ${newIndex}. Order is preserved`),
          el.id,
        )
      }
    }

    const seq = moved ? getSequence(newIndexToOldIndexMap) : []
    if (moved) {
      lis = seq
      snap('lis', say(`最長増加部分列を求める。ここに含まれる ${seq.length} 件は移動しない`, `Find the longest increasing subsequence. Its ${seq.length} items stay put`))
    }
    let j = seq.length - 1
    for (i = toBePatched - 1; i >= 0; i--) {
      const nextIndex = s2 + i
      const anchor = nextIndex + 1 < l2 ? elOfNew[nextIndex + 1] : undefined
      const key = c2[nextIndex].key
      if (newIndexToOldIndexMap[i] === 0) {
        const el = mount(nextIndex, anchor)
        snap('place', say(`${key}: 旧リストに存在しないため作成して挿入する`, `${key}: not in the old list, so create and insert it`), el.id)
      } else if (moved) {
        if (j < 0 || i !== seq[j]) {
          const el = elOfNew[nextIndex]!
          insertBefore(el, anchor)
          ops.move++
          snap('place', say(`${key}: 部分列に含まれないため移動する`, `${key}: outside the subsequence, so move it`), el.id)
        } else {
          j--
          snap('place', say(`${key}: 部分列に含まれるため移動しない`, `${key}: in the subsequence, so it stays`), elOfNew[nextIndex]!.id)
        }
      }
    }
  }

  snap('done', say(`完了: 移動 ${ops.move}、作成 ${ops.mount}、削除 ${ops.unmount}、テキスト更新 ${ops.text}`, `Done: ${ops.move} moved, ${ops.mount} created, ${ops.unmount} removed, ${ops.text} text updates`))
  return frames
}
