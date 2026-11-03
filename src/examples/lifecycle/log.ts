import {
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  onUnmounted,
  onUpdated,
  shallowRef,
  type Ref,
} from 'vue'

export interface HookEntry {
  who: string
  hook: string
  dom: string
}

/** フックの中で描画に関わる状態を書き換えないよう、表示への反映は flush の後に行う */
export const entries = shallowRef<HookEntry[]>([])
let pending: HookEntry[] = []
let scheduled = false

function record(who: string, hook: string, el: Ref<HTMLElement | null>) {
  pending.push({ who, hook, dom: el.value ? `DOM: ${el.value.textContent?.trim()}` : '' })
  if (scheduled) return
  scheduled = true
  nextTick(() =>
    nextTick(() => {
      scheduled = false
      entries.value = [...entries.value, ...pending]
      pending = []
    }),
  )
}

export function clearEntries() {
  pending = []
  entries.value = []
}

export function useLoggedHooks(who: string, el: Ref<HTMLElement | null>) {
  record(who, 'setup', el)
  onBeforeMount(() => record(who, 'onBeforeMount', el))
  onMounted(() => record(who, 'onMounted', el))
  onBeforeUpdate(() => record(who, 'onBeforeUpdate', el))
  onUpdated(() => record(who, 'onUpdated', el))
  onBeforeUnmount(() => record(who, 'onBeforeUnmount', el))
  onUnmounted(() => record(who, 'onUnmounted', el))
}
