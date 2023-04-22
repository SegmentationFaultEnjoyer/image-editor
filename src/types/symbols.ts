import type { InjectionKey, Ref } from 'vue'
import type { DefaultObjectParams, UseImageEditor } from '@/types'

export const EditorInstanceKey: InjectionKey<{
  instance: UseImageEditor
}> = Symbol('image-editor')

export const DefaultParamsKey: InjectionKey<{
  params: Ref<DefaultObjectParams>
}> = Symbol('default-params')
