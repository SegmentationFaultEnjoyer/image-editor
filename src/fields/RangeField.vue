<template>
  <div class="range-field" @click="isOpen = true">
    <label v-if="label" :for="`range-field--${uid}`" class="range-field__label">
      {{ label }}
    </label>
    <p class="range-field__label range-field__label--light">
      {{ `${modelValue} px` }}
    </p>
    <transition name="range">
      <div v-show="isOpen" ref="inputWrapperRef" class="range-field__wrapper">
        <p class="range-field__label range-field__label--uppercased">
          {{ label }}
        </p>
        <input
          class="range-field__input"
          type="range"
          :value="modelValue"
          :id="`range-field--${uid}`"
          :min="min"
          :max="max"
          :step="step"
          v-on="listeners"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import uuid from 'uuidv4'
import { computed, ref, onMounted } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    modelValue?: number
    label?: string
    min: number
    max: number
    step?: number
  }>(),
  {
    modelValue: 0,
    label: '',
    step: 1,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', payload: number): void
}>()

const uid = uuid()

const isOpen = ref(false)
const inputWrapperRef = ref<HTMLElement | null>(null)

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement

    if (props.modelValue === eventTarget.valueAsNumber) return

    emit('update:modelValue', eventTarget.valueAsNumber)
  },
}))

onMounted(() => {
  if (!inputWrapperRef.value) return

  onClickOutside(inputWrapperRef, () => {
    isOpen.value = false
  })
})
</script>

<style scoped lang="scss">
.range-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: toRem(5);
  width: 100%;
  min-height: toRem(41);
  border-radius: toRem(8);
  border: toRem(1) solid var(--lib-border-primary-main);
  padding: toRem(3) toRem(8);
  background-color: var(--lib-editor-background);
  transition: 0.2s ease-in-out;
  transition-property: border;
  position: relative;

  &:hover {
    cursor: pointer;
    border: toRem(1) solid var(--lib-primary-main);
  }
}

.range-field__wrapper {
  --max-width: #{toRem(165)};

  display: flex;
  flex-direction: column;
  gap: toRem(20);
  position: absolute;
  max-width: var(--max-width);
  bottom: toRem(-80);
  left: calc(50% - var(--max-width) / 2);
  border-radius: toRem(16);
  border: toRem(1) solid var(--lib-primary-main);
  padding: toRem(14) toRem(12);
  background-color: var(--lib-editor-background);
  z-index: 1;
}

.range-field__label {
  line-height: 120%;
  font-size: toRem(12);
  font-weight: 400;
  color: var(--lib-border-primary-dark);

  @include text-ellipsis;

  &--light {
    color: var(--lib-white);
  }

  &--uppercased {
    text-transform: uppercase;
    font-weight: 500;
  }
}

.range-field__input {
  --slider-size: #{toRem(15)};

  appearance: none;
  background-color: var(--lib-background-primary);
  border: toRem(1) solid var(--lib-primary-light);
  border-radius: toRem(8);
  height: toRem(5);

  &::-moz-range-thumb {
    appearance: none;
    width: var(--slider-size);
    height: var(--slider-size);
    background-color: var(--lib-primary-main);
    border-radius: 100%;
    border: toRem(1) solid var(--lib-white);
  }

  &::-webkit-slider-thumb {
    appearance: none;
    width: var(--slider-size);
    height: var(--slider-size);
    background-color: var(--lib-primary-main);
    border-radius: 100%;
    border: toRem(1) solid var(--lib-white);
  }
}

.range-enter-active,
.range-leave-active {
  transform: translateY(0);
  transition: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  transition-property: transform, opacity;
}

.range-enter-from,
.range-leave-to {
  opacity: 0;
  transform: translateY(toRem(-50));
}
</style>
