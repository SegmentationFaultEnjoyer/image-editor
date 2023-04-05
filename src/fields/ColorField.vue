<template>
  <div class="color-field" @click="onInputClick">
    <label v-if="label" :for="`color-field--${uid}`" class="color-field__label">
      {{ label }}
    </label>
    <input
      ref="inputRef"
      class="color-field__input"
      type="color"
      :id="`color-field--${uid}`"
      v-on="listeners"
    />
  </div>
</template>

<script setup lang="ts">
import uuid from 'uuidv4'
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
  }>(),
  {
    modelValue: '',
    label: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', payload: string): void
}>()

const uid = uuid()
const inputRef = ref<HTMLInputElement | null>(null)

const listeners = computed(() => ({
  input: (event: Event) => {
    const eventTarget = event.target as HTMLInputElement

    if (props.modelValue === eventTarget.value) return

    emit('update:modelValue', eventTarget.value)
  },
}))

const onInputClick = () => {
  if (!inputRef.value) return

  inputRef.value.dispatchEvent(new MouseEvent('click'))
}
</script>

<style scoped lang="scss">
.color-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  border-radius: toRem(8);
  border: toRem(1) solid var(--lib-border-primary-main);
  padding: toRem(3) toRem(8);
  background-color: var(--lib-editor-background);
  transition: 0.2s ease-in-out;
  transition-property: border;

  &:hover {
    cursor: pointer;
    border: toRem(1) solid var(--lib-primary-main);
  }
}

.color-field__label {
  line-height: 120%;
  font-size: toRem(12);
  font-weight: 400;
  color: var(--lib-border-primary-dark);

  @include text-ellipsis;
}

.color-field__input {
  --size: #{toRem(30)};

  width: var(--size);
  height: calc(var(--size) + toRem(3));
  background-color: transparent;
  border: none;
  cursor: pointer;
  pointer-events: none;

  &::-moz-color-swatch {
    border-radius: toRem(3);
    border: toRem(1) solid var(--lib-white);
  }

  &::-webkit-color-swatch {
    border-radius: toRem(3);
    border: toRem(1) solid var(--lib-white);
  }
}
</style>
