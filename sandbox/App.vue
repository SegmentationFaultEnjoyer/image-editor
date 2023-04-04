<template>
  <main class="sandbox">
    <h3 class="sandbox__title">
Welcome to your your sandbox environment
</h3>
    <section class="sandbox__content">
      <select-field
        :value-options="choices"
        v-model="variant"
        :label="'Test Select'"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { SelectField } from '@/fields'
import { ref } from 'vue'

const variant = ref(1)
const choices = [
  {
    label: 'aboba',
    value: 1,
  },
  {
    label: 'aboba2',
    value: 2,
  },
  {
    label: 'aboba3',
    value: 4,
  },
]
</script>

<style lang="scss" scoped>
.sandbox {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: toRem(60);
  align-items: center;
}

.sandbox__content {
  background-color: var(--lib-background-tertiary);
  width: 70%;
  padding: toRem(25);
}

.sandbox__title {
  margin-bottom: toRem(60);
}
</style>
