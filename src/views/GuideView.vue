<script setup lang="ts">
import { computed, shallowRef, watchEffect } from 'vue'
import ChapterPage from '../components/ChapterPage.vue'
import CodeBlock from '../components/CodeBlock.vue'
import CodeExercise from '../components/CodeExercise.vue'
import type { ChapterContent } from '../content/types'
import { guideModules } from '../content/guide'
import { chapterId } from '../lib/chapters'
import { pick } from '../lib/settings'

const props = defineProps<{ no: number | string }>()

const content = shallowRef<ChapterContent>()
watchEffect(async () => {
  content.value = (await guideModules[String(props.no)]()).default
})

const c = computed(() => content.value && pick(content.value))
</script>

<template>
  <ChapterPage v-if="content && c" :no="no" :text="c" :exercise="content.exercise" :sources="[]">
    <section v-for="(s, i) in c.sections" :key="i" class="guide-section">
      <h2>{{ s.title }}</h2>
      <div class="guide-body" v-html="s.body"></div>
      <CodeExercise v-if="s.run" :id="`${chapterId(no)}-${i}`" :starter="s.run" compact />
      <CodeBlock v-else-if="s.show" :code="s.show" />
    </section>
  </ChapterPage>
</template>
