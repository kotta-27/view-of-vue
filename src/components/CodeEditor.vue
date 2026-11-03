<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { highlightLines } from '../lib/highlight'

defineProps<{ id: string; rows: number }>()
const code = defineModel<string>({ required: true })

const layer = useTemplateRef<HTMLElement>('layer')
const html = computed(() => `${highlightLines(code.value).join('\n')}\n`)

function sync(e: Event) {
  const el = e.target as HTMLTextAreaElement
  if (!layer.value) return
  layer.value.scrollTop = el.scrollTop
  layer.value.scrollLeft = el.scrollLeft
}

function onTab(e: KeyboardEvent) {
  const el = e.target as HTMLTextAreaElement
  const at = el.selectionStart
  code.value = `${code.value.slice(0, at)}  ${code.value.slice(el.selectionEnd)}`
  requestAnimationFrame(() => el.setSelectionRange(at + 2, at + 2))
}
</script>

<template>
  <div class="editor">
    <pre ref="layer" class="editor-layer" aria-hidden="true"><code v-html="html"></code></pre>
    <textarea
      :id="id"
      v-model="code"
      class="editor-input"
      spellcheck="false"
      autocapitalize="off"
      autocomplete="off"
      :rows="rows"
      @scroll="sync"
      @keydown.tab.exact.prevent="onTab"
    ></textarea>
  </div>
</template>
