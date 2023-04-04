<template>
  <div class="loader">
    <component :is="loader" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Spinner } from '@/common/loader'

type SCHEME = 'spinner' | 'default'

const props = withDefaults(
  defineProps<{
    scheme?: SCHEME
  }>(),
  {
    scheme: 'spinner',
  },
)

const loader = computed(() => {
  switch (props.scheme) {
    case 'spinner':
    default:
      return Spinner
  }
})
</script>

<style lang="scss" scoped>
.loader {
  display: grid;
  place-items: center;
}
</style>
