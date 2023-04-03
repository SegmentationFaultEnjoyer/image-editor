<template>
  <div class="input-container">
    <label class="input-label" :for="label">
      <slot></slot>
    </label>

    <input :id="label" class="input" :name="label" v-bind="inputAttributes" />
  </div>
</template>

<script setup lang="ts">
import type { InputHTMLAttributes } from 'vue'

withDefaults(
  defineProps<{
    label: string
    inputAttributes?: InputHTMLAttributes
  }>(),
  {
    inputAttributes: () => ({}),
  },
)
</script>

<style lang="scss" scoped>
.input-container {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-width: 250px;

  .input-label {
    box-sizing: border-box;
    margin-bottom: 0.5rem;
    font-size: 21px;
    font-weight: 500;
  }

  input.input {
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem 0.5rem;
    border: 0;
    border-radius: 4px;
    margin: 0;
    font-size: 16px;
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
