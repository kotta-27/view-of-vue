import { computed, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const SPEEDS = [1400, 800, 350] as const

export function useStepper<T>(frames: Ref<T[]>) {
  const cursor = ref(0)
  const playing = ref(false)
  const speed = ref(1)
  let timer: ReturnType<typeof setTimeout> | undefined

  const current = computed<T | undefined>(() => frames.value[cursor.value])
  const atEnd = computed(() => cursor.value >= frames.value.length - 1)

  function pause() {
    playing.value = false
    clearTimeout(timer)
  }

  function tick() {
    if (atEnd.value) {
      pause()
      return
    }
    cursor.value++
    timer = setTimeout(tick, SPEEDS[speed.value])
  }

  function play() {
    if (playing.value) return
    if (atEnd.value) cursor.value = 0
    playing.value = true
    timer = setTimeout(tick, SPEEDS[speed.value])
  }

  function next() {
    pause()
    if (!atEnd.value) cursor.value++
  }

  function prev() {
    pause()
    if (cursor.value > 0) cursor.value--
  }

  function seek(i: number) {
    pause()
    cursor.value = i
  }

  /** frames を差し替えた直後に呼ぶ */
  function restart(auto = true) {
    pause()
    cursor.value = 0
    if (auto) play()
  }

  function onKey(e: KeyboardEvent) {
    const el = e.target as HTMLElement
    if (el.matches('input, textarea, select')) return
    if (e.key === 'ArrowRight') next()
    if (e.key === 'ArrowLeft') prev()
  }

  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => {
    pause()
    window.removeEventListener('keydown', onKey)
  })

  return { cursor, playing, speed, current, atEnd, play, pause, next, prev, seek, restart }
}

export type Stepper = ReturnType<typeof useStepper>
