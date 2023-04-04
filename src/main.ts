import '@/styles/app.scss'

import type { App, Plugin } from 'vue'
import { SelectField } from '@/fields'

export default {
  install: (app: App) => {
    app.component('select-field', SelectField)
  },
} as Plugin

export { SelectField }
