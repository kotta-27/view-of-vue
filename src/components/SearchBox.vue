<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { common } from '../content/common'
import { search, type Hit } from '../lib/search'
import { locale, pick } from '../lib/settings'

const t = computed(() => pick(common))
const router = useRouter()
const query = ref('')
const hits = shallowRef<Hit[]>([])
const open = ref(false)
const active = ref(0)
const searched = ref(false)
const input = useTemplateRef<HTMLInputElement>('input')

let latest = 0
watch([query, locale], async ([q]) => {
  const id = ++latest
  const found = await search(q, locale.value)
  if (id !== latest) return
  hits.value = found
  active.value = 0
  searched.value = q.trim() !== ''
  open.value = searched.value
})

function go(hit: Hit | undefined) {
  if (!hit) return
  router.push(hit.path)
  open.value = false
  query.value = ''
  input.value?.blur()
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    const n = hits.value.length
    if (n) active.value = (active.value + (e.key === 'ArrowDown' ? 1 : n - 1)) % n
  } else if (e.key === 'Enter') {
    e.preventDefault()
    go(hits.value[active.value])
  } else if (e.key === 'Escape') {
    open.value = false
    input.value?.blur()
  }
}

function onGlobalKey(e: KeyboardEvent) {
  const el = e.target as HTMLElement
  if (e.key === '/' && !el.matches('input, textarea, select')) {
    e.preventDefault()
    input.value?.focus()
  }
}

function onBlur() {
  // 結果のクリックを先に処理させる
  setTimeout(() => (open.value = false), 150)
}

onMounted(() => window.addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onGlobalKey))
</script>

<template>
  <div class="search">
    <svg class="search-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7"></circle>
      <path d="M16.5 16.5L21 21"></path>
    </svg>
    <input
      id="search"
      ref="input"
      v-model="query"
      type="search"
      role="combobox"
      autocomplete="off"
      aria-controls="search-results"
      :aria-expanded="open"
      :aria-label="t.search"
      :placeholder="t.searchPlaceholder"
      @keydown="onKey"
      @focus="open = searched"
      @blur="onBlur"
    />
    <ul v-show="open" id="search-results" class="search-results" role="listbox" :aria-label="t.search">
      <li
        v-for="(h, i) in hits"
        :key="`${h.path}|${h.title}`"
        role="option"
        :aria-selected="i === active"
        :class="{ 'is-active': i === active }"
        @pointermove="active = i"
        @mousedown.prevent="go(h)"
      >
        <b>{{ h.title }}</b>
        <span>{{ h.snippet }}</span>
      </li>
      <li v-if="!hits.length" class="search-empty">{{ t.noResults }}</li>
    </ul>
  </div>
</template>
