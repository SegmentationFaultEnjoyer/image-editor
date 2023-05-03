<template>
  <button v-bind="$attrs" :class="buttonClasses" :type="type">
    <div v-if="modifications !== 'no-icon'" class="editor-button__icon-wrapper">
      <icon :class="iconClasses" :name="iconName" />
    </div>

    <span v-if="text" :class="textClasses">
      {{ text }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useAttrs, computed } from 'vue'
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'

type Size = 'x-small' | 'small' | 'x-medium' | 'medium' | 'large' | 'full'
type IconSize = 'small' | 'medium' | 'large'
type TextSize = 'medium' | 'x-medium'
type Modification = 'first-in-group' | 'last-in-group' | 'default' | 'no-icon'
type ButtonType = 'submit' | 'reset' | 'button'
type Scheme = 'reset' | 'default'

const props = withDefaults(
  defineProps<{
    iconName?: ICON_NAMES
    size?: Size
    text?: string
    textSize?: TextSize
    iconSize?: IconSize
    scheme?: Scheme
    modifications?: Modification
    type?: ButtonType
  }>(),
  {
    iconName: ICON_NAMES.text,
    size: 'medium',
    iconSize: 'medium',
    modifications: 'default',
    type: 'button',
    text: '',
    textSize: 'medium',
    scheme: 'default',
  },
)

const attrs = useAttrs()

const isDisabled = computed((): boolean =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const iconClasses = computed(() => [
  'editor-button__icon',
  `editor-button__icon--${props.iconSize}`,
])

const textClasses = computed(() => [
  'editor-button__text',
  `editor-button__text--${props.textSize}`,
])

const buttonClasses = computed(() =>
  [
    'editor-button',
    `editor-button--${props.modifications}`,
    `editor-button--${props.size}`,
    `editor-button--${props.scheme}`,
    ...(isDisabled.value ? ['editor-button--disabled'] : []),
  ].join(' '),
)
</script>

<style scoped lang="scss">
.editor-button {
  border-radius: toRem(8);
  background-color: var(--lib-editor-background);
  border: toRem(1) solid var(--lib-border-primary-main);
  display: flex;
  justify-content: center;
  align-items: center;
  height: toRem(40);
  gap: toRem(10);
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

  &--full {
    width: 100%;
  }

  &--medium {
    width: toRem(70);
    height: toRem(48);
  }

  &--x-medium {
    width: toRem(59);
  }

  &--small {
    width: toRem(45);
  }

  &--x-small {
    width: toRem(36);
  }

  &--first-in-group {
    border-radius: toRem(8) 0 0 toRem(8);
  }

  &--last-in-group {
    border-radius: 0 toRem(8) toRem(8) 0;
  }

  &--reset {
    border: toRem(1) solid var(--lib-error-main);
  }

  &--no-icon {
    width: max-content;
    padding: toRem(8) toRem(12);

    &:hover {
      cursor: pointer;
      background-color: var(--lib-background-quaternary);
    }
  }
}

.editor-button__text {
  font-weight: 400;
  font-size: toRem(12);
  line-height: 110%;
  color: var(--lib-text-primary-invert-main);

  .editor-button--reset & {
    color: var(--lib-error-main);
  }

  &--medium {
    font-size: toRem(12);
  }

  &--x-medium {
    font-size: toRem(14);
  }
}

.editor-button__icon-wrapper {
  display: grid;
  place-content: center;
}

.editor-button__icon {
  max-width: var(--icon-size);
  max-height: var(--icon-size);
  color: var(--lib-background-tertiary);

  &--medium {
    --icon-size: #{toRem(20)};
  }

  &--large {
    --icon-size: #{toRem(25)};
  }
}
</style>
