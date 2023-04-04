<template>
  <button v-bind="$attrs" :class="buttonClasses" :type="type">
    <icon class="editor-button__icon" :name="iconName" />
  </button>
</template>

<script setup lang="ts">
import { useAttrs, computed } from 'vue'
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

type Size = 'small' | 'x-medium' | 'medium' | 'large'
type Modification = 'first-in-group' | 'last-in-group' | 'default'
type ButtonType = 'submit' | 'reset' | 'button'

const props = withDefaults(
  defineProps<{
    iconName?: ICON_NAMES
    size?: Size
    modifications?: Modification
    type?: ButtonType
  }>(),
  {
    iconName: ICON_NAMES.text,
    size: 'medium',
    modifications: 'default',
    type: 'button',
  },
)

const attrs = useAttrs()

const isDisabled = computed((): boolean =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const buttonClasses = computed(() =>
  [
    'editor-button',
    `editor-button--${props.modifications}`,
    `editor-button--${props.size}`,
    ...(isDisabled.value ? ['editor-button--disabled'] : []),
  ].join(' '),
)
</script>

<style scoped lang="scss">
.editor-button {
  border-radius: toRem(8);
  background-color: var(--lib-editor-background);
  border: toRem(1) solid var(--lib-border-primary-main);
  display: grid;
  place-content: center;
  transition: 0.2s ease-in-out;
  transition-property: background-color;

  &:hover {
    cursor: pointer;
    background-color: var(--lib-primary-main);
  }

  &[active='true'] {
    background-color: var(--lib-primary-main);
  }

  &:disabled,
  &--disabled {
    cursor: not-allowed;
    pointer-events: none;
    filter: grayscale(0.75);
    opacity: 0.5;
  }

  &--medium {
    width: toRem(70);
    height: toRem(48);
  }

  &--x-medium {
    width: toRem(59);
    height: toRem(40);
  }

  &--small {
    width: toRem(45);
    height: toRem(40);
  }

  &--first-in-group {
    border-radius: toRem(8) 0 0 toRem(8);
  }

  &--last-in-group {
    border-radius: 0 toRem(8) toRem(8) 0;
  }
}

.editor-button__icon {
  --icon-size: #{toRem(20)};

  max-width: var(--icon-size);
  max-height: var(--icon-size);
  color: var(--lib-background-tertiary);
}
</style>
