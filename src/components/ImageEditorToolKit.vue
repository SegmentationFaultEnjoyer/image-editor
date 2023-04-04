<template>
  <aside class="image-editor-tool-kit">
    <tools-switcher v-model="currentMode" />
    <hr class="image-editor-tool-kit__divider" />
    <layering-tool />
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
import { onBeforeUnmount, ref } from 'vue'

// import { ContextMenu } from '@/common'

import { EditorInstanceKey } from '@/types'
import { ToolsSwitcher, LayeringTool } from '@/components'
import { safeInject } from '@/helpers'
import { TOOL_MODS } from '@/enums'

const currentMode = ref<TOOL_MODS>(TOOL_MODS.text)

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
  width: 40%;
  padding: toRem(20);
  border: 1px solid black;

  // @include respond-to(medium) {
  //   justify-content: center;
  //   align-items: center;
  //   flex-flow: row wrap;
  // }
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
