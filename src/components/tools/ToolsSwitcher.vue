<template>
  <nav class="tools-switcher">
    <editor-button
      :icon-name="ICON_NAMES.text"
      :active="pickedMod === TOOL_MODS.text"
      @click="emit('update:modelValue', TOOL_MODS.text)"
    />
    <editor-button
      :icon-name="ICON_NAMES.shapes"
      :active="pickedMod === TOOL_MODS.shapes"
      @click="emit('update:modelValue', TOOL_MODS.shapes)"
    />
    <editor-button
      :icon-name="ICON_NAMES.brush"
      :active="pickedMod === TOOL_MODS.drawing"
      @click="emit('update:modelValue', TOOL_MODS.drawing)"
    />
  </nav>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue'
import { EditorButton } from '@/common'
import { ICON_NAMES, TOOL_MODS } from '@/enums'
import { safeInject } from '@/helpers'
import { EditorInstanceKey } from '@/types'

const props = withDefaults(
  defineProps<{
    modelValue?: TOOL_MODS
  }>(),
  {
    modelValue: TOOL_MODS.text,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: TOOL_MODS): void
}>()

const pickedMod = ref<TOOL_MODS>(props.modelValue)

const {
  instance: { activeObject, isShape, isText, isDrawingObject },
} = safeInject(EditorInstanceKey)

watch(activeObject, () => {
  if (!activeObject.value) return

  if (isShape(activeObject.value)) emit('update:modelValue', TOOL_MODS.shapes)
  if (isText(activeObject.value)) emit('update:modelValue', TOOL_MODS.text)
  if (isDrawingObject(activeObject.value))
    emit('update:modelValue', TOOL_MODS.drawing)
})

watch(
  () => props.modelValue,
  () => {
    pickedMod.value = props.modelValue
  },
)
</script>

<style scoped lang="scss">
.tools-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: toRem(10);
}
</style>
