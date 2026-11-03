import { launch, sleep } from './cdp.mjs'
// 開発サーバー（npm run dev）を起動してから実行する
const BASE = process.env.E2E_BASE ?? 'http://localhost:5310/'
const OUT = process.env.E2E_SHOTS
const INTRO = ['start', 'template-syntax', 'reactivity-basics', 'conditions-lists', 'class-style', 'events-forms', 'component-basics']
const PRACTICE = ['typescript', 'router', 'pinia', 'built-ins', 'extending', 'testing-performance', 'ssr']
const ROUTES = ['', ...INTRO, 'ref-effect', 'reactive', 'computed', 'scheduler', 'compiler', 'keyed-diff', 'lifecycle', 'props-emits', 'provide-inject', 'slots', 'watch', 'composables', ...PRACTICE]
const TOOLS = ['playground', 'glossary', 'cheatsheet', 'pitfalls']
const results = []
const check = (name, ok, detail = '') => results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`)

const clickText = (text) => `[...document.querySelectorAll('button')].find(b => b.textContent.trim() === ${JSON.stringify(text)}).click()`
const texts = (sel) => `[...document.querySelectorAll(${JSON.stringify(sel)})].map(e => e.textContent.trim())`
const speedUp = `document.querySelector('[aria-label="再生速度を変える"]').click()`

// 既定の言語はブラウザに従うので、日本語とライト表示に固定して始める
const prep = async (b) => {
  await b.goto(BASE)
  await b.evaluate(`localStorage.setItem('vov-locale', 'ja'); localStorage.setItem('vov-theme', 'light'); localStorage.setItem('vov-easy', '0'); location.reload()`)
  await sleep(1500)
}

for (const [w, h, tag] of [[1280, 900, 'desktop'], [390, 844, 'mobile']]) {
  const b = await launch(w, h)
  await prep(b)
  for (const r of [...ROUTES, ...TOOLS]) {
    await b.goto(`${BASE}#/${r}`)
    await b.waitFor(`document.querySelector('h1')`)
    await sleep(900)
    const over = await b.evaluate(`return document.documentElement.scrollWidth - document.documentElement.clientWidth`)
    check(`${tag} /${r} 横にはみ出さない`, over <= 0, `${over}px`)
    if (OUT) await b.shot(`${OUT}/${tag}-${r || 'home'}.png`, true)
  }
  check(`${tag} console が静か`, b.problems.length === 0, b.problems.slice(0, 3).join(' / '))
  b.close()
}

const b = await launch()
await prep(b)

// トップ: Vue とは の実行例
await b.goto(`${BASE}#/`)
check('トップ ロゴに代替テキスト', (await b.evaluate(`return document.querySelector('h1 img').alt`)) === 'View of Vue')
check('トップ ロゴを読み込む', await b.waitFor(`document.querySelector('h1 img').naturalWidth > 0`))
// 水面より下の左半分は空で、そこにインクがあればロゴが逆さになっている
const inkAt = (top) => `const i = document.querySelector('h1 img'); const c = document.createElement('canvas'); c.width = 400; c.height = 200; const g = c.getContext('2d'); g.drawImage(i, 0, 0, 400, 200); return [...g.getImageData(0, ${top}, 180, 90).data].filter((v, n) => n % 4 === 3 && v > 128).length`
check('トップ ロゴの向き', (await b.evaluate(inkAt(10))) > 1000 && (await b.evaluate(inkAt(110))) === 0, `${await b.evaluate(inkAt(10))} / ${await b.evaluate(inkAt(110))}`)
check('トップ 略語の正式名称', await b.evaluate(`const t = document.querySelector('#about-vue').innerText; return ['Single-File Component', 'Single-Page Application', 'Server-Side Rendering', 'Static Site Generation', 'Document Object Model', 'Application Programming Interface'].every(f => t.includes(f))`))
check('トップ Vue とは', (await b.evaluate(`return document.querySelector('#about-vue h2').textContent`)) === 'Vue とは')
check('トップ 例のソースが実物', await b.evaluate(`return document.querySelector('.example .code').textContent.includes('const count = ref(0)')`))
await b.evaluate(`document.querySelector('.example-run button').click(); document.querySelector('.example-run button').click()`)
await sleep(100)
check('トップ 例が動く', (await b.evaluate(`return document.querySelector('.example-run button').textContent.trim()`)) === 'Clicks: 2')

