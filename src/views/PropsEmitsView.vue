<script setup lang="ts">
import { computed, nextTick, shallowRef, watch } from 'vue'
import ChapterPage from '../components/ChapterPage.vue'
import CodeBlock from '../components/CodeBlock.vue'
import content from '../content/ch08'
import { pick } from '../lib/settings'
import PropsParent from '../examples/props/PropsParent.vue'
import parentSource from '../examples/props/PropsParent.vue?raw'
import { a, b, counts, tick } from '../examples/props/state'

const c = computed(() => pick(content))

a.value = 0
b.value = 0
tick.value = 0
for (const k in counts) counts[k] = 0

const ui = shallowRef({ ...counts })

// onUpdated は post キューで走るので、flush が終わってから回数を読む
watch([a, b, tick], () => {
  nextTick(() => {
    ui.value = { ...counts }
  })
})

const SOURCES: [string, string][] = [
  ['packages/runtime-core/src/componentRenderUtils.ts', 'shouldUpdateComponent, hasPropsChanged'],
  ['packages/runtime-core/src/componentProps.ts', 'initProps, updateProps'],
  ['packages/runtime-core/src/componentEmits.ts', 'emit'],
]
</script>

<template>
  <ChapterPage :no="8" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="fig-grid">
          <div class="fig-main">
            <div class="live"><PropsParent /></div>
            <div class="actions">
              <button class="btn" @click="tick++">{{ c.ui.updateParent }}</button>
            </div>
            <dl class="meters">
              <div class="is-key"><dt>{{ c.ui.parent }}</dt><dd>{{ ui.parent }}</dd></div>
              <div><dt>{{ c.ui.a }}</dt><dd>{{ ui.A }}</dd></div>
              <div><dt>{{ c.ui.b }}</dt><dd>{{ ui.B }}</dd></div>
              <div><dt>{{ c.ui.c }}</dt><dd>{{ ui.C }}</dd></div>
            </dl>
          </div>
          <CodeBlock :code="parentSource.trim()" :caption="c.ui.codeCaption" />
        </div>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>
  </ChapterPage>
</template>
