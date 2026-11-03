import { createRouter, createWebHashHistory } from 'vue-router'
import { CHAPTERS } from './lib/chapters'
import { pick } from './lib/settings'
import Home from './views/HomeView.vue'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/ref-effect', component: () => import('./views/RefEffectView.vue') },
    { path: '/reactive', component: () => import('./views/ReactiveView.vue') },
    { path: '/computed', component: () => import('./views/ComputedView.vue') },
    { path: '/scheduler', component: () => import('./views/SchedulerView.vue') },
    { path: '/compiler', component: () => import('./views/CompilerView.vue') },
    { path: '/keyed-diff', component: () => import('./views/KeyedDiffView.vue') },
    { path: '/lifecycle', component: () => import('./views/LifecycleView.vue') },
    { path: '/props-emits', component: () => import('./views/PropsEmitsView.vue') },
    { path: '/provide-inject', component: () => import('./views/ProvideInjectView.vue') },
    { path: '/slots', component: () => import('./views/SlotsView.vue') },
    { path: '/watch', component: () => import('./views/WatchView.vue') },
    { path: '/composables', component: () => import('./views/ComposablesView.vue') },
    ...CHAPTERS.filter(c => typeof c.no === 'string' || c.no > 12).map(c => ({
      path: c.path,
      component: () => import('./views/GuideView.vue'),
      props: { no: c.no },
    })),
    { path: '/cheatsheet', component: () => import('./views/CheatsheetView.vue') },
    { path: '/pitfalls', component: () => import('./views/PitfallsView.vue') },
    { path: '/playground', component: () => import('./views/PlaygroundView.vue') },
    { path: '/glossary', component: () => import('./views/GlossaryView.vue') },
    { path: '/:rest(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach(to => {
  const chapter = CHAPTERS.find(c => c.path === to.path)
  document.title = chapter ? `${pick(chapter.title)} | View of Vue` : 'View of Vue'
})
