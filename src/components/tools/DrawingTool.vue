<template>
  <section class="drawing-tool">
    <p class="drawing-tool__label">
      {{ 'Brush' }}
    </p>
    <div class="drawing-tool__brushes">
      <editor-button
        modifications="first-in-group"
        :active="currentBrush === BRUSHES.pencil"
        :icon-name="ICON_NAMES.pencil"
        @click="pickPencil"
      />
      <editor-button
        :active="currentBrush === BRUSHES.circle"
        :icon-name="ICON_NAMES.brush"
        @click="pickCircleBrush"
      />
      <editor-button
        :active="currentBrush === BRUSHES.spray"
        modifications="last-in-group"
        :icon-name="ICON_NAMES.spray"
        @click="pickSpray"
      />
    </div>
    <div class="drawing-tool__settings">
      <p class="drawing-tool__label">
        {{ 'Settings' }}
      </p>
      <color-field v-model="brushColor" :label="'Brush color'" />
      <range-field
        v-model="brushSize"
        :min="MIN_BRUSH_SIZE"
        :max="MAX_BRUSH_SIZE"
        :label="'Brush width'"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'
import { EditorButton } from '@/common'
import { ICON_NAMES } from '@/enums'
import { safeInject } from '@/helpers'
import { BRUSHES, EditorInstanceKey } from '@/types'
import { RangeField, ColorField } from '@/fields'

const MIN_BRUSH_SIZE = 1
const MAX_BRUSH_SIZE = 20
const DEFAULT_BRUSH_SIZE = 5
const DEFAULT_BRUSH_COLOR = '#00000'

const isDrawing = ref(false)
const currentBrush = ref<BRUSHES>()
const brushColor = ref(DEFAULT_BRUSH_COLOR)
const brushSize = ref(DEFAULT_BRUSH_SIZE)

const {
  instance: { startDraw, modifyBrush, stopDraw, setStroke, setColor },
} = safeInject(EditorInstanceKey)

const stopDrawingMode = () => {
  if (!isDrawing.value) return

  stopDraw()
  isDrawing.value = false
  currentBrush.value = undefined
}

const startDrawindMode = (brush: BRUSHES) => {
  if (currentBrush.value === brush) {
    stopDrawingMode()
    return
  }

  isDrawing.value = true
  currentBrush.value = brush

  startDraw(brush, {
    color: brushColor.value,
    width: brushSize.value,
  })
}

const pickPencil = () => {
  startDrawindMode(BRUSHES.pencil)
}

const pickSpray = () => {
  startDrawindMode(BRUSHES.spray)
}

const pickCircleBrush = () => {
  startDrawindMode(BRUSHES.circle)
}

watch(brushSize, () => {
  modifyBrush({
    width: brushSize.value,
  })
  setStroke({
    strokeWidth: brushSize.value,
  })
})

watch(brushColor, () => {
  modifyBrush({
    color: brushColor.value,
  })
  setColor(brushColor.value)
})

onBeforeUnmount(() => {
  stopDrawingMode()
})
</script>

<style lang="scss" scoped>
.drawing-tool {
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.drawing-tool__settings {
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.drawing-tool__brushes {
  display: flex;
  justify-content: center;
  margin-bottom: toRem(10);

  & > *:nth-child(2) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}

.drawing-tool__label {
  @include lib-tool-label;
}
</style>
