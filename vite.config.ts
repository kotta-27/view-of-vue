import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',
  plugins: [vue()],
  server: { port: 5310, strictPort: true },
  preview: { port: 5311 },
  build: { chunkSizeWarningLimit: 1200 },
  test: { include: ['tests/**/*.test.ts'] },
})
