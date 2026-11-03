<script setup lang="ts">
import { computed, nextTick, ref, shallowRef } from 'vue'
import ChapterPage from '../components/ChapterPage.vue'
import CodeBlock from '../components/CodeBlock.vue'
import content from '../content/ch09'
import { pick } from '../lib/settings'
import { theme, themeKey } from '../examples/provide/keys'
import ProvideRoot from '../examples/provide/ProvideRoot.vue'

const c = computed(() => pick(content))

theme.value = 'light'

const asValue = ref(false)
const override = ref(false)
const chain = shallowRef<{ owner: string; value: string; hit: boolean }[]>([])

const remountKey = computed(() => `${asValue.value}-${override.value}`)

function onReady(provides: object) {
  const owners = override.value ? ['Middle', 'Root'] : ['Root']
  const levels: typeof chain.value = []
  let hit = false
  let upper = 0
  for (let p: object | null = provides, i = 0; p; p = Object.getPrototypeOf(p), i++) {
    if (i >= owners.length) {
      upper++
      continue
    }
    const raw = Object.getOwnPropertyDescriptor(p, themeKey)?.value
    const shown = raw === undefined ? c.value.ui.none : typeof raw === 'string' ? `'${raw}' (${c.value.ui.value})` : 'ref'
    levels.push({ owner: owners[i], value: shown, hit: raw !== undefined && !hit })
    hit ||= raw !== undefined
  }
  levels.push({ owner: c.value.ui.above, value: c.value.ui.aboveDesc.replace('{n}', String(upper)), hit: false })
  nextTick(() => {
    chain.value = levels
  })
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const SOURCES: [string, string][] = [['packages/runtime-core/src/apiInject.ts', 'provide, inject']]
</script>

<template>
  <ChapterPage :no="9" :text="c" :exercise="content.exercise" :sources="SOURCES">
    <section>
      <h2>{{ c.ui.figTitle }}</h2>
      <figure class="fig">
        <div class="fig-grid">
          <div class="fig-main">
            <div class="live">
              <ProvideRoot :key="remountKey" :as-value="asValue" :override="override" @ready="onReady" />
            </div>
            <div class="actions">
              <button class="btn" @click="toggleTheme">{{ c.ui.changeTheme }}</button>
            </div>
            <div class="actions">
              <label class="toggle"><input id="as-value" v-model="asValue" type="checkbox" />{{ c.ui.asValue }}</label>
              <label class="toggle"><input id="override" v-model="override" type="checkbox" />{{ c.ui.override }}</label>
            </div>
            <span class="panel-label">{{ c.ui.chainCaption }}</span>
            <ol class="chain">
              <li v-for="l in chain" :key="l.owner" :class="{ 'is-hit': l.hit }">
                <span>{{ l.owner }}</span><code>{{ l.value }}</code>
              </li>
            </ol>
          </div>
          <CodeBlock :code="c.ui.implCode" :caption="c.ui.implCaption" />
        </div>
        <figcaption>{{ c.ui.figCaption }}</figcaption>
      </figure>
    </section>

    <template #checks>
      <CodeBlock :code="c.ui.scene" :caption="c.ui.sceneCaption" />
    </template>
  </ChapterPage>
</template>
