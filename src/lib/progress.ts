import { computed, ref } from 'vue'

const KEY = 'vov-done'

const load = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

/** 演習に正解した章の識別子 */
export const done = ref(new Set(load()))
export const doneCount = computed(() => done.value.size)

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...done.value]))
  } catch {
    // 保存できない環境では、そのページの間だけ記録する
  }
}

export function markDone(id: string) {
  if (done.value.has(id)) return
  done.value = new Set(done.value).add(id)
  save()
}

export function resetProgress() {
  done.value = new Set()
  save()
}
