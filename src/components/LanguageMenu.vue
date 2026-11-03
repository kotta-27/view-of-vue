<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, useTemplateRef } from 'vue'
import { common } from '../content/common'
import { LOCALES, locale, pick } from '../lib/settings'
import TipHint from './TipHint.vue'

const t = computed(() => pick(common))
const open = ref(false)
const active = ref(0)
const root = useTemplateRef<HTMLElement>('root')
const button = useTemplateRef<HTMLButtonElement>('button')
const list = useTemplateRef<HTMLUListElement>('list')

const current = computed(() => LOCALES.find(l => l.code === locale.value))

function onOutside(e: PointerEvent) {
  if (!root.value?.contains(e.target as Node)) close()
}

async function show() {
  active.value = Math.max(0, LOCALES.findIndex(l => l.code === locale.value))
  open.value = true
  document.addEventListener('pointerdown', onOutside)
  await nextTick()
  list.value?.focus()
}

function close(refocus = false) {
  open.value = false
  document.removeEventListener('pointerdown', onOutside)
  if (refocus) button.value?.focus()
}

function choose(i: number) {
  locale.value = LOCALES[i].code
  close(true)
}

function onButtonKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault()
    show()
  }
}

function onListKey(e: KeyboardEvent) {
  const last = LOCALES.length - 1
  const moves: Record<string, number> = {
    ArrowDown: Math.min(active.value + 1, last),
    ArrowUp: Math.max(active.value - 1, 0),
    Home: 0,
    End: last,
  }
  if (e.key in moves) {
    e.preventDefault()
    active.value = moves[e.key]
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    choose(active.value)
  } else if (e.key === 'Escape') {
    e.preventDefault()
    close(true)
  } else if (e.key === 'Tab') {
    close()
  }
}

onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <div ref="root" class="lang-menu">
    <TipHint :text="t.changeLanguage" align="end" :hidden="open">
      <button
        id="lang-button"
        ref="button"
        class="lang-button"
        aria-haspopup="listbox"
        :aria-expanded="open"
        aria-controls="lang-list"
        :aria-label="`${t.language}: ${current?.label}`"
        @click="open ? close() : show()"
        @keydown="onButtonKey"
      >
        <svg class="lang-globe" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"></path>
        </svg>
        <span>{{ current?.label }}</span>
        <svg class="lang-caret" :class="{ 'is-open': open }" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4l4 4 4-4"></path>
        </svg>
      </button>
    </TipHint>
    <ul
      v-show="open"
      id="lang-list"
      ref="list"
      class="lang-list"
      role="listbox"
      tabindex="-1"
      :aria-label="t.language"
      :aria-activedescendant="`lang-option-${LOCALES[active].code}`"
      @keydown="onListKey"
    >
      <li
        v-for="(l, i) in LOCALES"
        :id="`lang-option-${l.code}`"
        :key="l.code"
        role="option"
        :lang="l.code"
        :aria-selected="l.code === locale"
        :class="{ 'is-active': i === active }"
        @click="choose(i)"
        @pointermove="active = i"
      >
        <span>{{ l.label }}</span>
        <svg v-if="l.code === locale" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5L4.7 9 10 3.5"></path></svg>
      </li>
    </ul>
  </div>
</template>
