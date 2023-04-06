<template>
  <div class="image-editor">
    <loader v-if="!isEditorInitialized" />

    <div
      class="image-editor__editor"
      :class="{
        'image-editor__editor--hidden': !isEditorInitialized || isInitFailed,
      }"
    >
      <div ref="editorContainerRef" class="image-editor__canvas-wrapper">
        <canvas ref="editorCanvasRef" class="image-editor__canvas" />
      </div>
      <image-editor-tool-kit v-if="isEditorInitialized && !isInitFailed" />
    </div>

    <error-message
      v-if="isInitFailed"
      :title="'Error'"
      :message="errorMsg"
      :icon-name="ICON_NAMES.photograph"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, type Ref, defineExpose } from 'vue'
import { Loader, ErrorMessage } from '@/common'
import { useImageEditor } from '@/composables'
import { ImageEditorToolKit } from '@/components'
import { EditorInstanceKey, type UseImageEditor } from '@/types'

import { ICON_NAMES } from '@/enums'

type ExposedEditorInstance = {
  editorInstance: Ref<UseImageEditor | undefined>
}

const props = withDefaults(
  defineProps<{
    imageUrl?: string
  }>(),
  {
    imageUrl: '/default-cover.png',
  },
)

const isEditorInitialized = ref(false)
const isInitFailed = ref(false)
const errorMsg = ref('')
const editorContainerRef = ref<HTMLElement | null>(null)
const editorCanvasRef = ref<HTMLCanvasElement | null>(null)

const exposedEditorInstance = ref<UseImageEditor>()

defineExpose<ExposedEditorInstance>({
  editorInstance: exposedEditorInstance,
})

onMounted(async () => {
  if (!editorCanvasRef.value || !editorContainerRef.value) return

  const editorInstance = useImageEditor(
    editorCanvasRef as Ref<HTMLCanvasElement>,
    editorContainerRef as Ref<HTMLElement>,
  )

  // providing canvas instance to all nested layers to avoid props drilling
  provide(EditorInstanceKey, { instance: editorInstance })
  exposedEditorInstance.value = editorInstance

  try {
    await editorInstance.init(props.imageUrl)
  } catch (error) {
    isInitFailed.value = true

    if (error instanceof Error) errorMsg.value = error.message
  }

  isEditorInitialized.value = true
})
</script>

<style scoped lang="scss">
.image-editor {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: toRem(20) 0;
  gap: toRem(20);
  background-color: var(--lib-background-quaternary);
  padding: toRem(20);
}

.image-editor__editor {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(65%, 1fr) minmax(toRem(150), toRem(300));

  &--hidden {
    visibility: hidden;
    position: absolute;
  }
}

.image-editor__canvas-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: toRem(8);
  width: 100%;
  overflow-y: auto;
  min-height: toRem(700);
  padding: toRem(40);
  background-color: var(--lib-editor-background);
  position: static;

  @include respond-to(small) {
    padding: toRem(20) 0;
    min-height: vh(65);
  }
}
</style>
