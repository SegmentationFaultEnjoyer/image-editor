<template>
  <aside v-bind="$attrs" class="image-editor-tool-kit">
    <tools-switcher v-model="currentMode" />
    <hr class="image-editor-tool-kit__divider" />
    <layering-tool />
    <component :is="tool" />
    <color-tool :disabled-color-types="disabledColorTools" />
    <history-tool />
    <!-- HERE WILL BE THE LIST OF COMPONENTS 
            THAT WILL REPRESENT EACH TOOL IN EDITOR-->

    <!-- <context-menu v-model:is-shown="isContextMenuShown">
      <ul class="image-editor-tool-kit__context-menu">
        <li
          class="image-editor-tool-kit__context-menu-item"
          @click="bringToFrontClick"
        >
          {{ $t('image-editor.context-menu.bring-to-front-lbl') }}
        </li>
        <li
          class="image-editor-tool-kit__context-menu-item"
          @click="sendToBackClick"
        >
          {{ $t('image-editor.context-menu.send-to-back-lbl') }}
        </li>
      </ul>
    </context-menu> -->
  </aside>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, computed } from 'vue'

// import { ContextMenu } from '@/common'

import { EditorInstanceKey } from '@/types'
import {
  ToolsSwitcher,
  LayeringTool,
  TextTool,
  ColorTool,
  ShapesTool,
  DrawingTool,
  HistoryTool,
} from '@/components'
import { safeInject } from '@/helpers'
import { TOOL_MODS } from '@/enums'

const currentMode = ref<TOOL_MODS>(TOOL_MODS.text)

const tool = computed(() => {
  switch (currentMode.value) {
    case TOOL_MODS.shapes:
      return ShapesTool
    case TOOL_MODS.drawing:
      return DrawingTool
    case TOOL_MODS.text:
    default:
      return TextTool
  }
})

const disabledColorTools = computed(() => {
  switch (currentMode.value) {
    case TOOL_MODS.shapes:
      return ['background']
    case TOOL_MODS.drawing:
      return ['stroke', 'background']
    case TOOL_MODS.text:
    default:
      return []
  }
})

const {
  instance: { unmountCleanUp },
} = safeInject(EditorInstanceKey)
onBeforeUnmount(() => {
  if (!unmountCleanUp.value) return

  unmountCleanUp.value()
})
</script>
<style scoped lang="scss">
.image-editor-tool-kit {
  display: flex;
  flex-direction: column;
  gap: toRem(15);
  padding: toRem(20);

  & > *:last-child {
    margin-top: auto;
  }
}

.image-editor-tool-kit__divider {
  background-color: var(--lib-border-primary-main);
  height: toRem(1);
  width: 100%;
  border: none;
}

.image-editor-tool-kit__context-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: toRem(8);
}

.image-editor-tool-kit__context-menu-item {
  transition: 0.2 ease-in-out;
  transition-property: background-color;
  background-color: var(--background-primary);
  padding: toRem(10) toRem(15);

  &:first-child {
    border-radius: toRem(8) toRem(8) 0 0;
  }

  &:last-child {
    border-radius: 0 0 toRem(8) toRem(8);
  }

  &:hover {
    cursor: pointer;
    background-color: var(--background-tertiary);
  }
}
</style>
