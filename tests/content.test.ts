// 章の本文の整合を確かめる
import { describe, expect, it } from 'vitest'
import { ABBREVIATIONS } from '../src/content/abbreviations'
import { loadAll } from '../src/content/all'
import { home } from '../src/content/home'
import { pitfalls } from '../src/content/pitfalls'
import { chapterBy, CHAPTERS, NEEDS } from '../src/lib/chapters'
import { compileSfc } from '../src/lib/exercise-run'
import { highlightLines } from '../src/lib/highlight'

const JAPANESE = /[\u3040-\u30ff\u4e00-\u9fff]/

describe('全章', () => {
  it('26 章ある', () => expect(CHAPTERS).toHaveLength(26))

  it('英語版に日本語が混ざらず、日英の構成が揃う', async () => {
    for (const { chapter, content } of await loadAll()) {
      const { ui, ...text } = content.en
      expect(JSON.stringify(text), `${chapter.no}`).not.toMatch(JAPANESE)
      expect(JSON.stringify(ui), `${chapter.no}`).not.toMatch(JAPANESE)
      expect(content.en.steps.length, `${chapter.no}`).toBe(content.ja.steps.length)
      expect(content.en.impl.length, `${chapter.no}`).toBe(content.ja.impl.length)
      expect(content.en.sections?.length, `${chapter.no}`).toBe(content.ja.sections?.length)
      expect(content.en.easy.terms.length, `${chapter.no}`).toBe(content.ja.easy.terms.length)
      expect(Object.keys(ui).sort(), `${chapter.no}`).toEqual(Object.keys(content.ja.ui).sort())
    }
  })

  it('演習の問題と解答、実行できる例がコンパイルできる', async () => {
    for (const { chapter, content } of await loadAll()) {
      expect(content.exercise.starter, `${chapter.no}`).toContain('TODO')
      await compileSfc(content.exercise.starter.replace('TODO', 'todo'))
      await compileSfc(content.exercise.solution)
      for (const s of content.ja.sections ?? []) if (s.run) await compileSfc(s.run)
    }
  })

  it('全章に平易な解説と用語がある', async () => {
    for (const { chapter, content } of await loadAll()) {
      expect(content.ja.easy.terms.length, `${chapter.no}`).toBeGreaterThanOrEqual(3)
    }
  })
})

describe('よくある間違い', () => {
  it('日英が同じ章を指し、章が実在する', () => {
    expect(pitfalls.en.map(p => p.chapter)).toEqual(pitfalls.ja.map(p => p.chapter))
    for (const p of pitfalls.ja) expect(chapterBy(p.chapter), String(p.chapter)).toBeTruthy()
  })
})

const plain = (lines: string[]) =>
  lines
    .join('\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

describe('色分け', () => {
  it('全章のコードで、文字が 1 文字も変わらない', async () => {
    let n = 0
    for (const { content } of await loadAll()) {
      const codes = [
        content.exercise.starter,
        content.exercise.solution,
        ...(content.ja.sections ?? []).flatMap(s => [s.run, s.show]),
      ].filter((c): c is string => !!c)
      for (const code of codes) {
        expect(plain(highlightLines(code))).toBe(code)
        n++
      }
    }
    expect(n).toBeGreaterThan(70)
  })

  it('書きかけの壊れたコードでも文字を失わない', () => {
    for (const code of ['<div', '<p :a="', '{{ x', '<script>const a = `', '<!-- x', "'open", '</', '<style>a { color', '<a b=\'c', '&<>']) {
      expect(plain(highlightLines(code))).toBe(code)
    }
  })

  it('入力を HTML として解釈させない', () => {
    const html = highlightLines('<img src=x onerror="alert(1)">').join('')
    expect(html).not.toMatch(/<img/)
    expect(highlightLines('&lt;').join('')).toContain('&amp;lt;')
  })

  it('SFC の各部分を色分けする', () => {
    const html = highlightLines('<script setup>\nconst a = ref(0)\n</script>\n<template>\n  <p :id="a" @click="f" class="b">{{ a }}</p>\n</template>\n<style>\np { color: red; }\n</style>').join('\n')
    for (const c of ['t-tag', 't-k', 't-f', 't-n', 't-dir', 't-attr', 't-must']) expect(html, c).toContain(c)
  })
})

describe('読む順序', () => {
  // 左の書き方は、右の章で説明するまで入門の部に出してはいけない
  const INTRODUCED: [RegExp, string][] = [
    [/v-bind|v-on\b/, 'B'],
    [/\bcomputed\b|\bwatch\b|\breactive\b/, 'C'],
    [/v-if|v-else|v-show|v-for|:key/, 'D'],
    [/:class|:style|scoped/, 'E'],
    [/v-model|\.prevent/, 'F'],
    [/defineProps|defineEmits|defineModel|<slot|\bprops\b/, 'G'],
  ]
  const ORDER = 'ABCDEFG'

  it('入門の章は、説明前の書き方を使わない', async () => {
    const all = await loadAll()
    for (const { chapter, content } of all) {
      if (typeof chapter.no !== 'string') continue
      for (const lang of ['ja', 'en'] as const) {
        const c = content[lang]
        const body = [c.lead, c.easy.intro, ...(c.sections ?? []).flatMap(s => [s.body, s.run, s.show]), c.exercise.task]
          .filter(Boolean)
          .join('\n')
        const code = `${body}\n${content.exercise.starter}\n${content.exercise.solution}`
        for (const [pattern, from] of INTRODUCED) {
          if (ORDER.indexOf(chapter.no) < ORDER.indexOf(from)) {
            expect(code, `${lang} ${chapter.no} が ${pattern} を第 ${from} 章より前に使っている`).not.toMatch(pattern)
          }
        }
      }
    }
  })

  it('前提の章は、読む順で先にある', () => {
    const index = (no: number | string) => CHAPTERS.indexOf(chapterBy(no))
    for (const [no, needs] of Object.entries(NEEDS)) {
      const self = Number.isNaN(Number(no)) ? no : Number(no)
      for (const n of needs) expect(index(n), `${no} -> ${n}`).toBeLessThan(index(self))
    }
  })
})

describe('略語', () => {
  // 誰でも知っている前提の略語は用語集だけに載せる
  const BASIC = ['CSS', 'HTML', 'URL']

  it('読む順で最初に出るページに、正式名称がある', async () => {
    const all = await loadAll()
    for (const lang of ['ja', 'en'] as const) {
      const pages: [string, string][] = [
        ['home', JSON.stringify(home[lang])],
        ...all.map(({ chapter, content }): [string, string] => [String(chapter.no), JSON.stringify(content[lang])]),
      ]
      for (const { abbr, full } of ABBREVIATIONS) {
        if (BASIC.includes(abbr)) continue
        const used = new RegExp(`(?<![A-Za-z-])${abbr}(?![A-Za-z])`)
        const first = pages.find(([, text]) => used.test(text))
        expect(first, abbr).toBeTruthy()
        expect(first![1], `${lang}: ${abbr} が ${first![0]} に正式名称なしで出る`).toContain(full)
      }
    }
  })

  it('略語は重複せず、アルファベット順に並ぶ', () => {
    const names = ABBREVIATIONS.map(a => a.abbr)
    expect(names).toEqual([...new Set(names)].sort())
  })
})
