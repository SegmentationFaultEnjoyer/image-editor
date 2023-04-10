<template>
  <section class="history-tool">
    <editor-button
      modifications="no-icon"
      scheme="reset"
      size="x-medium"
      :text="'Remove all'"
      @click="deleteObjects(true)"
    />
    <div class="history-tool__actions">
      <editor-button
        size="x-medium"
        :icon-name="ICON_NAMES.undo"
        @click="undo"
      />
      <editor-button
        size="x-medium"
        :icon-name="ICON_NAMES.redo"
        @click="redo"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { EditorButton } from '@/common'
import { ICON_NAMES } from '@/enums'
import { safeInject } from '@/helpers'
import { EditorInstanceKey } from '@/types'

const {
  instance: { undo, redo, deleteObjects },
} = safeInject(EditorInstanceKey)
</script>

<style lang="scss" scoped>
.history-tool {
  display: flex;
  justify-content: space-between;
  flex-flow: row wrap;
  gap: toRem(10);
}

.history-tool__actions {
  display: flex;
  gap: toRem(8);
}
</style>
