import { ABBREVIATIONS } from '../content/abbreviations'
import { loadAll } from '../content/all'
import { pitfalls } from '../content/pitfalls'
import { pick } from './settings'

export interface Hit {
  path: string
  title: string
  snippet: string
}

interface Doc {
  path: string
  title: string
  text: string
}

const strip = (html: string) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()

const cache = new Map<string, Promise<Doc[]>>()

function build(key: string): Promise<Doc[]> {
  if (!cache.has(key)) {
    cache.set(
      key,
      loadAll().then(all => {
        const docs: Doc[] = all.map(({ chapter, content }) => {
          const c = pick(content)
          const parts = [
            pick(chapter.summary),
            c.lead,
            ...c.steps,
            ...c.impl,
            c.easy.intro,
            ...c.easy.terms.flatMap(t => [t.term, t.desc]),
            ...(c.sections ?? []).flatMap(s => [s.title, s.body]),
          ]
          return { path: chapter.path, title: pick(chapter.title), text: strip(parts.join(' ')) }
        })
        for (const a of ABBREVIATIONS) {
          docs.push({ path: '/glossary', title: `${a.abbr} (${a.full})`, text: pick(a) })
        }
        for (const p of pick(pitfalls)) {
          docs.push({ path: '/pitfalls', title: p.title, text: strip(`${p.cause} ${p.fix}`) })
        }
        return docs
      }),
    )
  }
  return cache.get(key)!
}

export async function search(query: string, key: string): Promise<Hit[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const docs = await build(key)
  const hits: (Hit & { score: number })[] = []
  for (const d of docs) {
    const inTitle = d.title.toLowerCase().includes(q)
    const at = d.text.toLowerCase().indexOf(q)
    if (!inTitle && at < 0) continue
    const from = Math.max(0, at - 24)
    const snippet = at < 0 ? d.text.slice(0, 70) : `${from > 0 ? '…' : ''}${d.text.slice(from, at + q.length + 46)}…`
    hits.push({ path: d.path, title: d.title, snippet, score: inTitle ? 0 : 1 })
  }
  return hits.sort((a, b) => a.score - b.score).slice(0, 8)
}
