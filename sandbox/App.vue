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
        @click="toFormData"
      />
    </section>
    <img class="pidor" v-if="src" :src="src" />
  </div>
</template>

<script setup lang="ts">
import { ImageEditor } from '@/components'
import { EditorButton } from '@/common'
import type { UseImageEditor } from '@/types'
import { ref } from 'vue'

const title = 'Purchasing'
const testImage =
  'https://tokend-nftbooks.s3.us-east-2.amazonaws.com/e50e35c3-224c-40df-9fe4-0eb1477e9122.jpeg'
const editorInstance = ref<{
  editorInstance: UseImageEditor | null
}>()

const download = () => {
  if (!editorInstance.value) return

  const { editorInstance: editor } = editorInstance.value

  if (!editor) return

  editor.download('test.image')
}

const src = ref('')

const toFormData = async () => {
  if (!editorInstance.value) return

  const { editorInstance: editor } = editorInstance.value

  if (!editor) return

  const formData = await editor.canvasToFormData('Banner')

  if (!formData) return
  // console.log(formData, formData?.get('Banner'))
  src.value = URL.createObjectURL(formData.get('Banner'))
}
</script>

<style lang="scss" scoped>
.sandbox {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: toRem(60);
  align-items: center;

  @include respond-to(small) {
    padding: toRem(10);
  }
}

.pidor {
  width: toRem(500);
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

  @include respond-to(medium) {
    width: 100%;
    padding: 0;
  }
}
</style>