// 第 1 章: 依存が登録され、分岐で更新される
await b.goto(`${BASE}#/ref-effect`)
check('1 章 最初は依存がない', (await b.evaluate(`return document.querySelectorAll('.edge').length`)) === 0)
await b.evaluate(speedUp)
await b.evaluate(clickText('effect を実行する'))
check('1 章 依存が 3 本', await b.waitFor(`document.querySelectorAll('.edge').length === 3 && [...document.querySelectorAll('.btn-mini')].some(x => x.textContent.trim() === '先頭から')`, 15000))
await b.evaluate(clickText('sale を反転'))
check('1 章 反転で 4 本', await b.waitFor(`document.querySelectorAll('.edge').length === 4 && [...document.querySelectorAll('.btn-mini')].some(x => x.textContent.trim() === '先頭から')`, 15000))
check('1 章 badge の値', (await b.evaluate(`return ${texts('.node-value')}.includes('Sale 100')`)) === true)

// 第 2 章: キーごとに通知先が分かれる
await b.goto(`${BASE}#/reactive`)
check('2 章 引き出しが出る', await b.waitFor(`document.querySelectorAll('.dep-row').length === 3`))
await b.evaluate(clickText('user.city を追加'))
check('2 章 新規キーで C が 3 個に', await b.waitFor(`document.querySelector('.effect-list li:nth-child(3) span').textContent === '3 個'`, 15000))
check('2 章 city の引き出しが増える', (await b.evaluate(`return document.querySelectorAll('.dep-row').length`)) === 4)
await b.evaluate(clickText('分割代入して age++'))
await sleep(500)
check('2 章 分割代入は何も起こさない', (await b.evaluate(`return ${texts('.effect-list li:nth-child(2) span')}[0]`)) === '20')

// 第 3 章: 本物の computed の回数
await b.goto(`${BASE}#/computed`)
const meter = `return [...document.querySelectorAll('.meters dd')].map(e => +e.textContent)`
for (let i = 0; i < 5; i++) await b.evaluate(clickText('isBig.value を読む'))
await sleep(100)
check('3 章 五回読んで getter 一回', JSON.stringify(await b.evaluate(meter)) === '[5,1,5,0]', JSON.stringify(await b.evaluate(meter)))
await b.evaluate(clickText('count + 1'))
await sleep(100)
check('3 章 変えても未計算のまま', JSON.stringify(await b.evaluate(meter)) === '[5,1,5,0]')
check('3 章 未計算の表示', (await b.evaluate(`return document.querySelector('.df-state').textContent`)) === '未計算')
await b.evaluate(clickText('購読を開始'))
await sleep(100)
await b.evaluate(clickText('count + 1'))
await sleep(100)
check('3 章 結果同じなら購読者は止まる', JSON.stringify(await b.evaluate(meter)) === '[5,3,5,1]', JSON.stringify(await b.evaluate(meter)))
for (let i = 0; i < 2; i++) { await b.evaluate(clickText('count + 1')); await sleep(60) }
check('3 章 5 で購読者に届く', JSON.stringify(await b.evaluate(meter)) === '[5,5,5,2]', JSON.stringify(await b.evaluate(meter)))

// 第 4 章: 本物の実行順
await b.goto(`${BASE}#/scheduler`)
await b.evaluate(speedUp)
await b.evaluate(clickText('同期的に 3 回更新'))
await b.waitFor(`[...document.querySelectorAll('.btn-mini')].some(x => x.textContent.trim() === '先頭から')`, 20000)
const lanes = `return [...document.querySelectorAll('.runlog li')].map(l => l.querySelector('span').textContent)`
check('4 章 pre → 描画 → post → tick', (await b.evaluate(lanes)).join(' ') === '同期 同期 同期 同期 同期 同期 — pre 描画 post tick', (await b.evaluate(lanes)).join(' '))
check('4 章 描画は一回', (await b.evaluate(`return document.querySelector('.meters .is-key dd').textContent`)) === '1')
await b.evaluate(clickText('子を先に更新'))
await b.waitFor(`document.querySelector('.runlog li:last-child.lane-tick')`, 20000)
const order = (await b.evaluate(`return ${texts('.runlog .lane-render')}`)).join(' ')
check('4 章 親が先に描画', order.indexOf('Parent') < order.indexOf('Child') && order.includes('Child'), order)
await b.evaluate(clickText('nextTick を挟む'))
await b.waitFor(`document.querySelectorAll('.runlog .lane-render').length === 2 && document.querySelector('.runlog li:last-child.lane-tick')`, 20000)
check('4 章 flush が 2 回', (await b.evaluate(`return document.querySelectorAll('.meters dd')[2].textContent`)) === '2')

