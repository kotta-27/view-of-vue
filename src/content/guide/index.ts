import type { ChapterContent } from '../types'

type Loader = () => Promise<{ default: ChapterContent }>

/** 章番号から本文を読み込む。入門の部と第 13 章以降はこの形式で書く */
export const guideModules: Record<string, Loader> = {
  A: () => import('./a'),
  B: () => import('./b'),
  C: () => import('./c'),
  D: () => import('./d'),
  E: () => import('./e'),
  F: () => import('./f'),
  G: () => import('./g'),
  13: () => import('./ch13'),
  14: () => import('./ch14'),
  15: () => import('./ch15'),
  16: () => import('./ch16'),
  17: () => import('./ch17'),
  18: () => import('./ch18'),
  19: () => import('./ch19'),
}
