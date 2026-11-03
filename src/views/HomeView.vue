<script setup lang="ts">
import { computed } from 'vue'
import wordmarkDark from '../assets/wordmark-dark.svg'
import wordmarkLight from '../assets/wordmark.svg'
import CodeBlock from '../components/CodeBlock.vue'
import HeroPrint from '../components/HeroPrint.vue'
import { common } from '../content/common'
import { home } from '../content/home'
import CounterExample from '../examples/CounterExample.vue'
import counterSource from '../examples/CounterExample.vue?raw'
import { chapterId, CHAPTERS, PARTS } from '../lib/chapters'
import { partName } from '../lib/part-name'
import { done, resetProgress } from '../lib/progress'
import { pick, theme } from '../lib/settings'

const h = computed(() => pick(home))
const t = computed(() => pick(common))
const finished = computed(() => CHAPTERS.filter(c => done.value.has(chapterId(c.no))).length)
const wordmark = computed(() => (theme.value === 'dark' ? wordmarkDark : wordmarkLight))
</script>

<template>
  <article class="home">
    <header>
      <h1 class="wordmark"><img :src="wordmark" alt="View of Vue" /></h1>
      <p class="tagline">{{ h.tagline }}</p>
    </header>

    <HeroPrint />

    <section id="about-vue">
      <h2>{{ h.whatTitle }}</h2>
      <p v-for="p in h.what" :key="p">{{ p }}</p>

      <h3>{{ h.coreTitle }}</h3>
      <dl class="facts">
        <div v-for="[name, desc] in h.core" :key="name">
          <dt>{{ name }}</dt>
          <dd>{{ desc }}</dd>
        </div>
      </dl>
      <p v-html="h.viewNote"></p>

      <h3>{{ h.minimalTitle }}</h3>
      <div class="example">
        <CodeBlock :code="counterSource.trim()" caption="CounterExample.vue" />
        <div class="example-run">
          <span class="panel-label">{{ h.runLabel }}</span>
          <div class="example-box">
            <CounterExample />
            <p v-html="h.runNote"></p>
          </div>
        </div>
      </div>

      <ol class="walk">
        <li v-for="w in h.walk" :key="w" v-html="w"></li>
      </ol>

      <h3>{{ h.featuresTitle }}</h3>
      <dl class="facts">
        <div v-for="[name, desc] in h.features" :key="name">
          <dt>{{ name }}</dt>
          <dd v-html="desc"></dd>
        </div>
      </dl>
      <p class="more" v-html="h.more"></p>
    </section>

    <section>
      <h2>{{ h.aboutTitle }}</h2>
      <p>{{ h.about }}</p>
      <p>{{ h.audience }}</p>
      <h3>{{ h.orderTitle }}</h3>
      <ol class="order">
        <li v-for="o in h.order" :key="o">{{ o }}</li>
      </ol>
      <div class="progress" role="group" :aria-label="t.progress">
        <p>{{ t.progressOf(finished, CHAPTERS.length) }}</p>
        <progress :value="finished" :max="CHAPTERS.length"></progress>
        <button v-if="finished" class="btn is-quiet" @click="resetProgress">{{ t.resetProgress }}</button>
      </div>
    </section>

    <section>
      <h2>{{ h.contentsTitle }}</h2>
      <template v-for="p in PARTS" :key="p.no">
        <h3>{{ partName(p, t) }}</h3>
        <table class="contents">
          <thead>
            <tr><th scope="col">{{ h.chapter }}</th><th scope="col">{{ h.summary }}</th><th scope="col">{{ h.target }}</th></tr>
          </thead>
          <tbody>
            <tr v-for="c in p.chapters" :key="c.no">
              <td><RouterLink :to="c.path">{{ c.no }}. {{ pick(c.title) }}</RouterLink></td>
              <td>{{ pick(c.summary) }}</td>
              <td><code>{{ c.apis }}</code></td>
            </tr>
          </tbody>
        </table>
      </template>
    </section>

    <footer class="colophon">
      <p v-for="p in h.colophon" :key="p">{{ p }}</p>
    </footer>
  </article>
</template>
