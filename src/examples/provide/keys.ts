import { ref, type InjectionKey, type Ref } from 'vue'

export const themeKey: InjectionKey<Ref<string> | string> = Symbol('theme')

export const theme = ref('light')
