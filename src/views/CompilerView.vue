<script setup lang="ts">
import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import CodeBlock from '../components/CodeBlock.vue'
import CodeEditor from '../components/CodeEditor.vue'
import ChapterPage from '../components/ChapterPage.vue'
import TemplateTree from '../components/TemplateTree.vue'
import content from '../content/ch05'
import { pick } from '../lib/settings'
import { compile, PATCH_FLAGS, type CompileResult, type TemplateNode } from '../lib/template'

const PRESETS = [
  {
    name: 'basic',
    code: `<section class="card">
  <h1>Title</h1>
  <p>Description</p>
  <p :class="tone">{{ msg }}</p>
  <button @click="n++">{{ n }}</button>
</section>`,
  },
  {
    name: 'list',
    code: `<ul class="list">
  <li class="head">Heading</li>
  <li v-for="x in xs" :key="x.id" :class="{ on: x.on }">
    <b>Name</b>{{ x.name }}
  </li>
</ul>`,
  },
  {
    name: 'branch',
    code: `<div>
  <p v-if="ok">{{ yes }}</p>
  <p v-else>Loading</p>
  <input v-model="text" :placeholder="hint" />
</div>`,
  },
  {
    name: 'mostlyStatic',
    code: `<article>
  <h1>A long article</h1>
  <p>First paragraph</p>
  <p>Second paragraph</p>
  <p>Third paragraph</p>
  <footer>{{ date }}</footer>
</article>`,
  },
]

const c = computed(() => pick(content))

const source = ref(PRESETS[0].code)
const result = shallowRef<CompileResult>(compile(source.value))
const errors = ref<string[]>([])

let timer: ReturnType<typeof setTimeout> | undefined
watch(source, code => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    try {
      const r = compile(code)
      errors.value = r.errors
      if (!r.errors.length) result.value = r
    } catch (e) {
      errors.value = [String(e)]
    }
  }, 120)
})
onBeforeUnmount(() => clearTimeout(timer))

const used = computed(() => {
  const found = new Set<string>()
  const walk = (nodes: TemplateNode[]) => {
    for (const n of nodes) {
      n.flags.forEach(f => found.add(f))
      walk(n.children)
    }
  }
  walk(result.value.tree)
  return found
})

const SOURCES: [string, string][] = [
  ['packages/compiler-core/src/transforms/cacheStatic.ts', 'cacheStatic'],
  ['packages/compiler-dom/src/transforms/stringifyStatic.ts', 'stringifyStatic'],
  ['packages/shared/src/patchFlags.ts', 'PatchFlags'],
  ['packages/runtime-core/src/renderer.ts', 'patchBlockChildren'],
]
</script>

<template>
  <ChapterPage :no="5" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="actions is-top">
          <button
            v-for="p in PRESETS"
            :key="p.name"
            class="btn"
            :class="{ 'is-primary': source === p.code }"
            @click="source = p.code"
          >
            {{ (c.ui as Record<string, string>)[p.name] }}
          </button>
        </div>

        <div class="tpl-grid">
          <div class="tpl-input">
            <label for="tpl" class="panel-label">{{ c.ui.template }}</label>
            <CodeEditor id="tpl" v-model="source" :rows="9" />
            <ul v-if="errors.length" class="errors" role="alert">
              <li v-for="e in errors" :key="e">{{ e }}</li>
            </ul>
            <dl class="meters is-small">
              <div><dt>{{ c.ui.elements }}</dt><dd>{{ result.stats.all }}</dd></div>
              <div class="is-key"><dt>{{ c.ui.checked }}</dt><dd>{{ result.stats.checked }}</dd></div>
              <div><dt>{{ c.ui.cached }}</dt><dd>{{ result.stats.cached }}</dd></div>
            </dl>
          </div>
          <div class="tpl-tree">
            <span class="panel-label">{{ c.ui.analysis }}</span>
            <TemplateTree :nodes="result.tree" />
          </div>
        </div>

        <CodeBlock class="tpl-code" :code="result.code" :caption="c.ui.output" />

        <div class="flags">
          <span class="panel-label">{{ c.ui.flags }}</span>
          <ul>
            <li v-for="[bit, name, label] in PATCH_FLAGS" :key="bit" :class="{ 'is-on': used.has(name) }">
              <b>{{ bit }}</b><code>{{ name }}</code><span>{{ label }}</span>
            </li>
          </ul>
        </div>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>
  </ChapterPage>
</template>
