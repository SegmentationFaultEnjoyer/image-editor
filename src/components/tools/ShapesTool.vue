<template>
  <section class="shapes-tool">
    <p class="shapes-tool__label">
      {{ 'Shape' }}
    </p>
    <div class="shapes-tool__shapes">
      <editor-button
        modifications="first-in-group"
        icon-size="large"
        :icon-name="ICON_NAMES.rectangle"
        @click="addShape(addRectangle)"
      />
      <editor-button
        icon-size="large"
        :icon-name="ICON_NAMES.circle"
        @click="addShape(addCircle)"
      />
      <editor-button
        icon-size="large"
        modifications="last-in-group"
        :icon-name="ICON_NAMES.triangle"
        @click="addShape(addTriangle)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { safeInject } from '@/helpers'
import { EditorButton } from '@/common'
import { ICON_NAMES } from '@/enums'
import { EditorInstanceKey, DefaultParamsKey } from '@/types'
import type { fabric } from 'fabric'

const {
  instance: { addCircle, addRectangle, addTriangle },
} = safeInject(EditorInstanceKey)

const { params } = safeInject(DefaultParamsKey)

const addShape = (addFunc: (options?: fabric.IObjectOptions) => void) => {
  addFunc({
    fill: params.value.fill,
    stroke: params.value.strokeColor as string,
    strokeWidth: params.value.strokeWidth,
  })
}
</script>

<style lang="scss" scoped>
.shapes-tool {
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.shapes-tool__shapes {
  display: flex;
  justify-content: center;

  & > *:nth-child(2) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
}

.shapes-tool__label {
  @include lib-tool-label;
}
</style>
