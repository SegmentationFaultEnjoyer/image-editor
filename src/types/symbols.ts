import type { InjectionKey } from 'vue'
import type { UseImageEditor } from '@/types'

export const EditorInstanceKey: InjectionKey<{
  instance: UseImageEditor
}> = Symbol('image-editor')