// 第 5 章: ブラウザ内の本物のコンパイラ
await b.goto(`${BASE}#/compiler`)
check('5 章 コンパイル結果が出る', await b.waitFor(`document.querySelector('.tpl-code').textContent.includes('_cache[')`))
await b.evaluate(`const t = document.querySelector('#tpl'); t.value = '<p :id="a">{{ b }}</p>'; t.dispatchEvent(new Event('input'))`)
check('5 章 入力に追従', await b.waitFor(`[...document.querySelectorAll('.tflag')].some(e => e.textContent.includes('TEXT | PROPS'))`, 3000))
await b.evaluate(`const t = document.querySelector('#tpl'); t.value = '<div>'; t.dispatchEvent(new Event('input'))`)
check('5 章 文法エラーを表示', await b.waitFor(`document.querySelector('.errors')`, 3000))

// 第 6 章: key の違い
await b.goto(`${BASE}#/keyed-diff`)
await b.evaluate(speedUp)
await b.evaluate(clickText('末尾を先頭へ移動'))
await b.waitFor(`[...document.querySelectorAll('.btn-mini')].some(x => x.textContent.trim() === '先頭から')`, 30000)
const domRow = `return [...document.querySelectorAll('.row.is-dom .tile')].map(e => e.textContent.trim()).join('')`
check('6 章 DOM が新しい順', (await b.evaluate(domRow)) === 'GABCDEF', await b.evaluate(domRow))
check('6 章 移動は一回', (await b.evaluate(`return document.querySelector('.meters .is-key dd').textContent`)) === '1')
await b.evaluate(`document.querySelector('.row.is-dom .tile').click()`)
await sleep(100)
await b.evaluate(`[...document.querySelectorAll('.seg-btn')][1].click()`)
await sleep(100)
await b.evaluate(clickText('末尾を先頭へ移動'))
await b.waitFor(`[...document.querySelectorAll('.btn-mini')].some(x => x.textContent.trim() === '先頭から')`, 30000)
check('6 章 index key は移動なし', (await b.evaluate(`return document.querySelector('.meters .is-key dd').textContent`)) === '0')
check('6 章 印は位置に残る', (await b.evaluate(`return document.querySelector('.tile.is-marked').textContent.trim()`)) === 'F')
check('6 章 警告が出る', await b.evaluate(`return !!document.querySelector('.warn')`))
// 第 7 章: 親子のフックの順序
const hookLog = `return [...document.querySelectorAll('.runlog li')].map(l => l.querySelector('span').textContent + ':' + l.textContent.slice(l.querySelector('span').textContent.length).split(' / ')[0])`
await b.goto(`${BASE}#/lifecycle`)
await b.waitFor(`document.querySelectorAll('.runlog li').length === 6`)
check('7 章 マウント順', (await b.evaluate(hookLog)).join(' ') === 'Parent:setup Parent:onBeforeMount Child:setup Child:onBeforeMount Child:onMounted Parent:onMounted', (await b.evaluate(hookLog)).join(' '))
check('7 章 onMounted で DOM あり', (await b.evaluate(`return document.querySelectorAll('.runlog li')[4].textContent.includes('DOM:')`)) && (await b.evaluate(`return document.querySelectorAll('.runlog li')[3].textContent.includes('DOM なし')`)))
await b.evaluate(clickText('親の状態を更新'))
await b.waitFor(`document.querySelectorAll('.runlog li').length === 4`)
check('7 章 更新順', (await b.evaluate(hookLog)).join(' ') === 'Parent:onBeforeUpdate Child:onBeforeUpdate Child:onUpdated Parent:onUpdated', (await b.evaluate(hookLog)).join(' '))
await b.evaluate(clickText('Update child state'))
await b.waitFor(`document.querySelectorAll('.runlog li').length === 6`)
check('7 章 子だけの更新', (await b.evaluate(hookLog)).slice(4).join(' ') === 'Child:onBeforeUpdate Child:onUpdated', (await b.evaluate(hookLog)).slice(4).join(' '))
await b.evaluate(clickText('アンマウント'))
await b.waitFor(`document.querySelectorAll('.runlog li').length === 4`)
check('7 章 アンマウント順', (await b.evaluate(hookLog)).join(' ') === 'Parent:onBeforeUnmount Child:onBeforeUnmount Child:onUnmounted Parent:onUnmounted', (await b.evaluate(hookLog)).join(' '))

