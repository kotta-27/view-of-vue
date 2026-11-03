export interface Abbreviation {
  abbr: string
  full: string
  ja: string
  en: string
}

export const ABBREVIATIONS: Abbreviation[] = [
  { abbr: 'API', full: 'Application Programming Interface', ja: 'プログラムから機能を使うための窓口', en: 'The interface for using features from a program' },
  { abbr: 'AST', full: 'Abstract Syntax Tree', ja: 'コードの構造を木の形で表したデータ。抽象構文木', en: 'Data that represents the structure of code as a tree' },
  { abbr: 'CSS', full: 'Cascading Style Sheets', ja: '色や大きさなど、見た目を指定する言語', en: 'The language that sets colors, sizes and other appearance' },
  { abbr: 'DOM', full: 'Document Object Model', ja: 'ブラウザが画面を管理する、HTML の木構造', en: 'The tree of HTML elements the browser keeps for the page' },
  { abbr: 'E2E', full: 'End-to-End', ja: '利用者の操作を最初から最後まで通して確かめるテスト', en: 'Testing a whole user flow from start to finish' },
  { abbr: 'HTML', full: 'HyperText Markup Language', ja: '画面の構造を書く言語', en: 'The language that describes page structure' },
  { abbr: 'SEO', full: 'Search Engine Optimization', ja: '検索エンジンに正しく読まれるようにする工夫。検索エンジン最適化', en: 'Making pages easy for search engines to read' },
  { abbr: 'SFC', full: 'Single-File Component', ja: 'ロジック、テンプレート、スタイルを 1 つの .vue ファイルにまとめる形式', en: 'A format that keeps logic, template and styles in one .vue file' },
  { abbr: 'SPA', full: 'Single-Page Application', ja: '1 枚の HTML の中で画面を切り替えるアプリ', en: 'An app that switches screens inside one HTML page' },
  { abbr: 'SSG', full: 'Static Site Generation', ja: 'ビルド時に全ページの HTML を作っておく方式。静的サイト生成', en: 'Producing the HTML for every page at build time' },
  { abbr: 'SSR', full: 'Server-Side Rendering', ja: 'サーバーで HTML を作ってから送る方式', en: 'Producing HTML on the server before sending it' },
  { abbr: 'URL', full: 'Uniform Resource Locator', ja: 'ページの住所', en: 'The address of a page' },
  { abbr: 'XSS', full: 'Cross-Site Scripting', ja: '悪意のあるスクリプトをページに埋め込まれる攻撃', en: 'An attack that injects a malicious script into a page' },
]
