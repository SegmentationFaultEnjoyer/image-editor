import '@/styles/app.scss'

import type { App, Plugin } from 'vue'
import ImageEditor from '@/components/ImageEditor.vue'
import { useImageEditor } from '@/composables'
import { EditorInstanceKey } from '@/types'

export default {
  install: (app: App) => {
    app.component('image-editor', ImageEditor)
    app.provide('use-image-editor', useImageEditor)
    app.provide('editor-injection-key', EditorInstanceKey)
  },
} as Plugin

export { ImageEditor, useImageEditor, EditorInstanceKey }