// 第 8 章: 再描画の範囲
await b.goto(`${BASE}#/props-emits`)
await b.waitFor(`document.querySelector('.live-parent')`)
await b.evaluate(clickText('親の状態を更新'))
await sleep(200)
check('8 章 C だけ再描画', JSON.stringify(await b.evaluate(meter)) === '[1,0,0,1]', JSON.stringify(await b.evaluate(meter)))
await b.evaluate(`document.querySelector('.live-child .btn').click()`)
await sleep(200)
check('8 章 emit で A が更新', JSON.stringify(await b.evaluate(meter)) === '[2,1,0,2]', JSON.stringify(await b.evaluate(meter)))
check('8 章 親の状態が表示に反映', (await b.evaluate(`return document.querySelector('.live-child').textContent`)).includes('A: 1'))

// 第 9 章: provides の連鎖
await b.goto(`${BASE}#/provide-inject`)
await b.waitFor(`document.querySelectorAll('.chain li').length`)
const leaf = `return [...document.querySelectorAll('.live-child')].at(-1).textContent`
const chainRows = `return [...document.querySelectorAll('.chain li')].map(l => l.textContent.trim())`
check('9 章 既定は Root が先頭', (await b.evaluate(chainRows))[0].startsWith('Root'), (await b.evaluate(chainRows)).join(' | '))
await b.evaluate(clickText('Root の theme を変更'))
await sleep(150)
check('9 章 ref は追従', (await b.evaluate(leaf)).includes('dark'), await b.evaluate(leaf))
await b.evaluate(`document.querySelector('#as-value').click()`)
await sleep(200)
await b.evaluate(clickText('Root の theme を変更'))
await sleep(150)
check('9 章 値は追従しない', (await b.evaluate(leaf)).includes('dark'), await b.evaluate(leaf))
await b.evaluate(`document.querySelector('#override').click()`)
await sleep(250)
check('9 章 Middle が優先', (await b.evaluate(chainRows))[0].startsWith('Middle') && (await b.evaluate(leaf)).includes('from Middle'), (await b.evaluate(chainRows)).join(' | '))

// 第 10 章: スロットの依存
await b.goto(`${BASE}#/slots`)
await b.waitFor(`document.querySelector('.live-child')`)
await b.evaluate(clickText('n を更新'))
await sleep(200)
check('10 章 子だけ再描画', JSON.stringify(await b.evaluate(meter)) === '[0,1]', JSON.stringify(await b.evaluate(meter)))
check('10 章 STABLE', await b.evaluate(`return document.querySelectorAll('.tpl-grid .code')[1].textContent.includes('_: 1 /* STABLE */')`))
await b.evaluate(clickText('動的'))
await sleep(200)
check('10 章 DYNAMIC', await b.evaluate(`return document.querySelectorAll('.tpl-grid .code')[1].textContent.includes('1024 /* DYNAMIC_SLOTS */')`))

// 第 11 章: watch と競合
await b.goto(`${BASE}#/watch`)
await b.waitFor(`document.querySelector('.meters dd')`)
const firstFour = async () => JSON.stringify((await b.evaluate(meter)).slice(0, 4))
check('11 章 watchEffect は即時実行', (await firstFour()) === '[0,0,0,1]', await firstFour())
await b.evaluate(clickText('other + 1'))
await sleep(100)
await b.evaluate(clickText('count + 1'))
await sleep(100)
check('11 章 読んだ値にだけ反応', (await firstFour()) === '[1,1,1,2]', await firstFour())
await b.evaluate(clickText('A のあとすぐ B を検索'))
await sleep(1400)
check('11 章 中止すると正しい', await b.evaluate(`return document.querySelector('.outcome.is-good')?.textContent.includes('一致')`), await b.evaluate(`return document.querySelectorAll('.runlog li').length`))
await b.evaluate(`document.querySelector('#use-cleanup').click()`)
await sleep(100)
await b.evaluate(clickText('A のあとすぐ B を検索'))
await sleep(1400)
check('11 章 中止しないと古い結果', await b.evaluate(`return document.querySelector('.outcome.is-bad')?.textContent.includes('A result')`))

