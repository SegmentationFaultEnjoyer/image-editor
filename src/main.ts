import type { App, Plugin } from 'vue'
import { Input } from '@/components'

export default {
    install: (app: App) => {
        app.component('Input', Input)
    }
} as Plugin

export { Input }