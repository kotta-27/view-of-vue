// Vue の SFC、JavaScript、CSS を色分けする小さな字句解析器。
// 入力欄の下に重ねるので、出力の文字は入力と 1 文字も変えない。

type Token = [cls: string, text: string]

const KEYWORDS = new Set(
  'const let var function return if else for while of in new import from export default as async await class extends try catch throw typeof interface type true false null undefined this'.split(
    ' ',
  ),
)

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function js(code: string, out: Token[]) {
  const re = /(\/\*[\s\S]*?(?:\*\/|$)|\/\/[^\n]*)|('(?:[^'\\\n]|\\.)*'?|"(?:[^"\\\n]|\\.)*"?|`(?:[^`\\]|\\[\s\S])*`?)|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(\s*\()?/g
  let last = 0
  for (let m = re.exec(code); m; m = re.exec(code)) {
    if (m.index > last) out.push(['', code.slice(last, m.index)])
    const [all, comment, str, num, word, call] = m
    if (comment) out.push(['t-c', all])
    else if (str) out.push(['t-s', all])
    else if (num) out.push(['t-n', all])
    else if (KEYWORDS.has(word)) {
      out.push(['t-k', word])
      if (call) out.push(['', call])
    } else if (call) {
      out.push(['t-f', word])
      out.push(['', call])
    } else out.push(['', word])
    last = m.index + all.length
  }
  if (last < code.length) out.push(['', code.slice(last)])
}

function css(code: string, out: Token[]) {
  const re = /(\/\*[\s\S]*?(?:\*\/|$))|([\w-]+)(?=\s*:[^:])|('[^'\n]*'?|"[^"\n]*"?)|(#[0-9a-fA-F]{3,8}\b|-?\d*\.?\d+(?:px|em|rem|s|ms|%)?)/g
  let last = 0
  for (let m = re.exec(code); m; m = re.exec(code)) {
    if (m.index > last) out.push(['', code.slice(last, m.index)])
    const [all, comment, prop, str] = m
    out.push([comment ? 't-c' : prop ? 't-attr' : str ? 't-s' : 't-n', all])
    last = m.index + all.length
  }
  if (last < code.length) out.push(['', code.slice(last)])
}

function text(code: string, out: Token[]) {
  const re = /\{\{[\s\S]*?(?:\}\}|$)/g
  let last = 0
  for (let m = re.exec(code); m; m = re.exec(code)) {
    if (m.index > last) out.push(['', code.slice(last, m.index)])
    const closed = m[0].endsWith('}}')
    out.push(['t-must', '{{'])
    js(m[0].slice(2, closed ? -2 : undefined), out)
    if (closed) out.push(['t-must', '}}'])
    last = m.index + m[0].length
  }
  if (last < code.length) out.push(['', code.slice(last)])
}

/** 開始タグの中身。属性名を directive とそれ以外に分ける */
function attrs(code: string, out: Token[]) {
  const re = /([^\s=<>"'/]+)|("[^"]*"?|'[^']*'?)/g
  let last = 0
  for (let m = re.exec(code); m; m = re.exec(code)) {
    if (m.index > last) out.push(['', code.slice(last, m.index)])
    const [all, name] = m
    if (name) out.push([/^(v-|:|@|#)/.test(name) ? 't-dir' : 't-attr', name])
    else out.push(['t-s', all])
    last = m.index + all.length
  }
  if (last < code.length) out.push(['', code.slice(last)])
}

function html(code: string, out: Token[]) {
  const re = /<!--[\s\S]*?(?:-->|$)|<\/?([A-Za-z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)(>?)/g
  let last = 0
  for (let m = re.exec(code); m; ) {
    if (m.index > last) text(code.slice(last, m.index), out)
    const [all, name, rest, end] = m
    last = m.index + all.length
    if (!name) {
      out.push(['t-c', all])
    } else {
      const closing = all.startsWith('</')
      out.push(['t-p', closing ? '</' : '<'])
      out.push(['t-tag', name])
      attrs(rest, out)
      if (end) out.push(['t-p', end])
      if (!closing && end && !rest.endsWith('/') && /^(script|style)$/.test(name)) {
        const close = code.indexOf(`</${name}`, last)
        const stop = close < 0 ? code.length : close
        const body = code.slice(last, stop)
        if (name === 'script') js(body, out)
        else css(body, out)
        last = stop
      }
    }
    re.lastIndex = last
    m = re.exec(code)
  }
  if (last < code.length) text(code.slice(last), out)
}

function shell(code: string, out: Token[]) {
  for (const line of code.split(/(\n)/)) {
    const at = line.indexOf('#')
    if (at < 0) out.push(['', line])
    else {
      out.push(['', line.slice(0, at)])
      out.push(['t-c', line.slice(at)])
    }
  }
}

function tokens(code: string): Token[] {
  const out: Token[] = []
  if (/^\s*</.test(code)) html(code, out)
  else if (/^(npm|npx|cd) /.test(code)) shell(code, out)
  else js(code, out)
  return out
}

/** 行ごとの HTML を返す。複数行にまたがる字句は行の境で分ける */
export function highlightLines(code: string): string[] {
  const lines: string[] = ['']
  for (const [cls, value] of tokens(code)) {
    value.split('\n').forEach((part, i) => {
      if (i > 0) lines.push('')
      if (!part) return
      const safe = escapeHtml(part)
      lines[lines.length - 1] += cls ? `<i class="${cls}">${safe}</i>` : safe
    })
  }
  return lines
}
