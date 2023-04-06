<template>
  <div class="sandbox">
    <header class="sandbox__header">
      <h3>
        {{ title }}
      </h3>
      <h4>fill free to test library here</h4>
    </header>

    <section class="sandbox__content">
      <image-editor ref="editorInstance" :image-url="testImage" />
      <editor-button
        modifications="no-icon"
        :text="'DOWNLOAD'"
        scheme="reset"
        @click="download"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ImageEditor } from '@/components'
import { EditorButton } from '@/common'
import type { UseImageEditor } from '@/types'
import { ref } from 'vue'

const title = 'Purchasing'
const testImage =
  'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/f6391766-11b1-48cf-aa55-811948c26bd9.png'
const editorInstance = ref<{
  editorInstance: UseImageEditor | null
}>()

const download = () => {
  if (!editorInstance.value) return

  const { editorInstance: editor } = editorInstance.value

  if (!editor) return

  editor.download()
}
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
  // background-color: var(--lib-background-quaternary);
  width: 70%;
  font-weight: 700;
  padding: toRem(25);
}
</style>
