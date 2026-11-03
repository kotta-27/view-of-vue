// 書かれた SFC を、ブラウザ内の本物のコンパイラで JavaScript に変換する。
// 実行は CodeExercise.vue が sandbox 付きの iframe で行う。

export interface Compiled {
  code: string
  css: string
}

export async function compileSfc(source: string): Promise<Compiled> {
  const { parse, compileScript } = await import('@vue/compiler-sfc')
  const { descriptor, errors } = parse(source, { filename: 'Exercise.vue' })
  if (errors.length) throw new Error(errors.map(e => e.message).join('\n'))
  if (!descriptor.scriptSetup) descriptor.scriptSetup = parse('<script setup></script>').descriptor.scriptSetup
  const script = compileScript(descriptor, { id: 'exercise', inlineTemplate: true })
  return { code: toRunnable(script.content), css: descriptor.styles.map(s => s.content).join('\n') }
}

/** ES モジュールの import と export を、iframe の Vue グローバルを使う形に直す */
export function toRunnable(code: string): string {
  const rewritten = code
    .replace(/import\s*\{([^}]*)\}\s*from\s*['"]vue['"];?/g, (_, names: string) => {
      const list = names
        .split(',')
        .map(n => n.trim())
        .filter(Boolean)
        .map(n => n.replace(/\s+as\s+/, ': '))
      return `const { ${list.join(', ')} } = Vue;`
    })
    .replace(/export\s+default/, 'const __sfc__ =')
  if (/^\s*import\s/m.test(rewritten)) throw new Error("Only imports from 'vue' are supported here")
  return rewritten
}

/** iframe の中身。Vue 本体とコードは起動後に postMessage で受け取る */
export const frameHtml = (dark: boolean) => `<!doctype html>
<html><head><meta charset="utf-8"><style id="user"></style><style>
body{margin:0;padding:12px;font:15px/1.6 system-ui,sans-serif;color:${dark ? '#e6ebf1' : '#1a2433'};background:${dark ? '#161f2b' : '#fff'}}
button{font:inherit;padding:2px 10px;margin:2px 4px 2px 0}input{font:inherit}
</style></head><body><div id="app"></div><script>
const send = m => parent.postMessage({ vov: true, ...m }, '*')
addEventListener('error', e => send({ type: 'error', message: e.message }))
addEventListener('unhandledrejection', e => send({ type: 'error', message: String(e.reason?.message ?? e.reason) }))
for (const level of ['log', 'warn', 'error']) {
  const original = console[level]
  console[level] = (...args) => { send({ type: 'log', level, text: args.map(String).join(' ') }); original(...args) }
}
// sandbox の中では focus() が activeElement に反映されないことがあるので、呼び出しを記録する
let lastFocused = null
const nativeFocus = HTMLElement.prototype.focus
HTMLElement.prototype.focus = function (...args) {
  lastFocused = this
  return nativeFocus.apply(this, args)
}
let app
function mount(code) {
  app?.unmount()
  document.querySelector('#app').innerHTML = ''
  const sfc = new Function('Vue', code + '\\nreturn __sfc__')(Vue)
  app = Vue.createApp(sfc)
  app.config.errorHandler = err => send({ type: 'error', message: err.message })
  app.mount('#app')
}
addEventListener('message', async e => {
  const { vue, code, css, check, locale } = e.data
  try {
    if (!window.Vue) (0, eval)(vue + ';window.Vue=Vue')
    document.querySelector('#user').textContent = css
    mount(code)
    await Vue.nextTick()
    if (!check) return send({ type: 'done' })
    const $ = s => document.querySelector(s)
    const text = s => ($(s)?.textContent ?? '').trim()
    const tick = () => Vue.nextTick()
    const wait = ms => new Promise(r => setTimeout(r, ms))
    const click = async s => {
      const el = $(s)
      if (!el) throw new Error('Not found: ' + s)
      el.click()
      await tick()
      await tick()
    }
    const assert = (ok, ja, en) => { if (!ok) throw new Error(locale === 'ja' ? ja : en) }
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
    const focused = () => lastFocused
    await new AsyncFunction('$', 'text', 'click', 'tick', 'wait', 'assert', 'focused', check)($, text, click, tick, wait, assert, focused)
    send({ type: 'passed' })
    mount(code)
  } catch (err) {
    send({ type: 'failed', message: err.message })
  }
})
send({ type: 'ready' })
</script></body></html>`
