import '@fontsource/ibm-plex-sans-jp/400.css'
import '@fontsource/ibm-plex-sans-jp/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/700.css'
import './styles/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { applySettings } from './lib/settings'

applySettings()
createApp(App).use(router).mount('#app')
