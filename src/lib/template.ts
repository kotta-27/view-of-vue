// 第 5 章。ブラウザの中で本物のコンパイラを走らせ、結果の AST を読み解く。
import { compileTemplate } from '@vue/compiler-sfc'

const NodeTypes = {
  ELEMENT: 1,
  TEXT: 2,
  COMMENT: 3,
  SIMPLE_EXPRESSION: 4,
  INTERPOLATION: 5,
  COMPOUND_EXPRESSION: 8,
  IF: 9,
  IF_BRANCH: 10,
  FOR: 11,
  TEXT_CALL: 12,
  VNODE_CALL: 13,
  JS_CACHE_EXPRESSION: 20,
} as const

/** shared の PatchFlags と同じ値 */
export const PATCH_FLAGS = [
  [1, 'TEXT', 'text'],
  [2, 'CLASS', 'class'],
  [4, 'STYLE', 'style'],
  [8, 'PROPS', 'named props'],
  [16, 'FULL_PROPS', 'all props'],
  [32, 'NEED_HYDRATION', 'hydration'],
  [64, 'STABLE_FRAGMENT', 'stable fragment'],
  [128, 'KEYED_FRAGMENT', 'keyed fragment'],
  [256, 'UNKEYED_FRAGMENT', 'unkeyed fragment'],
  [512, 'NEED_PATCH', 'ref and others'],
  [1024, 'DYNAMIC_SLOTS', 'dynamic slots'],
] as const

export function decodeFlags(flag: number | undefined): string[] {
  if (!flag) return []
  if (flag === -1) return ['CACHED']
  if (flag === -2) return ['BAIL']
  return PATCH_FLAGS.filter(([bit]) => flag & bit).map(([, name]) => name)
}

export type NodeKind = 'cached' | 'dynamic' | 'static' | 'structure'

export interface TemplateNode {
  label: string
  kind: NodeKind
  flag?: number
  flags: string[]
  children: TemplateNode[]
}

export interface CompileResult {
  code: string
  errors: string[]
  tree: TemplateNode[]
  stats: { all: number; cached: number; checked: number }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function toNode(node: any): TemplateNode | null {
  switch (node.type) {
    case NodeTypes.ELEMENT: {
      const gen = node.codegenNode
      const children = templateNodes(node.children)
      if (gen?.type === NodeTypes.JS_CACHE_EXPRESSION) {
        return { label: `<${node.tag}>`, kind: 'cached', flags: ['CACHED'], children }
      }
      const flag: number | undefined = gen?.patchFlag
      const hoistedOnly = !flag && !gen?.dynamicProps
      return {
        label: `<${node.tag}>`,
        kind: flag ? 'dynamic' : hoistedOnly ? 'static' : 'dynamic',
        flag,
        flags: decodeFlags(flag),
        children,
      }
    }
    case NodeTypes.IF:
      return {
        label: 'v-if',
        kind: 'structure',
        flags: [],
        children: node.branches.flatMap((b: any) => templateNodes(b.children)),
      }
    case NodeTypes.FOR:
      return {
        label: 'v-for',
        kind: 'structure',
        flag: node.codegenNode?.patchFlag,
        flags: decodeFlags(node.codegenNode?.patchFlag),
        children: templateNodes(node.children),
      }
    default:
      return null
  }
}

function templateNodes(nodes: any[] = []): TemplateNode[] {
  return nodes.map(toNode).filter((n): n is TemplateNode => n !== null)
}

function count(nodes: TemplateNode[], stats: CompileResult['stats']) {
  for (const n of nodes) {
    if (n.kind !== 'structure') stats.all++
    if (n.kind === 'cached') stats.cached++
    if (n.kind === 'dynamic' || n.kind === 'structure') stats.checked++
    count(n.children, stats)
  }
}

export function compile(source: string): CompileResult {
  const result = compileTemplate({
    source,
    filename: 'template.vue',
    id: 'template',
    transformAssetUrls: false,
    compilerOptions: {
      mode: 'module',
      prefixIdentifiers: true,
      hoistStatic: true,
      cacheHandlers: true,
    },
  })
  const errors = result.errors.map(e => (typeof e === 'string' ? e : e.message))
  const tree = result.ast ? templateNodes((result.ast as any).children) : []
  const stats = { all: 0, cached: 0, checked: 0 }
  count(tree, stats)
  return { code: result.code, errors, tree, stats }
}
