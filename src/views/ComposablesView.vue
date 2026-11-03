<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import ChapterPage from '../components/ChapterPage.vue'
import CodeBlock from '../components/CodeBlock.vue'
import content from '../content/ch12'
import { pick } from '../lib/settings'
import { bus, listenerCount } from '../examples/composable/bus'
import BusReader from '../examples/composable/BusReader.vue'
import composableSource from '../examples/composable/useBusValue.ts?raw'

const c = computed(() => pick(content))

const shown = ref(false)
const cleanup = ref(true)
const value = ref(0)
const mounts = ref(0)

bus.clear()

function toggle() {
  if (!shown.value) mounts.value++
  shown.value = !shown.value
}

function send() {
  bus.emit(++value.value)
}

function reset() {
  shown.value = false
  mounts.value = 0
  bus.clear()
}

onBeforeUnmount(() => bus.clear())

const SOURCES: [string, string][] = [
  ['packages/reactivity/src/effectScope.ts', 'EffectScope, effectScope, onScopeDispose'],
  ['packages/runtime-core/src/component.ts', 'createComponentInstance'],
]
</script>

<template>
  <ChapterPage :no="12" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="fig-grid">
          <div class="fig-main">
            <div class="live">
              <BusReader v-if="shown" :key="mounts" :cleanup="cleanup" />
              <span v-else class="row-empty">{{ c.ui.unmounted }}</span>
            </div>
            <div class="actions">
              <button class="btn" @click="toggle">{{ shown ? c.ui.unmount : c.ui.mount }}</button>
              <button class="btn" @click="send">{{ c.ui.send }}</button>
              <button class="btn is-quiet" @click="reset">{{ c.ui.reset }}</button>
            </div>
            <div class="actions">
              <label class="toggle"><input id="cleanup" v-model="cleanup" type="checkbox" :disabled="shown" />{{ c.ui.cleanup }}</label>
            </div>
            <dl class="meters is-small">
              <div><dt>{{ c.ui.mounts }}</dt><dd>{{ mounts }}</dd></div>
              <div class="is-key"><dt>{{ c.ui.listeners }}</dt><dd>{{ listenerCount }}</dd></div>
              <div><dt>{{ c.ui.sent }}</dt><dd>{{ value }}</dd></div>
            </dl>
            <p class="outcome" :class="{ 'is-bad': listenerCount > (shown ? 1 : 0) }">
              {{ listenerCount > (shown ? 1 : 0) ? c.ui.leak : c.ui.ok }}
            </p>
          </div>
          <CodeBlock :code="composableSource.trim()" :caption="c.ui.codeCaption" />
        </div>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>

    <template #checks>
      <CodeBlock :code="c.ui.scope" :caption="c.ui.scopeCaption" />
    </template>
  </ChapterPage>
</template>
