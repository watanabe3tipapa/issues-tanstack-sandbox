import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'

const base = process.env.BASE_PATH || '/'
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const config = defineConfig({
  base,
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      client: { base },
      ...(isStaticExport
        ? {
            spa: {
              enabled: true,
              prerender: {
                crawlLinks: true,
              },
            },
          }
        : {}),
    }),
    viteReact(),
  ],
})

export default config