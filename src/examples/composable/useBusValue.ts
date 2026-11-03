import { onScopeDispose, ref } from 'vue'
import { bus } from './bus'

export function useBusValue(cleanup: boolean) {
  const value = ref(0)
  const listener = (next: number) => {
    value.value = next
  }

  bus.add(listener)

  if (cleanup) {
    onScopeDispose(() => bus.remove(listener))
  }

  return value
}
