import '@/styles/variables.scss'
import '@static/branding/fonts/index.css'
import '@/styles/fonts.scss'

import type { App, Plugin } from 'vue'
import ImageEditor from '@/components/ImageEditor.vue'
import { useImageEditor } from '@/composables'
import { EditorInstanceKey, type UseImageEditor } from '@/types'

export default {
  install: (app: App) => {
    app.component('image-editor', ImageEditor)
    app.provide('use-image-editor', useImageEditor)
    app.provide('editor-injection-key', EditorInstanceKey)
  },
} as Plugin

export { ImageEditor, useImageEditor, EditorInstanceKey, UseImageEditor }
