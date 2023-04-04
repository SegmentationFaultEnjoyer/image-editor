<template>
  <div class="layering-tool">
    <p class="layering-tool__label">
      {{ 'Layer' }}
    </p>
    <section class="layering-tool__layers-wrapper">
      <div class="layering-tool__layers">
        <editor-button
          size="x-medium"
          modifications="first-in-group"
          :icon-name="ICON_NAMES.frontLayer"
          @click="bringToFront()"
        />
        <editor-button
          size="x-medium"
          modifications="last-in-group"
          :icon-name="ICON_NAMES.backLayer"
          @click="sendToBack()"
        />
      </div>
      <editor-button
        size="small"
        :icon-name="ICON_NAMES.trash"
        @click="deleteObjects()"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { EditorButton } from '@/common'
import { EditorInstanceKey } from '@/types'
import { safeInject } from '@/helpers'
import { ICON_NAMES } from '@/enums'

const {
  instance: { bringToFront, sendToBack, deleteObjects },
} = safeInject(EditorInstanceKey)
</script>

<style scoped lang="scss">
.layering-tool {
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.layering-tool__layers-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layering-tool__layers {
  display: flex;

  & > *:first-child {
    border-right: none;
  }
}

.layering-tool__label {
  @include lib-tool-label;
}
</style>
