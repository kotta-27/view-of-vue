<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import LanguageMenu from './components/LanguageMenu.vue'
import SearchBox from './components/SearchBox.vue'
import TipHint from './components/TipHint.vue'
import { common } from './content/common'
import { chapterId, PARTS, type Part } from './lib/chapters'
import { partName } from './lib/part-name'
import { done } from './lib/progress'
import { easy, pick, theme } from './lib/settings'

const icon = `${import.meta.env.BASE_URL}icon.svg`
const route = useRoute()
const open = ref(false)
const t = computed(() => pick(common))

const isOpen = (p: Part) => p.chapters.some(c => c.path === route.path)
const partDone = (p: Part) => p.chapters.filter(c => done.value.has(chapterId(c.no))).length

watch(
  () => route.path,
  () => {
    open.value = false
  },
)
</script>

<template>
  <div class="shell">
    <header class="side">
      <div class="side-head">
        <RouterLink to="/" class="brand">
          <img :src="icon" alt="" width="28" height="28" />
          View of Vue
        </RouterLink>
        <button class="menu" :aria-expanded="open" aria-controls="toc" @click="open = !open">{{ t.menu }}</button>
      </div>
      <div class="prefs" :class="{ 'is-open': open }">
        <div class="pref">
          <span :title="t.easyHint">{{ t.easyMode }}</span>
          <span class="pref-seg" role="group" :aria-label="t.easyMode">
            <button id="easy-on" :aria-pressed="easy" @click="easy = true">{{ t.on }}</button>
            <button id="easy-off" :aria-pressed="!easy" @click="easy = false">{{ t.off }}</button>
          </span>
        </div>
      </div>
      <nav id="toc" class="toc" :class="{ 'is-open': open }" :aria-label="t.menu">
        <details v-for="p in PARTS" :key="p.no" :open="isOpen(p)">
          <summary>
            <span>{{ partName(p, t) }}</span>
            <small>{{ partDone(p) }}/{{ p.chapters.length }}</small>
          </summary>
          <ol>
            <li v-for="c in p.chapters" :key="c.no">
              <RouterLink :to="c.path">
                <span>{{ c.no }}</span>{{ pick(c.title) }}
                <svg v-if="done.has(chapterId(c.no))" class="toc-done" viewBox="0 0 12 12" role="img" :aria-label="t.donePart">
                  <path d="M2 6.5L4.7 9 10 3.5"></path>
                </svg>
              </RouterLink>
            </li>
          </ol>
        </details>
        <section>
          <h2>{{ t.tools }}</h2>
          <ol>
            <li><RouterLink to="/playground">{{ t.playground }}</RouterLink></li>
            <li><RouterLink to="/cheatsheet">{{ t.cheatsheet }}</RouterLink></li>
            <li><RouterLink to="/pitfalls">{{ t.pitfalls }}</RouterLink></li>
            <li><RouterLink to="/glossary">{{ t.glossary }}</RouterLink></li>
          </ol>
        </section>
      </nav>
    </header>
    <main class="main">
      <div class="topbar">
        <SearchBox />
        <LanguageMenu />
        <TipHint :text="theme === 'dark' ? t.switchLight : t.switchDark" align="end">
          <button
            id="theme-toggle"
            class="icon-btn"
            :aria-label="theme === 'dark' ? t.switchLight : t.switchDark"
            @click="theme = theme === 'dark' ? 'light' : 'dark'"
          >
            <svg v-if="theme === 'dark'" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"></path>
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"></path>
            </svg>
          </button>
        </TipHint>
      </div>
      <RouterView v-slot="{ Component, route: r }">
        <component :is="Component" :key="r.path" />
      </RouterView>
    </main>
  </div>
</template>
