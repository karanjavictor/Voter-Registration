import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import Vuetify from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    Vuetify(),
    ViteFonts({
      fontsource: {
        families: [
          // {
          //   name: 'Roboto',
          //   weights: [100, 300, 400, 500, 700, 900],
          //   styles: ['normal', 'italic'],
          // },
          {
            name: 'Nunito sans',
            weights: [200, 300, 400, 500, 600, 700, 800, 900],
            styles: ['italic', 'normal'],
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
