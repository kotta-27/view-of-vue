import { say } from './settings'
import type { Trace } from './mini'

const show = (v: unknown) => (typeof v === 'string' ? `'${v}'` : String(v))

export function explain(t: Trace): string {
  switch (t.kind) {
    case 'begin':
    case 'local':
      return t.note
    case 'run':
      return say(`${t.effect} を実行する`, `Run ${t.effect}`)
    case 'cleanup':
      return say(`${t.effect} の依存をすべて解除する。再実行で読み直すため`, `Clear all dependencies of ${t.effect}. The run reads them again`)
    case 'get':
      return t.effect
        ? say(`${t.effect} が ${t.dep} を読む`, `${t.effect} reads ${t.dep}`)
        : say(`${t.dep} を読む。実行中の effect がないため、依存は登録されない`, `Read ${t.dep}. No effect is running, so no dependency is registered`)
    case 'track':
      return say(`${t.dep} の購読者に ${t.effect} を登録する`, `Register ${t.effect} as a subscriber of ${t.dep}`)
    case 'set':
      return say(`${t.dep} を ${show(t.from)} から ${show(t.to)} に更新する`, `Update ${t.dep} from ${show(t.from)} to ${show(t.to)}`)
    case 'skip':
      return say(`${t.dep} は同じ値のため、通知しない`, `${t.dep} has the same value, so nothing is notified`)
    case 'trigger':
      return t.effects.length
        ? say(`${t.dep} の購読者 ${t.effects.join('、')} に通知する`, `Notify the subscribers of ${t.dep}: ${t.effects.join(', ')}`)
        : say(`${t.dep} に購読者はいない`, `${t.dep} has no subscribers`)
    case 'done':
      return say(`${t.effect} の結果: ${t.output}`, `Result of ${t.effect}: ${t.output}`)
  }
}
