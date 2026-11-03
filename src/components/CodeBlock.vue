<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { highlightLines } from '../lib/highlight'

const props = defineProps<{ code: string; highlight?: number[]; caption?: string }>()

const lines = computed(() => highlightLines(props.code).map(line => line || ' '))

const scroller = ref<HTMLElement>()
watch(
  () => props.highlight,
  async hl => {
    if (!hl?.length) return
    await nextTick()
    const box = scroller.value
    const el = box?.querySelector<HTMLElement>('.is-on')
    if (!box || !el) return
    const top = el.offsetTop - box.clientHeight / 2
    box.scrollTo({ top, behavior: 'smooth' })
  },
)
</script>

<template>
  <figure class="code">
    <figcaption v-if="caption">{{ caption }}</figcaption>
    <div ref="scroller" class="code-scroll" tabindex="0">
      <pre><code><span
        v-for="(html, i) in lines"
        :key="i"
        class="code-line"
        :class="{ 'is-on': highlight?.includes(i + 1) }"
        v-html="html"
      /></code></pre>
    </div>
  </figure>
</template>
