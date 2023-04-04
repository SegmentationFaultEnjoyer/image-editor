<template>
  <div class="image-editor">
    <loader v-if="!isEditorInitialized" />

    <div
      ref="editorContainerRef"
      class="image-editor__canvas-wrapper"
      :class="{
        'image-editor__canvas-wrapper--hidden':
          !isEditorInitialized || isInitFailed,
      }"
    >
      <canvas ref="editorCanvasRef" class="image-editor__canvas" />
    </div>
    <image-editor-tool-kit v-if="isEditorInitialized && !isInitFailed" />

    <error-message
      v-if="isInitFailed"
      :title="'Error'"
      :message="errorMsg"
      :icon-name="ICON_NAMES.photograph"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, type Ref } from 'vue'
import { Loader, ErrorMessage } from '@/common'
import { useImageEditor } from '@/composables'
import { ImageEditorToolKit } from '@/components'
import { EditorInstanceKey } from '@/types'

import { ICON_NAMES } from '@/enums'

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

onMounted(async () => {
  if (!editorCanvasRef.value || !editorContainerRef.value) return

  const editorInstance = useImageEditor(
    editorCanvasRef as Ref<HTMLCanvasElement>,
    editorContainerRef as Ref<HTMLElement>,
  )

  // providing canvas instance to all nested layers to avoid props drilling
  provide(EditorInstanceKey, { instance: editorInstance })

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
  align-items: center;
  justify-content: center;
  padding: toRem(20) 0;
  gap: toRem(20);
  border: toRem(1) solid var(--primary-main);

  @include respond-to(medium) {
    flex-direction: column-reverse;
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
  background-color: var(--primary-light);
  position: static;

  &--hidden {
    visibility: hidden;
    position: absolute;
  }

  @include respond-to(small) {
    padding: toRem(20) 0;
    min-height: vh(65);
  }
}

.image-editor__canvas {
  border: toRem(1) dashed rgba(0, 0, 0, 0.2);
}
</style>
