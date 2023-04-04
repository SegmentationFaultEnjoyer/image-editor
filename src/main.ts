import '@/styles/app.scss'

import type { App, Plugin } from 'vue'
import ImageEditor from '@/components/ImageEditor.vue'
import { useImageEditor } from '@/composables'

export default {
  install: (app: App) => {
    app.component('image-editor', ImageEditor)
    app.provide('use-image-editor', useImageEditor)
  },
} as Plugin

export { ImageEditor, useImageEditor }