// 第 12 章: 後始末
await b.goto(`${BASE}#/composables`)
await b.waitFor(`document.querySelector('.meters dd')`)
const twice = async () => { for (let i = 0; i < 2; i++) { await b.evaluate(clickText('マウント')); await sleep(80); await b.evaluate(clickText('アンマウント')); await sleep(80) } }
await twice()
check('12 章 解除すると残らない', (await b.evaluate(meter))[1] === 0, JSON.stringify(await b.evaluate(meter)))
await b.evaluate(`document.querySelector('#cleanup').click()`)
await sleep(80)
await twice()
check('12 章 解除しないと残る', (await b.evaluate(meter))[1] === 2, JSON.stringify(await b.evaluate(meter)))
await b.evaluate(clickText('初期状態に戻す'))
await sleep(80)
check('12 章 リセット', (await b.evaluate(meter))[1] === 0)

check('操作中も console が静か', b.problems.length === 0, b.problems.slice(0, 3).join(' / '))

// 演習: 未回答は不正解、解答は正解になる
for (const r of ROUTES.slice(1)) {
  await b.goto(`${BASE}#/${r}`)
  await b.waitFor(`document.querySelector('.editor-input')`)
  await b.evaluate(clickText('実行して判定'))
  const bad = await b.waitFor(`document.querySelector('.ex-verdict.is-bad')`, 9000)
  await b.evaluate(clickText('解答を見る'))
  await sleep(100)
  await b.evaluate(clickText('実行して判定'))
  const good = await b.waitFor(`document.querySelector('.ex-verdict.is-good')`, 9000)
  check(`演習 /${r}`, bad && good, await b.evaluate(`return document.querySelector('.ex-verdict')?.textContent.trim()`))
}
// 入門と実践の章の、実行できる例がすべて動く
for (const r of [...INTRO, ...PRACTICE]) {
  await b.goto(`${BASE}#/${r}`)
  await b.waitFor(`document.querySelector('.guide-section')`)
  await sleep(300)
  const n = await b.evaluate(`return document.querySelectorAll('.guide-section .btn.is-primary').length`)
  let ok = true
  for (let i = 0; i < n; i++) {
    await b.evaluate(`document.querySelectorAll('.guide-section .btn.is-primary')[${i}].click()`)
    ok &&= await b.waitFor(`document.querySelectorAll('.guide-section .exercise')[${i}].querySelector('.ex-verdict.is-good')`, 9000)
  }
  check(`例 /${r}`, ok, `${n} 件`)
}

// 進捗
await b.goto(`${BASE}#/`)
await b.waitFor(`document.querySelector('progress')`)
check('進捗 全章を記録', (await b.evaluate(`return document.querySelector('progress').value`)) === 26, String(await b.evaluate(`return document.querySelector('progress').value`)))

// 検索
await b.evaluate(`const i = document.querySelector('#search'); i.focus(); i.value = 'nextTick'; i.dispatchEvent(new Event('input'))`)
check('検索 結果が出る', await b.waitFor(`document.querySelectorAll('#search-results [role=option]').length > 0`, 5000))
await b.evaluate(`document.querySelector('#search').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))`)
check('検索 Enter で移動', await b.waitFor(`location.hash !== '#/'`, 3000), await b.evaluate(`return location.hash`))
await b.evaluate(`const i = document.querySelector('#search'); i.focus(); i.value = 'zzzzqq'; i.dispatchEvent(new Event('input'))`)
check('検索 見つからない表示', await b.waitFor(`document.querySelector('.search-empty')`, 3000))
await b.evaluate(`const i = document.querySelector('#search'); i.value = ''; i.dispatchEvent(new Event('input')); i.blur()`)
await sleep(300)

