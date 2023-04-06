<template>
  <div
    v-show="isShown"
    ref="contextMenuRef"
    class="context-menu"
    :style="{
      top: top + 'px',
      left: left + 'px',
    }"
    @contextmenu="event => event.preventDefault()"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    isShown?: boolean
  }>(),
  {
    isShown: false,
  },
)

const emit = defineEmits<{
  (event: 'update:is-shown', payload: boolean): void
}>()

const contextMenuRef = ref<HTMLElement | null>(null)

const top = ref(0)
const left = ref(0)

const getMousePosition = (): Promise<{ x: number; y: number }> => {
  return new Promise(resolve => {
    const listener = (event: MouseEvent) => {
      event.preventDefault()
      window.removeEventListener('mousedown', listener)

      resolve({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener('mousedown', listener)

    contextMenuRef.value?.dispatchEvent(new MouseEvent('click'))
  })
}

watch(
  () => props.isShown,
  async () => {
    if (!props.isShown) return

    const { x, y } = await getMousePosition()
    top.value = y
    left.value = x
  },
)

onMounted(() => {
  if (!contextMenuRef.value) return

  onClickOutside(contextMenuRef, () => {
    if (!props.isShown) return

    emit('update:is-shown', false)
  })
})
</script>

<style lang="scss" scoped>
.context-menu {
  border-radius: toRem(8);
  background-color: var(--lib-background-primary);
  box-shadow: 0 toRem(4) toRem(11) rgba(var(--drop-down-shadow-rgb), 0.25);
  position: fixed;
}
</style>
