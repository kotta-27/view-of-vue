<script setup lang="ts">
import { computed, ref } from 'vue'
import ChapterPage from '../components/ChapterPage.vue'
import CodeBlock from '../components/CodeBlock.vue'
import content from '../content/ch07'
import { pick } from '../lib/settings'
import LifeParent from '../examples/lifecycle/LifeParent.vue'
import parentSource from '../examples/lifecycle/LifeParent.vue?raw'
import { clearEntries, entries } from '../examples/lifecycle/log'

const HOOKS = ['setup', 'onBeforeMount', 'onMounted', 'onBeforeUpdate', 'onUpdated', 'onBeforeUnmount', 'onUnmounted']

const c = computed(() => pick(content))
const show = ref(true)
const value = ref(0)

clearEntries()

function act(fn: () => void) {
  clearEntries()
  fn()
}

const last = computed(() => entries.value.at(-1))
const stage = computed(() => (last.value ? HOOKS.indexOf(last.value.hook) : -1))

const SOURCES: [string, string][] = [
  ['packages/runtime-core/src/apiLifecycle.ts', 'onMounted, onUpdated'],
  ['packages/runtime-core/src/renderer.ts', 'setupRenderEffect, unmountComponent'],
  ['packages/runtime-core/src/component.ts', 'ComponentInternalInstance'],
]
</script>

<template>
  <ChapterPage :no="7" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <ol class="pipe is-7" :aria-label="c.ui.stages">
          <li v-for="(h, i) in HOOKS" :key="h" :class="{ 'is-on': i === stage }">
            {{ h }}
          </li>
        </ol>
        <div class="fig-grid">
          <div class="fig-main">
            <div class="live">
              <LifeParent v-if="show" :value="value" />
              <span v-else class="row-empty">{{ c.ui.unmounted }}</span>
            </div>
            <div class="actions">
              <button class="btn" @click="act(() => (show = !show))">{{ show ? c.ui.unmount : c.ui.mount }}</button>
              <button class="btn" :disabled="!show" @click="act(() => value++)">{{ c.ui.updateParent }}</button>
              <button class="btn is-quiet" @click="clearEntries">{{ c.ui.clear }}</button>
            </div>
          </div>
          <div class="sched-side">
            <span class="panel-label">{{ c.ui.logCaption }}</span>
            <ol class="runlog" aria-live="polite">
              <li v-for="(e, i) in entries" :key="i">
                <span>{{ e.who }}</span>{{ e.hook }} / {{ e.dom || c.ui.noDom }}
              </li>
            </ol>
          </div>
        </div>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>

    <template #checks>
      <CodeBlock :code="parentSource.trim()" caption="LifeParent.vue" />
    </template>
  </ChapterPage>
</template>