// 早見表と一覧
// コードの色分け
await b.goto(`${BASE}#/start`)
await b.waitFor(`document.querySelector('.editor-layer .t-tag')`)
check('色分け 入力欄に色が付く', await b.evaluate(`return ['t-tag', 't-k', 't-dir', 't-must'].every(c => document.querySelector('.editor-layer .' + c))`))
const layerText = `return document.querySelector('.editor-layer').textContent === document.querySelector('.editor-input').value + '\\n'`
check('色分け 表示と入力が一致', await b.evaluate(layerText))
await b.evaluate(`const t = document.querySelector('.editor-input'); t.value = t.value + '<!-- note -->'; t.dispatchEvent(new Event('input'))`)
await sleep(100)
check('色分け 入力に追従', (await b.evaluate(layerText)) && await b.evaluate(`return [...document.querySelectorAll('.editor-layer .t-c')].some(e => e.textContent.includes('note'))`))
check('色分け 文字は透明で下の層が見える', (await b.evaluate(`return getComputedStyle(document.querySelector('.editor-input')).color`)) === 'rgba(0, 0, 0, 0)')
const metrics = `const a = getComputedStyle(document.querySelector('.editor-layer')); const c = getComputedStyle(document.querySelector('.editor-input')); return ['fontFamily', 'fontSize', 'lineHeight', 'paddingTop', 'paddingLeft', 'tabSize'].every(k => a[k] === c[k])`
check('色分け 文字の位置が揃う', await b.evaluate(metrics))
await b.evaluate(clickText('最初に戻す'))

// 第 E 章の例: フォームの送信が iframe の中で動く
await b.goto(`${BASE}#/events-forms`)
await b.waitFor(`document.querySelector('.guide-section')`)
check('前提の章を表示', (await b.evaluate(`return document.querySelectorAll('.needs a').length`)) === 2)
check('パンくずが重複しない', (await b.evaluate(`return document.querySelector('.crumb').textContent.trim()`)) === '入門 / F', await b.evaluate(`return document.querySelector('.crumb').textContent.trim()`))

await b.goto(`${BASE}#/pitfalls`)
check('よくある間違い 16 件', await b.waitFor(`document.querySelectorAll('.pitfalls > li').length === 16`, 5000))
await b.goto(`${BASE}#/glossary`)
check('用語集 略語の一覧', await b.waitFor(`document.querySelectorAll('.abbrs tbody tr').length === 13`, 5000))
check('用語集 全章の用語', await b.waitFor(`document.querySelectorAll('.glossary tbody tr').length > 60`, 8000))

await b.goto(`${BASE}#/playground`)
await b.waitFor(`document.querySelector('.editor-input')`)
await b.evaluate(clickText('実行'))
check('プレイグラウンドが動く', await b.waitFor(`document.querySelector('.ex-verdict.is-good')`, 9000))

// 右上の切り替え
check('切り替えが右上にある', await b.evaluate(`const r = document.querySelector('#lang-button').getBoundingClientRect(); return r.top < 60 && r.left > innerWidth / 2`))

// やさしいモード
await b.goto(`${BASE}#/ref-effect`)
await b.waitFor(`document.querySelector('h1')`)
check('やさしい 既定は非表示', (await b.evaluate(`return !!document.querySelector('.easy')`)) === false)
await b.evaluate(`document.querySelector('#easy-on').click()`)
await sleep(150)
check('やさしい 解説が出る', await b.evaluate(`return document.querySelectorAll('.easy .terms div').length >= 4`))
check('やさしい 実装を畳む', (await b.evaluate(`return document.querySelector('details.impl').open`)) === false)
await b.evaluate(`document.querySelector('#easy-off').click()`)

// ダークモード
await b.evaluate(`document.querySelector('#theme-toggle').click()`)
await sleep(150)
check('ダーク 配色が変わる', (await b.evaluate(`return getComputedStyle(document.body).backgroundColor`)) === 'rgb(16, 22, 31)', await b.evaluate(`return getComputedStyle(document.body).backgroundColor`))
await b.goto(`${BASE}#/`)
await sleep(300)
check('ダーク ロゴが切り替わる', await b.evaluate(`return decodeURIComponent(document.querySelector('h1 img').src).includes('e6ebf1')`))
if (OUT) for (const r of ['', 'ref-effect', 'computed', 'compiler', 'keyed-diff']) {
  await b.goto(`${BASE}#/${r}`)
  await sleep(600)
  await b.shot(`${OUT}/dark-${r || 'home'}.png`, true)
}
await b.evaluate(`document.querySelector('#theme-toggle').click()`)
await sleep(100)

