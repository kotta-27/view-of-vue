<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { pick, theme } from '../lib/settings'
import { common } from '../content/common'
import CodeEditor from './CodeEditor.vue'
import type { Exercise } from '../content/types'
import { markDone } from '../lib/progress'

const props = defineProps<{
  id: string
  exercise?: Exercise
  starter?: string
  todo?: string
  compact?: boolean
}>()

const t = computed(() => pick(common))
const start = computed(() => (props.starter ?? props.exercise?.starter ?? '').replace('TODO', () => props.todo ?? 'TODO'))

const storeKey = `vov-code-${props.id}`
const read = () => {
  try {
    return localStorage.getItem(storeKey)
  } catch {
    return null
  }
}

const code = ref(read() ?? start.value)
const edited = ref(read() !== null)
const status = ref<'idle' | 'running' | 'passed' | 'failed' | 'done'>('idle')
const message = ref('')
const logs = ref<string[]>([])
const frameKey = ref(0)
const frame = ref<HTMLIFrameElement>()
const frameDoc = ref('')
let timer: ReturnType<typeof setTimeout> | undefined
let pending: { code: string; css: string; vue: string } | null = null

// 言語を切り替えたとき、書き換えていなければ TODO の言語も追従させる
watch(start, value => {
  if (!edited.value) code.value = value
})

watch(code, value => {
  edited.value = value !== start.value
  try {
    if (edited.value) localStorage.setItem(storeKey, value)
    else localStorage.removeItem(storeKey)
  } catch {
    // 保存できなくても実行はできる
  }
})

function finish(next: typeof status.value, text = '') {
  clearTimeout(timer)
  status.value = next
  message.value = text
}

function onMessage(e: MessageEvent) {
  if (e.source !== frame.value?.contentWindow || !e.data?.vov) return
  const { type, text, message: msg, level } = e.data
  if (type === 'ready' && pending) {
    frame.value?.contentWindow?.postMessage(
      { ...pending, check: props.exercise?.check, locale: pick({ ja: 'ja', en: 'en' }) },
      '*',
    )
    pending = null
  } else if (type === 'log') logs.value = [...logs.value, `${level === 'log' ? '' : `[${level}] `}${text}`].slice(-20)
  else if (type === 'passed') {
    finish('passed')
    markDone(props.id)
  }
  else if (type === 'done') finish('done')
  else if (type === 'failed' || type === 'error') finish('failed', msg)
}

window.addEventListener('message', onMessage)
onBeforeUnmount(() => {
  window.removeEventListener('message', onMessage)
  clearTimeout(timer)
})

async function run() {
  status.value = 'running'
  message.value = ''
  logs.value = []
  try {
    const [{ compileSfc, frameHtml }, vue] = await Promise.all([
      import('../lib/exercise-run'),
      import('vue/dist/vue.global.prod.js?raw'),
    ])
    const { code: js, css } = await compileSfc(code.value)
    pending = { code: js, css, vue: vue.default }
    frameDoc.value = frameHtml(theme.value === 'dark')
    frameKey.value++
    clearTimeout(timer)
    timer = setTimeout(() => finish('failed', t.value.timeout), 6000)
  } catch (err) {
    finish('failed', (err as Error).message)
  }
}

function showSolution() {
  if (props.exercise) code.value = props.exercise.solution
}

function resetCode() {
  code.value = start.value
  status.value = 'idle'
  message.value = ''
  logs.value = []
  frameDoc.value = ''
}

const verdict = computed(() => {
  if (status.value === 'passed') return t.value.passed
  if (status.value === 'done') return t.value.ran
  if (status.value === 'running') return t.value.running
  return message.value
})
</script>

<template>
  <div class="exercise">
    <div class="ex-grid">
      <div class="ex-editor">
        <label :for="`code-${id}`" class="panel-label">{{ compact ? t.tryIt : t.editor }}</label>
        <CodeEditor
          :id="`code-${id}`"
          v-model="code"
          :rows="compact ? Math.min(code.split('\n').length + 1, 14) : 16"
        />
        <div class="actions">
          <button class="btn is-primary" :disabled="status === 'running'" @click="run">
            {{ exercise ? t.runCheck : t.run }}
          </button>
          <button v-if="exercise" class="btn" @click="showSolution">{{ t.solution }}</button>
          <button class="btn is-quiet" @click="resetCode">{{ t.resetCode }}</button>
        </div>
      </div>
      <div class="ex-result">
        <span class="panel-label">{{ t.preview }}</span>
        <iframe
          v-if="frameDoc"
          :key="frameKey"
          ref="frame"
          class="ex-frame"
          sandbox="allow-scripts allow-forms"
          :title="t.preview"
          :srcdoc="frameDoc"
        ></iframe>
        <p v-else class="ex-empty">{{ t.previewEmpty }}</p>
        <p
          v-if="verdict"
          class="outcome ex-verdict"
          :class="{ 'is-good': status === 'passed' || status === 'done', 'is-bad': status === 'failed' }"
          role="status"
        >
          {{ verdict }}
        </p>
        <pre v-if="logs.length" class="ex-logs">{{ logs.join('\n') }}</pre>
      </div>
    </div>
  </div>
</template>
