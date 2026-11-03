<script setup lang="ts">
import { computed } from 'vue'
import type { Stepper } from '../composables/useStepper'
import { common } from '../content/common'
import { pick } from '../lib/settings'
import TipHint from './TipHint.vue'

const props = defineProps<{ stepper: Stepper; total: number; note?: string }>()
const s = props.stepper
const t = computed(() => pick(common))

const cursor = computed(() => s.cursor.value)
const playing = computed(() => s.playing.value)
const atEnd = computed(() => s.atEnd.value)
const speed = computed({
  get: () => s.speed.value,
  set: v => {
    s.speed.value = v
  },
})
</script>

<template>
  <div class="stepbar">
    <p class="stepnote" aria-live="polite">{{ note }}</p>
    <div class="stepctl">
      <TipHint :text="t.prevStep"><button class="btn-mini" :disabled="cursor === 0" :aria-label="t.prevStep" @click="s.prev()">◀</button></TipHint>
      <button
        class="btn-mini is-main"
        :disabled="total < 2"
        :aria-label="playing ? t.stop : t.play"
        @click="playing ? s.pause() : s.play()"
      >
        {{ playing ? t.stop : atEnd && total > 1 ? t.replay : t.play }}
      </button>
      <TipHint :text="t.nextStep"><button class="btn-mini" :disabled="atEnd" :aria-label="t.nextStep" @click="s.next()">▶</button></TipHint>
      <span class="stepcount">{{ total ? cursor + 1 : 0 }} / {{ total }}</span>
      <button class="btn-mini" :aria-label="t.changeSpeed" @click="speed = (speed + 1) % 3">
        {{ t.speeds[speed] }}
      </button>
    </div>
  </div>
</template>
