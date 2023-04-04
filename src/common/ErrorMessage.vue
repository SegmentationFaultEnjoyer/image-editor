<template>
  <div class="error-message">
    <icon class="error-message__icon" :name="iconName" />
    <h4 v-if="title" class="error-message__title">
      {{ title }}
    </h4>
    <h5 class="error-message__message">
      {{ message }}
    </h5>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    title?: string
    message: string
    iconName?: ICON_NAMES
  }>(),
  {
    title: '',
    iconName: ICON_NAMES.exclamationCircle,
  },
)
</script>

<style lang="scss" scoped>
.error-message {
  display: grid;
  place-items: center;
  grid-gap: toRem(12);
}

.error-message__icon {
  color: var(--lib-error-main);
  font-size: toRem(48);
  max-width: toRem(200);
  max-height: toRem(200);
}

.error-message__title,
.error-message__message {
  color: var(--lib-error-main);
}
</style>
