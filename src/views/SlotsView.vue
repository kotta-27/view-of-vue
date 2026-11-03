<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, watch } from 'vue'
import ChapterPage from '../components/ChapterPage.vue'
import CodeBlock from '../components/CodeBlock.vue'
import content from '../content/ch10'
import { pick } from '../lib/settings'
import SlotParent from '../examples/slots/SlotParent.vue'
import parentSource from '../examples/slots/SlotParent.vue?raw'
import { counts, n } from '../examples/slots/state'
import { compile } from '../lib/template'

const PRESETS = [
  { name: 'plain', code: '<SlotChild>{{ n }}</SlotChild>' },
  { name: 'scoped', code: '<SlotChild v-slot="{ item }">{{ item.name }}</SlotChild>' },
  { name: 'dynamic', code: '<SlotChild>\n  <template v-if="ok" #default>{{ n }}</template>\n</SlotChild>' },
]

const c = computed(() => pick(content))

n.value = 0
for (const k in counts) counts[k] = 0
const ui = shallowRef({ ...counts })

watch(n, () => {
  nextTick(() => {
    ui.value = { ...counts }
  })
})

const preset = ref(PRESETS[0])
const output = computed(() => compile(preset.value.code).code)

const SOURCES: [string, string][] = [
  ['packages/runtime-core/src/helpers/renderSlot.ts', 'renderSlot'],
  ['packages/runtime-core/src/componentRenderContext.ts', 'withCtx'],
  ['packages/runtime-core/src/componentSlots.ts', 'initSlots, updateSlots'],
]
</script>

<template>
  <ChapterPage :no="10" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="fig-grid">
          <div class="fig-main">
            <div class="live"><SlotParent /></div>
            <div class="actions">
              <button class="btn" @click="n++">{{ c.ui.update }}</button>
            </div>
            <dl class="meters is-small">
              <div><dt>{{ c.ui.parent }}</dt><dd>{{ ui.parent }}</dd></div>
              <div class="is-key"><dt>{{ c.ui.child }}</dt><dd>{{ ui.child }}</dd></div>
            </dl>
          </div>
          <CodeBlock :code="parentSource.trim()" :caption="c.ui.codeCaption" />
        </div>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>

    <section>
      <h2>{{ c.ui.fig2Title }}</h2>
      <figure class="fig">
        <div class="actions is-top">
          <button
            v-for="p in PRESETS"
            :key="p.name"
            class="btn"
            :class="{ 'is-primary': preset === p }"
            @click="preset = p"
          >
            {{ (c.ui as Record<string, string>)[p.name] }}
          </button>
        </div>
        <div class="tpl-grid">
          <CodeBlock :code="preset.code" :caption="c.ui.template" />
          <CodeBlock :code="output" :caption="c.ui.output" />
        </div>
        <figcaption>{{ c.ui.fig2Caption }}</figcaption>
      </figure>
    </section>
  </ChapterPage>
</template>
