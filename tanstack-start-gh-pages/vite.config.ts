import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

const BASE = process.env.BASE_PATH || '/tanstack-start-gh-pages/'

const config = defineConfig({
  base: BASE,
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      client: { base: BASE },
      spa: {
        enabled: true,
        prerender: {
          crawlLinks: true,
          autoSubfolderIndex: true,
        },
      },
    }),
    viteReact(),
  ],
})

export default config