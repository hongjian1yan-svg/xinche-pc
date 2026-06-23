import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [vue(), viteSingleFile()],
  base: './',
  build: {
    target: 'es2015',
    rollupOptions: {
      output: {
        format: 'iife',
        name: 'app',
        inlineDynamicImports: true,
      }
    }
  }
})
