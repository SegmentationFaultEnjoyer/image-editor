<template>
  <aside v-bind="$attrs" class="image-editor-tool-kit">
    <tools-switcher v-model="currentMode" />

    <hr class="image-editor-tool-kit__divider" />

    <layering-tool />

    <transition name="tool-switch" mode="out-in">
      <component :is="tool" />
    </transition>

    <color-tool
      v-if="currentMode !== TOOL_MODS.drawing"
      :disabled-color-types="disabledColorTools"
    />
    <zoom-tool />
    <history-tool class="image-editor-tool-kit__history" />

    <context-menu v-model:is-shown="contextMenuState.isShown">
      <ul class="image-editor-tool-kit__context-menu">
        <template v-if="contextMenuState.target">
          <li
            class="image-editor-tool-kit__context-menu-item"
            @click="bringToFrontClick"
          >
            {{ 'Bring to front' }}
          </li>
          <li
            class="image-editor-tool-kit__context-menu-item"
            @click="sendToBackClick"
          >
            {{ 'Send to back' }}
          </li>
          <li
            class="image-editor-tool-kit__context-menu-item"
            @click="copyClick"
          >
            {{ 'Copy object' }}
          </li>
        </template>
        <li
          class="image-editor-tool-kit__context-menu-item"
          @click="pasteClick"
        >
          {{ 'Paste object' }}
        </li>
      </ul>
    </context-menu>
  </aside>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, computed, provide } from 'vue'

import { ContextMenu } from '@/common'

import {
  EditorInstanceKey,
  type DefaultObjectParams,
  DefaultParamsKey,
} from '@/types'
import {
  ToolsSwitcher,
  LayeringTool,
  TextTool,
  ColorTool,
  ShapesTool,
  DrawingTool,
  HistoryTool,
  ZoomTool,
} from '@/components'
import { safeInject } from '@/helpers'
import { TOOL_MODS } from '@/enums'

const defaultParams = ref<DefaultObjectParams>({
  fill: '#000000',
  background: '#77f',
  strokeColor: '#000000',
  strokeWidth: 0,
})

provide(DefaultParamsKey, {
  params: defaultParams,
})

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
    case TOOL_MODS.text:
    default:
      return []
  }
})

const {
  instance: {
    unmountCleanUp,
    contextMenuState,
    bringToFront,
    sendToBack,
    copyObjectToClipboard,
    pasteObjectFromClipboard,
  },
} = safeInject(EditorInstanceKey)

const bringToFrontClick = () => {
  bringToFront()
  contextMenuState.value.isShown = false
}

const sendToBackClick = () => {
  sendToBack()
  contextMenuState.value.isShown = false
}

const copyClick = () => {
  copyObjectToClipboard()
  contextMenuState.value.isShown = false
}

const pasteClick = () => {
  pasteObjectFromClipboard()
  contextMenuState.value.isShown = false
}

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
}

.image-editor-tool-kit__divider {
  background-color: var(--lib-border-primary-main);
  height: toRem(1);
  width: 100%;
  border: none;
}

.image-editor-tool-kit__history {
  margin-top: auto;
}

.tool-switch-enter-active,
.tool-switch-leave-active {
  transition: opacity 0.25s ease-in-out;
}

.tool-switch-enter-from,
.tool-switch-leave-to {
  opacity: 0;
}

.image-editor-tool-kit__context-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: toRem(8);
}

.image-editor-tool-kit__context-menu-item {
  transition: 0.2s ease-in-out;
  transition-property: background-color;
  background-color: var(--lib-background-primary);
  color: var(--lib-text-primary-main);
  padding: toRem(10) toRem(15);
  font-weight: 400;
  font-size: toRem(15);

  &:first-child:last-child {
    border-radius: toRem(8);
  }

  &:first-child {
    border-radius: toRem(8) toRem(8) 0 0;
  }

  &:last-child {
    border-radius: 0 0 toRem(8) toRem(8);
  }

  &:hover {
    cursor: pointer;
    background-color: var(--lib-background-tertiary);
  }
}
</style>
