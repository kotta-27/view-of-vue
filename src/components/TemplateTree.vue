<script setup lang="ts">
import { computed } from 'vue'
import { pick } from '../lib/settings'
import type { TemplateNode } from '../lib/template'

defineProps<{ nodes: TemplateNode[] }>()
const kinds = computed(() =>
  pick({
    ja: { cached: 'キャッシュ', dynamic: '比較対象', static: '静的', structure: '構造' },
    en: { cached: 'cached', dynamic: 'compared', static: 'static', structure: 'structure' },
  }),
)
</script>

<template>
  <ul class="ttree">
    <li v-for="(n, i) in nodes" :key="i">
      <div class="tnode" :class="`is-${n.kind}`">
        <code>{{ n.label }}</code>
        <span class="tkind">{{ kinds[n.kind] }}</span>
        <span v-if="n.flag && n.flag > 0" class="tflag">{{ n.flag }} {{ n.flags.join(' | ') }}</span>
      </div>
      <TemplateTree v-if="n.children.length" :nodes="n.children" />
    </li>
  </ul>
</template>
