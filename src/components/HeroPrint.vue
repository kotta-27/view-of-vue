<script setup lang="ts">
import { computed, ref } from 'vue'

const peak = ref(250)
const sun = ref(32)

const HORIZON = 372
const LOGO_W = 261.76
const LOGO_H = 226.69
const OUTER = 'M161.096.001l-30.225 52.351L100.647.001H-.005l130.876 226.688L261.749.001z'
const INNER = 'M161.096.001l-30.225 52.351L100.647.001H52.346l78.526 136.01L209.398.001z'

const sx = 520 / LOGO_W
const x = 600 - 260
const sy = computed(() => peak.value / LOGO_H)

const sunX = computed(() => 170 + (sun.value / 100) * 860)
const sunY = computed(() => HORIZON - 40 - Math.sin((sun.value / 100) * Math.PI) * 230)
const sunR = 44

const reduced =
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
</script>

<template>
  <figure class="hero-print">
    <svg viewBox="0 0 1200 660" role="img" aria-label="山と、その水面への映り。映った像は Vue のロゴの形になる">
      <defs>
        <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#1c3f66" />
          <stop offset=".2" stop-color="#3a6f96" />
          <stop offset=".52" stop-color="#eadfc6" />
          <stop offset="1" stop-color="#f1e7d3" />
        </linearGradient>
        <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stop-color="#2d6c8f" />
          <stop offset=".55" stop-color="#1c3f66" />
          <stop offset="1" stop-color="#10263f" />
        </linearGradient>
        <linearGradient id="slope" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stop-color="#f1e7d3" />
          <stop offset=".24" stop-color="#b7d9c4" />
          <stop offset=".46" stop-color="#42b883" />
          <stop offset="1" stop-color="#1f7a5a" />
        </linearGradient>
        <linearGradient id="core" x1="0" x2="0" y1="1" y2="0">
          <stop offset="0" stop-color="#35495e" />
          <stop offset="1" stop-color="#10263f" />
        </linearGradient>
        <filter id="ripple" x="-5%" y="-5%" width="110%" height="115%">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.09" numOctaves="2" seed="4" result="n">
            <animate
              v-if="!reduced"
              attributeName="baseFrequency"
              dur="14s"
              values="0.006 0.09;0.009 0.12;0.006 0.09"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="waves" width="96" height="36" patternUnits="userSpaceOnUse">
          <path d="M0 26 C 16 8, 32 8, 48 26 S 80 44, 96 26" fill="none" stroke="#f1e7d3" stroke-opacity=".16" stroke-width="1.6" />
        </pattern>
      </defs>

      <rect width="1200" :height="HORIZON" fill="url(#sky)" />
      <circle :cx="sunX" :cy="sunY" :r="sunR" fill="#c43d2b" />
      <g fill="#f1e7d3" opacity=".82">
        <rect x="60" y="214" width="290" height="11" rx="5.5" />
        <rect x="120" y="234" width="170" height="8" rx="4" />
        <rect x="890" y="150" width="250" height="11" rx="5.5" />
        <rect x="830" y="171" width="150" height="8" rx="4" />
      </g>

      <g :transform="`translate(${x} ${HORIZON}) scale(${sx} ${-sy})`">
        <path :d="OUTER" fill="url(#slope)" />
        <path :d="INNER" fill="url(#core)" />
      </g>

      <rect y="372" width="1200" height="288" fill="url(#water)" />
      <g filter="url(#ripple)">
        <circle :cx="sunX" :cy="2 * HORIZON - sunY" :r="sunR" fill="#c43d2b" opacity=".75" />
        <g :transform="`translate(${x} ${HORIZON}) scale(${sx} ${sy})`">
          <path :d="OUTER" fill="#42b883" />
          <path :d="INNER" fill="#35495e" />
        </g>
      </g>
      <rect y="372" width="1200" height="288" fill="url(#waves)" />
      <rect y="370" width="1200" height="3" fill="#f1e7d3" opacity=".55" />
    </svg>

    <figcaption class="hero-controls">
      <label class="dial">
        <code>peak = ref({{ peak }})</code>
        <input v-model.number="peak" type="range" min="120" max="288" aria-label="山の高さ" />
      </label>
      <label class="dial">
        <code>sun = ref({{ sun }})</code>
        <input v-model.number="sun" type="range" min="0" max="100" aria-label="太陽の位置" />
      </label>
      <p class="hero-law"><code>view = f(state)</code></p>
    </figcaption>
  </figure>
</template>