// 英語: 全ページで日本語が残っていない
await b.evaluate(`document.querySelector('#lang-button').click(); await new Promise(r => setTimeout(r, 50)); document.querySelector('#lang-option-en').click(); document.querySelector('#easy-on').click()`)
await sleep(200)
for (const r of [...ROUTES, ...TOOLS]) {
  await b.goto(`${BASE}#/${r}`)
  await b.waitFor(`document.querySelector('h1')`)
  await sleep(400)
  const left = await b.evaluate(`return (document.querySelector('.main').innerText.replace('日本語', '') + [...document.querySelectorAll('.main textarea')].map(t => t.value).join('')).match(/[\\u3040-\\u30ff\\u4e00-\\u9fff]+/g)?.slice(0, 6).join(' ') ?? ''`)
  check(`英語 /${r} に日本語が残らない`, left === '', left)
  if (OUT && r === 'computed') await b.shot(`${OUT}/en-computed.png`, true)
}
await b.goto(`${BASE}#/ref-effect`)
await sleep(300)
await b.evaluate(clickText('Run the effects'))
await sleep(300)
await b.evaluate(`document.querySelector('[aria-label="Next step"]').click()`)
check('英語 再生の説明', !/[぀-ヿ一-鿿]/.test(await b.evaluate(`return document.querySelector('.stepnote').textContent`)), await b.evaluate(`return document.querySelector('.stepnote').textContent`))
// 言語メニューの操作
const list = `document.querySelector('#lang-list')`
const shown = `return getComputedStyle(${list}).display !== 'none'`
const key = (target, k) => `${target}.dispatchEvent(new KeyboardEvent('keydown', { key: '${k}', bubbles: true }))`
check('言語 既定で閉じている', (await b.evaluate(shown)) === false)
await b.evaluate(`document.querySelector('#lang-button').click()`)
await sleep(60)
check('言語 開くと一覧へフォーカス', (await b.evaluate(shown)) && (await b.evaluate(`return document.activeElement.id`)) === 'lang-list')
check('言語の選択肢', (await b.evaluate(`return [...${list}.querySelectorAll('[role=option]')].map(o => o.textContent.trim()).join()`)) === '日本語,English')
await b.evaluate(key(list, 'Escape'))
await sleep(60)
check('言語 Esc で閉じて戻る', !(await b.evaluate(shown)) && (await b.evaluate(`return document.activeElement.id`)) === 'lang-button')
await b.evaluate(key(`document.querySelector('#lang-button')`, 'ArrowDown'))
await sleep(60)
await b.evaluate(key(list, 'ArrowUp'))
await sleep(30)
await b.evaluate(key(list, 'Enter'))
await sleep(120)
check('言語 キーボードで選択', (await b.evaluate(`return document.documentElement.lang`)) === 'ja')
await b.evaluate(`document.querySelector('#lang-button').click()`)
await sleep(60)
await b.evaluate(`document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))`)
await sleep(60)
check('言語 外側クリックで閉じる', !(await b.evaluate(shown)))
// ツールチップ
const hoverTip = async (sel) => {
  const box = await b.evaluate(`const r = document.querySelector('${sel}').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }`)
  await b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: box.x, y: box.y })
  await sleep(400)
  return b.evaluate(`const t = document.querySelector('${sel}').closest('.tip')?.querySelector('.tip-text'); return t && getComputedStyle(t).visibility === 'visible' ? t.textContent : ''`)
}
await b.goto(`${BASE}#/ref-effect`)
await b.evaluate(`window.scrollTo(0, 0)`)
await sleep(300)
check('ツールチップ テーマ', (await hoverTip('#theme-toggle')) === 'ダーク表示に切り替える', await hoverTip('#theme-toggle'))
check('ツールチップ 言語', (await hoverTip('#lang-button')) === '表示する言語を変更', await hoverTip('#lang-button'))
await b.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 500 })
await sleep(200)
check('ツールチップ 離れると消える', (await b.evaluate(`return getComputedStyle(document.querySelector('#theme-toggle').closest('.tip').querySelector('.tip-text')).visibility`)) === 'hidden')
check('全体 console が静か', b.problems.length === 0, b.problems.slice(0, 3).join(' / '))

b.close()
console.log(results.join('\n'))
process.exit(results.some((r) => r.startsWith('FAIL')) ? 1 : 0)
