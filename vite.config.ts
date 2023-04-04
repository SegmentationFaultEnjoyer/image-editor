import { resolve } from 'node:path'
import { realpathSync } from 'node:fs'
import { defineConfig } from 'vite'

import Vue from '@vitejs/plugin-vue'
import scss from 'rollup-plugin-scss'
import checker from 'vite-plugin-checker'
import svgLoader from 'vite-svg-loader';

const appDirectory = realpathSync(process.cwd())
const resolveApp = (relative: string) => resolve(appDirectory, relative)
const root = resolve(__dirname, resolveApp('src'))

export default defineConfig({
  // If our .vue files have a style, it will be compiled as a single `.css` file under /dist.
  publicDir: 'static',
  plugins: [
    svgLoader({
      defaultImport: 'component',
      svgoConfig: {
        path: resolve(process.cwd(), 'src/assets/icons')
      }
    }),
    Vue({
      include: [/\.vue$/, /\.md$/],
      template: {
        compilerOptions: {
          // Customizing the output of the compiled template
          // to remove whitespace around the template tags
          whitespace: 'condense',
        },
      },
    }),
    scss({
      fileName: 'bundle.css',
      // Process resulting CSS
      processor: (css, map) => ({
        css: css.replace('/*date*/', '/* ' + new Date().toJSON() + ' */'),
        map,
      }),
    }),
    checker({
      overlay: {
        initialIsOpen: false,
      },
      typescript: true,
      eslint: {
        lintCommand: 
          'eslint "{src,config}/**/*.{vue,js,ts}" --cache --max-warnings=0'
      }
    })
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "@/styles/_functions.scss";
          @import "@/styles/_mixins.scss";
        `,
      }
    }
  },
  build: {
    // Output compiled files to /dist.
    outDir: './dist',
    lib: {
      // Set the entry point (file that contains our components exported).
      entry: resolve(__dirname, 'src/main.ts'),
      // Name of the library.
      name: 'fabric-vue-image-editor',
      // We are building for CJS and ESM, use a function to rename automatically files.
      // Example: my-component-library.esm.js
      fileName: format => `${'fabric-vue-image-editor'}.${format}.js`,
    },
    rollupOptions: {
      // Vue is provided by the parent project, don't compile Vue source-code inside our library.
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['vue'],
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    dedupe: ['vue'],
    alias: {
      '@/': `${root}/`,
      '@static': `${root}/../static`,
    },
  },
})
