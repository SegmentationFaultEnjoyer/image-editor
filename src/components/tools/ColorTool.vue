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
    <div v-if="!isColorTypeDisabled('stroke')" class="color-tool__main-colors">
      <color-field v-model="stroke" :label="'Stroke'" />
      <range-field
        v-model="strokeWidth"
        :min="MIN_STROKE_WIDTH"
        :max="MAX_STROKE_WIDTH"
        :label="'Stroke width'"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ColorField, RangeField } from '@/fields'
import { debounce } from 'lodash-es'
import { safeInject } from '@/helpers'
import { EditorInstanceKey, DefaultParamsKey } from '@/types'

type ColorType = 'fill' | 'background' | 'stroke'

const props = defineProps<{
  disabledColorTypes?: string[]
}>()

const isColorTypeDisabled = (type: ColorType) => {
  return props.disabledColorTypes && props.disabledColorTypes.includes(type)
}

const MIN_STROKE_WIDTH = 0
const MAX_STROKE_WIDTH = 20

const {
  instance: { setBackgroundColor, setColor, setStroke },
} = safeInject(EditorInstanceKey)

const { params } = safeInject(DefaultParamsKey)

const fill = ref(params.value.fill as string)
const background = ref(params.value.background as string)
const stroke = ref(params.value.strokeColor as string)
const strokeWidth = ref(params.value.strokeWidth)

watch(
  fill,
  debounce(() => {
    setColor(fill.value)

    params.value = {
      ...params.value,
      fill: fill.value,
    }
  }, 100),
)

watch(
  background,
  debounce(() => {
    setBackgroundColor(background.value)

    params.value = {
      ...params.value,
      background: background.value,
    }
  }, 100),
)

watch(
  stroke,
  debounce(() => {
    setStroke({
      stroke: stroke.value,
    })

    params.value = {
      ...params.value,
      strokeColor: stroke.value,
    }
  }, 100),
)

watch(strokeWidth, () => {
  setStroke({
    strokeWidth: strokeWidth.value,
  })

  params.value = {
    ...params.value,
    strokeWidth: strokeWidth.value,
  }
})
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
    flex-basis: 40%;
  }

  & > *:last-child {
    flex-basis: 60%;
  }

  & > *:first-child:last-child {
    flex-basis: 100%;
  }

  @include respond-to(xmedium) {
    flex-flow: row wrap;

    & > * {
      flex: 1;
    }
  }

  @include respond-to(medium) {
    flex-wrap: nowrap;

    & > * {
      flex: unset;
    }
  }
}
</style>
