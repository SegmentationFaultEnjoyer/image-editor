<template>
  <div class="range-field">
    <label v-if="label" :for="`range-field--${uid}`" class="range-field__label">
      {{ label }}
    </label>
    <p class="range-field__label range-field__label--bold">
      {{ modelValue }}
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
</template>

<script setup lang="ts">
import uuid from 'uuidv4'
import { computed } from 'vue'

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

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement

    if (props.modelValue === eventTarget.valueAsNumber) return

    emit('update:modelValue', eventTarget.valueAsNumber)
  },
}))
</script>

<style scoped lang="scss">
.range-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.range-field__label {
  @include lib-field-label;

  @include text-ellipsis;

  user-select: none;

  &--bold {
    font-weight: 600;
  }
}

.range-field__input {
  --slider-size: #{toRem(15)};

  appearance: none;
  background-color: var(--lib-background-primary);
  border: toRem(1) solid var(--lib-primary-light);
  border-radius: toRem(8);
  height: toRem(5);

  &::-webkit-slider-thumb {
    appearance: none;
    width: var(--slider-size);
    height: var(--slider-size);
    background-color: var(--lib-primary-dark);
    border-radius: 100%;
  }
}
</style>
