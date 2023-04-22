<template>
  <div class="zoom-tool">
    <p class="zoom-tool__label">
      {{ 'Zoom' }}
    </p>
    <div class="zoom-tool__wrapper">
      <div class="zoom-tool__zoom">
        <editor-button
          class="zoom-tool__button"
          scheme="default"
          size="small"
          :disabled="currentZoom >= MAX_ZOOM"
          :icon-name="ICON_NAMES.zoomPlus"
          @click="zoomIn"
        />
        <p class="zoom-tool__current-zoom">
          {{ `${(currentZoom * 100).toFixed()}%` }}
        </p>
        <editor-button
          class="zoom-tool__button"
          scheme="default"
          size="small"
          :disabled="currentZoom <= MIN_ZOOM"
          :icon-name="ICON_NAMES.zoomMinus"
          @click="zoomOut"
        />
      </div>

      <editor-button
        class="zoom-tool__button"
        scheme="default"
        size="small"
        modifications="no-icon"
        :text="'reset'"
        @click="zoomReset"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// TODO style this componnent
import { EditorButton } from '@/common'
import { EditorInstanceKey } from '@/types'
import { safeInject } from '@/helpers'
import { ICON_NAMES } from '@/enums'

const MAX_ZOOM = 3
const MIN_ZOOM = 1

const props = withDefaults(
  defineProps<{
    zoomStep?: number
  }>(),
  {
    zoomStep: 0.1,
  },
)

const {
  instance: { zoom, currentZoom },
} = safeInject(EditorInstanceKey)

const zoomIn = () => {
  if (currentZoom.value > MAX_ZOOM) return

  const newZoom = parseFloat((currentZoom.value + props.zoomStep).toFixed(1))

  zoom('zoom', newZoom)
}

const zoomOut = () => {
  if (currentZoom.value <= 1) return

  const newZoom = parseFloat((currentZoom.value - props.zoomStep).toFixed(1))

  zoom('zoom', newZoom)
}

const zoomReset = () => {
  zoom('reset')
}
</script>

<style lang="scss" scoped>
.zoom-tool {
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.zoom-tool__wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-flow: row wrap;
  gap: toRem(10);
}

.zoom-tool__zoom {
  display: flex;
  align-items: center;
  gap: toRem(10);
}

.zoom-tool__current-zoom {
  color: var(--lib-text-primary-invert-main);
  font-weight: 400;
  font-size: toRem(14);
}

.zoom-tool__button {
  text-transform: uppercase;
}

.zoom-tool__label {
  @include lib-tool-label;
}
</style>
