<template>
  <div class="select-field" :class="selectFieldClasses">
    <label
      v-if="label"
      class="select-field__label"
      :for="`select-field--${uid}`"
    >
      {{ label }}
    </label>
    <div ref="selectElement" class="select-field__select-wrp">
      <button
        type="button"
        class="select-field__select-head"
        @click="toggleDropdown"
      >
        <template v-if="$slots.head">
          <slot
            name="head"
            :select-field="{
              select,
              isOpen: isDropdownOpen,
              close: closeDropdown,
              open: openDropdown,
              toggle: toggleDropdown,
            }"
          />
        </template>
        <template v-else>
          <template v-if="modelValue">
            {{ title }}
          </template>
          <template v-else>
            <span class="select-field__placeholder">
              {{ props.placeholder }}
            </span>
          </template>
        </template>
        <icon
          :class="[
            'select-field__select-head-indicator',
            {
              'select-field__select-head-indicator--open': isDropdownOpen,
            },
          ]"
          :name="ICON_NAMES.chevronDown"
        />
      </button>
      <transition name="select-field__select-dropdown">
        <div v-if="isDropdownOpen" class="select-field__select-dropdown">
          <template v-if="$slots.default">
            <slot
              :select-field="{
                select,
                isOpen: isDropdownOpen,
                close: closeDropdown,
                open: openDropdown,
                toggle: toggleDropdown,
              }"
            />
          </template>
          <template v-else-if="valueOptions.length">
            <button
              :class="[
                'select-field__select-dropdown-item',
                {
                  'select-field__select-dropdown-item--active':
                    modelValue === option.value,
                },
              ]"
              type="button"
              v-for="(option, idx) in valueOptions"
              :key="`[${idx}] ${option.value}`"
              @click="select(option.value)"
            >
              {{ option.label }}
            </button>
          </template>
        </div>
      </transition>
    </div>
    <transition
      name="select-field__err-msg-transition"
      @enter="setHeightCSSVar"
      @before-leave="setHeightCSSVar"
    >
      <span v-if="errorMessage" class="select-field__err-msg">
        {{ errorMessage }}
      </span>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@/common'
import { ICON_NAMES } from '@/enums'
import uuid from 'uuidv4'

import { computed, onMounted, ref, useAttrs, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'

type MODIFICATIONS = 'border-rounded' | 'dark' | 'default'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    valueOptions?: { label: string; value: number | string }[]
    label?: string
    placeholder?: string
    errorMessage?: string
    modifications?: MODIFICATIONS[]
  }>(),
  {
    valueOptions: () => [],
    type: 'text',
    label: '',
    placeholder: ' ',
    errorMessage: '',
    modifications: () => ['default'] as MODIFICATIONS[],
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
}>()

const attrs = useAttrs()

const selectElement = ref<HTMLDivElement>()

const isDropdownOpen = ref(false)
const uid = uuid()

const isDisabled = computed(() =>
  ['', 'disabled', true].includes(attrs.disabled as string | boolean),
)

const isReadonly = computed(() =>
  ['', 'readonly', true].includes(attrs.readonly as string | boolean),
)

const title = computed(
  () => props.valueOptions.find(i => i.value === props.modelValue)?.label,
)

const selectFieldClasses = computed(() => {
  const _modifications = props.modifications

  const classList = [
    ...(_modifications ? _modifications : []),
    ...(isDropdownOpen.value ? ['open'] : []),
    ...(isDisabled.value ? ['disabled'] : []),
    ...(isReadonly.value ? ['readonly'] : []),
    ...(props.errorMessage ? ['error'] : []),
  ]

  return classList.map(el => `select-field--${el}`).join(' ')
})

const setHeightCSSVar = (element: HTMLElement) => {
  element.style.setProperty(
    '--lib-field-error-msg-height',
    `${element.scrollHeight}px`,
  )
}

const toggleDropdown = () => {
  isDropdownOpen.value ? closeDropdown() : openDropdown()
}

