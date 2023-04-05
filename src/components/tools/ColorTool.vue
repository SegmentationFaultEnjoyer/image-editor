<template>
  <section class="color-tool">
    <p class="color-tool__label">
      {{ 'Colors' }}
    </p>
    <div class="color-tool__main-colors">
      <color-field
        v-if="!isColorTypeDisabled('fill')"
        v-model="fill"
        :label="'Fill'"
      />
      <color-field
        v-if="!isColorTypeDisabled('background')"
        v-model="background"
        :label="'Background'"
      />
    </div>
    <color-field
      v-if="!isColorTypeDisabled('stroke')"
      v-model="stroke"
      :label="'Stroke'"
    />
    <!-- <range-field
      v-model="strokeWidth"
      :min="MIN_STROKE_WIDTH"
      :max="MAX_STROKE_WIDTH"
      :label="'Stroke width'"
    /> -->
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ColorField } from '@/fields'
import { debounce } from 'lodash-es'
import { safeInject } from '@/helpers'
import { EditorInstanceKey } from '@/types'

type ColorType = 'fill' | 'background' | 'stroke'

const props = defineProps<{
  disabledColorTypes?: string[]
}>()

const isColorTypeDisabled = (type: ColorType) => {
  return props.disabledColorTypes && props.disabledColorTypes.includes(type)
}

const DEFAULT_FILL_COLOR = '#000000'
const DEFAULT_BACKGROUND_COLOR = '#000000'
const DEFAULT_STROKE_COLOR = '#00000'
// const DEFAULT_STROKE_WIDTH = 2

// const MIN_STROKE_WIDTH = 0
// const MAX_STROKE_WIDTH = 20

const fill = ref(DEFAULT_FILL_COLOR)
const background = ref(DEFAULT_BACKGROUND_COLOR)
const stroke = ref(DEFAULT_STROKE_COLOR)
// const strokeWidth = ref(DEFAULT_STROKE_WIDTH)

const {
  instance: { setBackgroundColor, setColor, setStroke },
} = safeInject(EditorInstanceKey)

watch(
  fill,
  debounce(() => {
    setColor(fill.value)
  }, 100),
)

watch(
  background,
  debounce(() => {
    setBackgroundColor(background.value)
  }, 100),
)

watch(
  stroke,
  debounce(() => {
    setStroke({
      stroke: stroke.value,
    })
  }, 100),
)

// watch(strokeWidth, () => {
//   setStroke({
//     strokeWidth: strokeWidth.value,
//   })
// })
</script>

<style lang="scss" scoped>
.color-tool {
  display: flex;
  flex-direction: column;
  gap: toRem(8);
}

.color-tool__label {
  @include lib-tool-label;
}

.color-tool__main-colors {
  display: flex;
  justify-content: space-between;
  gap: toRem(10);

  & > *:first-child {
    flex-basis: 35%;
  }

  & > *:last-child {
    flex-basis: 65%;
  }

  & > *:first-child:last-child {
    flex-basis: 100%;
  }

  @include respond-to(medium) {
    flex-flow: row wrap;

    & > * {
      flex: 1;
    }
  }
}
</style>
