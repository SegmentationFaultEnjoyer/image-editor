<template>
  <div class="zoom-tool">
    <editor-button
      class="zoom-tool__button"
      scheme="default"
      size="small"
      @click="zoomIn"
    />
    <p>{{ `${(currentZoom * 100).toFixed()}%` }}</p>
    <editor-button
      class="zoom-tool__button"
      scheme="default"
      size="small"
      @click="zoomOut"
    />
    <editor-button
      class="zoom-tool__button"
      scheme="default"
      size="small"
      @click="zoomReset"
    />
  </div>
</template>

<script setup lang="ts">
// TODO style this componnent
import { EditorButton } from '@/common'
import { EditorInstanceKey } from '@/types'
import { safeInject } from '@/helpers'

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
  if (currentZoom.value > 3) return

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
  align-items: center;
  flex-direction: column;
  gap: toRem(10);
  background-color: var(--background-primary);
  border-radius: toRem(8);
  padding: toRem(10);
  border: toRem(1) dashed var(--primary-main);

  @include respond-to(medium) {
    flex-direction: row;
  }
}

.zoom-tool__button {
  aspect-ratio: 1 / 1;

  --app-button-bg-hover: var(--primary-light);
  --app-button-border-hover: var(--primary-main);

  &:hover {
    cursor: pointer;
  }
}
</style>
