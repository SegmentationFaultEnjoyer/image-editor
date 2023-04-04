<template>
  <div class="sandbox">
    <header class="sandbox__header">
      <h3>
        {{ title }}
      </h3>
      <h4>fill free to test library here</h4>
    </header>

    <section class="sandbox__content">
      <image-editor />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ImageEditor } from '@/components'
const title = 'Welcome to your your sandbox environment'
</script>

<style lang="scss" scoped>
.sandbox {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: toRem(60);
  align-items: center;
}

.sandbox__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: toRem(10);
  margin-bottom: toRem(60);
}

.sandbox__content {
  background-color: var(--lib-background-tertiary);
  width: 70%;
  padding: toRem(25);
}
</style>
