<template>
  <section class="text-tool">
    <p class="text-tool__label">
      {{ 'Text' }}
    </p>
    <div class="text-tool__selections">
      <select-field
        v-model="currentFont"
        :modifications="['dark', 'border-rounded']"
        :value-options="fonts"
      />
      <select-field
        v-model="currentFontSize"
        :modifications="['dark', 'border-rounded']"
        :value-options="fontSizes"
      />
    </div>
    <div class="text-tool__modifications">
      <div class="text-tool__modifications-style">
        <editor-button
          size="x-small"
          modifications="first-in-group"
          :icon-name="ICON_NAMES.textBold"
          @click="switchBoldness()"
        />
        <editor-button
          size="x-small"
          modifications="last-in-group"
          :icon-name="ICON_NAMES.textItalic"
          @click="switchItalic()"
        />
      </div>
      <div class="text-tool__modifications-align">
        <editor-button
          size="x-small"
          modifications="first-in-group"
          :icon-name="ICON_NAMES.alignLeft"
          @click="changeTextAlign('left')"
        />
        <editor-button
          size="x-small"
          :icon-name="ICON_NAMES.alignCenter"
          @click="changeTextAlign('center')"
        />
        <editor-button
          size="x-small"
          modifications="last-in-group"
          :icon-name="ICON_NAMES.alignRight"
          @click="changeTextAlign('right')"
        />
      </div>
      <editor-button
        size="x-small"
        :icon-name="ICON_NAMES.plus"
        @click="addTextHandler"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
// TODO displaying current style
import { ref, watch } from 'vue'

import { SelectField } from '@/fields'
import { EditorButton } from '@/common'
import { safeInject } from '@/helpers'
import { EditorInstanceKey } from '@/types'
import { ICON_NAMES } from '@/enums'

enum Fonts {
  arial = 'Arial',
  timesNewRoman = 'Times New Roman',
  courierNew = 'Courier New',
  verdana = 'Verdana',
  pacifico = 'Pacifico',
}

const {
  instance: {
    addText,
    switchBoldness,
    switchItalic,
    changeFont,
    changeFontSize,
    changeTextAlign,
  },
} = safeInject(EditorInstanceKey)

const DEFAULT_TEXT = 'Your unique signature'
const DEFAULT_FONT_SIZE = 24
const FONT_SIZE_STEP = 2
const FONT_SIZES_START = 10

const fonts = [
  {
    label: 'Arial',
    value: Fonts.arial,
  },
  {
    label: 'Times New Roman',
    value: Fonts.timesNewRoman,
  },
  {
    label: 'Courier New',
    value: Fonts.courierNew,
  },
  {
    label: 'Verdana',
    value: Fonts.verdana,
  },
  {
    label: 'Pacifico',
    value: Fonts.pacifico,
  },
]

const currentFont = ref<Fonts>(Fonts.arial)
const currentFontSize = ref(DEFAULT_FONT_SIZE)

const fontSizes = new Array(20).fill('').map((_, idx) => ({
  label: `${idx * FONT_SIZE_STEP + FONT_SIZES_START}`,
  value: idx * FONT_SIZE_STEP + FONT_SIZES_START,
}))

const addTextHandler = () => {
  addText(DEFAULT_TEXT, {
    fontSize: currentFontSize.value,
    fontFamily: currentFont.value,
  })
}

watch(currentFont, () => {
  changeFont(currentFont.value)
})

watch(currentFontSize, () => {
  changeFontSize(currentFontSize.value)
})
</script>

<style scoped lang="scss">
.text-tool {
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.text-tool__label {
  @include lib-tool-label;
}

.text-tool__selections {
  display: flex;
  gap: toRem(16);
  flex: 1;
  flex-flow: row wrap;

  & > *:first-child {
    flex-basis: 60%;
  }

  & > *:last-child {
    flex-basis: 30%;
  }
}

.text-tool__modifications {
  display: flex;
  flex-flow: row wrap;
  gap: toRem(16);
  margin-top: toRem(2);
  justify-content: space-between;
}

.text-tool__modifications-style {
  display: flex;

  & > *:first-child {
    border-right: none;
  }
}

.text-tool__modifications-align {
  display: flex;

  & > *:nth-child(2) {
    border-left: none;
    border-radius: 0;
    border-right: none;
  }
}
</style>
