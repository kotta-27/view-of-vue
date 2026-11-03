import { shallowRef } from 'vue'

type Listener = (value: number) => void

const listeners = new Set<Listener>()

/** 登録中のリスナー数。画面の表示用 */
export const listenerCount = shallowRef(0)

export const bus = {
  add(fn: Listener) {
    listeners.add(fn)
    listenerCount.value = listeners.size
  },
  remove(fn: Listener) {
    listeners.delete(fn)
    listenerCount.value = listeners.size
  },
  emit(value: number) {
    for (const fn of listeners) fn(value)
  },
  clear() {
    listeners.clear()
    listenerCount.value = 0
  },
}
