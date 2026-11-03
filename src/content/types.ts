export interface Term {
  term: string
  desc: string
}

export interface GuideSection {
  title: string
  /** 信頼できる自前の HTML */
  body: string
  /** 編集して実行できる SFC */
  run?: string
  /** 表示だけのコード。ブラウザ内で実行できない例に使う */
  show?: string
}

export interface ChapterText {
  /** 章の導入。本文は信頼できる自前の HTML */
  lead: string
  steps: string[]
  impl: string[]
  method: string
  sections?: GuideSection[]
  easy: { intro: string; terms: Term[] }
  exercise: { title: string; task: string; todo: string }
  ui: Record<string, string>
}

export interface Exercise {
  /** TODO は言語ごとの exercise.todo に置き換える */
  starter: string
  solution: string
  /** iframe の中で実行する判定。$ click text tick wait assert focused を使える */
  check: string
}

export interface ChapterContent {
  ja: ChapterText
  en: ChapterText
  exercise: Exercise
}
