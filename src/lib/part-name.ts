import { pick } from './settings'
import type { Part } from './chapters'

/** 入門の部には番号を付けない */
export const partName = (part: Part, t: { partLabel(n: number): string }) =>
  part.no === 0 ? pick(part.title) : `${t.partLabel(part.no)} ${pick(part.title)}`
