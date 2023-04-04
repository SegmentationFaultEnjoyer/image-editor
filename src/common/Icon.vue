<template>
  <component class="new-icon" :is="icon" />
</template>

<script setup lang="ts">
import type { ICON_NAMES } from '@/enums'
import { defineAsyncComponent, computed } from 'vue'

const props = defineProps<{
  name: ICON_NAMES
}>()

const icon = computed(() =>
  defineAsyncComponent(() => import(`@/assets/icons/${props.name}-icon.svg`)),
)
</script>

<style scoped lang="scss">
.new-icon {
  display: grid;
  place-items: center;
  pointer-events: none;
  width: 100%;
  height: 100%;
}
</style>
