import { ref } from 'vue'

export const n = ref(0)
export const counts: Record<string, number> = { parent: 0, child: 0 }
