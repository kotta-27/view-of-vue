import { ref } from 'vue'

export const a = ref(0)
export const b = ref(0)
export const tick = ref(0)
export const label = ref('fixed')

/** Render counts. Not reactive, so counting cannot cause renders */
export const counts: Record<string, number> = { parent: 0, A: 0, B: 0, C: 0 }
