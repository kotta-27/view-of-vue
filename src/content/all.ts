import { CHAPTERS } from '../lib/chapters'
import { guideModules } from './guide'
import type { ChapterContent } from './types'

const core = import.meta.glob<{ default: ChapterContent }>('./ch*.ts')

export function loadChapter(no: number | string) {
  if (typeof no === 'number' && no <= 12) {
    return core[`./ch${String(no).padStart(2, '0')}.ts`]().then(m => m.default)
  }
  return guideModules[String(no)]().then(m => m.default)
}

export const loadAll = () =>
  Promise.all(CHAPTERS.map(async chapter => ({ chapter, content: await loadChapter(chapter.no) })))