const openDropdown = () => {
  isDropdownOpen.value = true
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const select = (value: string | number) => {
  if (isDisabled.value || isReadonly.value) return

  emit('update:modelValue', value)
  closeDropdown()
}

onMounted(() => {
  if (selectElement.value) {
    onClickOutside(selectElement, () => {
      closeDropdown()
    })
  }
})

watch(
  () => props.modelValue,
  () => {
    closeDropdown()
  },
)
</script>

<style lang="scss" scoped>
$z-local-index: 1;

.select-field {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  flex: 1;

  &--disabled,
  &--readonly {
    opacity: 0.5;
  }
}

.select-field__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @include lib-field-label;

  .select-field--error & {
    color: var(--lib-field-error);
  }
}

.select-field__select-wrp {
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;

  .select-field--dark & {
    --lib-field-bg: var(--lib-editor-background);
    --lib-field-border: var(--lib-border-primary-main);
    --lib-field-text: var(--lib-text-primary-invert-main);
  }
}

.select-field__select-head {
  padding: var(--lib-field-padding);
  padding-right: calc(var(--lib-field-padding-right) + #{toRem(24)});
  text-align: left;
  width: 100%;
  height: 100%;
  font-weight: 400;
  transition: 0.2s ease-in-out;
  transition-property: box-shadow border;

  @include lib-field-border;

  @include lib-field-text;

  .select-field--border-rounded & {
    border-radius: toRem(8);
  }

  .select-field--dark & {
    background-color: var(--lib-editor-background);
  }

  .select-field--error & {
    border-color: var(--lib-field-error);
  }

  &:hover {
    cursor: pointer;
    border: toRem(1) solid var(--lib-primary-main);
  }
}

.select-field__placeholder {
  font: inherit;
  opacity: 0.25;
}

.select-field__select-head-indicator {
  pointer-events: none;
  position: absolute;
  top: 50%;
  right: var(--lib-field-padding-right);
  transform: translateY(-50%);
  transition: transform 0.1s ease-in-out;
  width: toRem(18);
  height: toRem(18);
  color: var(--lib-field-text);

  .select-field--dark & {
    color: var(--lib-border-primary-main);
  }

  &--open {
    transform: translateY(-50%) rotate(180deg);
  }
}

.select-field__select-dropdown {
  display: flex;
  flex-direction: column;
  position: absolute;
  overflow: hidden auto;
  top: 0;
  right: 0;
  width: 100%;
  max-height: 500%;
  z-index: $z-local-index;
  background: var(--lib-field-bg);

  @include lib-field-border;

  .select-field--border-rounded & {
    border-radius: toRem(8);
  }

  .select-field--dark & {
    --lib-field-bg: var(--lib-background-quaternary);
  }
}

.select-field__select-dropdown-enter-active {
  animation: dropdown var(--lib-field-transition-duration);
}

/* .select-field__select-dropdown-leave-active {
  animation: dropdown var(--lib-field-transition-duration) 0.1s reverse;
} */

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(20%);
    max-height: 0;
  }

  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 500%;
  }
}

.select-field__select-dropdown-item {
  text-align: left;
  width: 100%;
  padding: var(--lib-field-padding);
  font-weight: 400;

  &:hover {
    background: rgba(var(--lib-primary-main-rgb), 0.05);
  }

  &--active {
    background: rgba(var(--lib-primary-main-rgb), 0.25);
  }

  .select-field--dark & {
    color: var(--lib-text-primary-invert-main);
  }
}

.select-field__err-msg {
  @include lib-field-error;
}

.select-field__err-msg-transition-enter-active {
  animation: fade-down var(--lib-field-transition-duration);
}

.select-field__err-msg-transition-leave-active {
  animation: fade-down var(--lib-field-transition-duration) reverse;
}

@keyframes fade-down {
  from {
    height: 0;
  }

  to {
    height: var(--lib-field-error-msg-height);
  }
}
</style>
