import { fabric } from 'fabric'

/**
 * Checks if an object is within the boundaries of a canvas and translates the
 * canvas viewport if necessary to keep the object within the boundaries.
 *
 * @param canvas - The fabric.js canvas object.
 * @param object - The fabric.js object to check the boundaries of.
 */

export function keepObjectInBoundaries(
  canvas: fabric.Canvas,
  object: fabric.Object,
) {
  if (!object.aCoords || !canvas?.width || !canvas?.height) return

  const { br: bottomRightRaw, tl: topLeftRaw } = object.aCoords

  const viewport = canvas.viewportTransform

  if (!viewport) return

  const bottomRight = fabric.util.transformPoint(bottomRightRaw, viewport)
  const topLeft = fabric.util.transformPoint(topLeftRaw, viewport)

  const { x: left, y: top } = topLeft
  const { x: right, y: bottom } = bottomRight
  const { width, height } = canvas

  /* calculate how far to translate to line up the edge of the object with
  /  the edge of the canvas */
  const deltaLeft = Math.abs(right - width)
  const deltaRight = Math.abs(left)
  const deltaUp = Math.abs(bottom - height)
  const deltaDown = Math.abs(top)

  /* if the object is larger than the canvas, clamp translation such that
     we don't push the opposite boundary past the edge */
  const maxDx = Math.min(deltaLeft, deltaRight)
  const maxDy = Math.min(deltaUp, deltaDown)

  const leftIsOver = left < 0
  const rightIsOver = right > width
  const topIsOver = top < 0
  const bottomIsOver = bottom > height
  const translateLeft = rightIsOver && !leftIsOver
  const translateRight = leftIsOver && !rightIsOver
  const translateUp = bottomIsOver && !topIsOver
  const translateDown = topIsOver && !bottomIsOver

  const dx = translateLeft ? -maxDx : translateRight ? maxDx : 0
  const dy = translateUp ? -maxDy : translateDown ? maxDy : 0

  if (dx || dy) {
    viewport[4] += dx
    viewport[5] += dy
    canvas.renderAll()
  }
}

/**
 * Adjusts the size and position of all objects on the canvas based on the
 * initial dimensions of the canvas.
 *
 * This is useful for maintaining the same size and layout of objects on
 * different screen sizes or after the canvas has been scaled.
 *
 * @param canvas - The Fabric.js canvas object.
 * @param initialWidth
 * - The initial width of the canvas before any scaling or resizing.
 * @param initialHeight
 * - The initial height of the canvas before any scaling or resizing.
 */

export function adjustObjectsSize(
  canvas: fabric.Canvas,
  initialWidth: number,
  initialHeight: number,
) {
  if (!canvas?.width || !canvas.height) return

  const canvasObjects = canvas.getObjects()

  const scaleX = canvas.width / initialWidth
  const scaleY = canvas.height / initialHeight

  canvasObjects.forEach(object => {
    const left = Number(object.left) * scaleX
    const top = Number(object.top) * scaleY
    const width = Number(object.width) * scaleX
    const height = Number(object.height) * scaleY

    object.set({
      left,
      top,
    })

    if (object instanceof fabric.IText) {
      object.set({ width, height })
      adjustTextSize(object, scaleX, scaleY)
    }

    // for Pathes and Groups simple dimension changing won't do desirable effect
    if (object instanceof fabric.Path || object instanceof fabric.Group) {
      adjustGroupSize(object, scaleX, scaleY)
    } else {
      object.set({ width, height })
    }

    if (object instanceof fabric.Circle) {
      object.set({
        radius: object.radius! * Math.max(scaleX, scaleY),
      })
    }

    object.setCoords()
  })

  canvas.renderAll()
}

const adjustTextSize = (
  object: fabric.IText,
  scaleX: number,
  scaleY: number,
) => {
  if (!object.fontSize) return

  const scaleFactor = Math.max(scaleX, scaleY)

  object.set('fontSize', object.fontSize * scaleFactor)

  /* if text has different styles on different chars it's styles won't be
     affected by global parent style - need to specify for each char
    */
  if (object.styleHas('fontSize')) {
    const charStyles = object.styles[0]

    Object.entries(charStyles).forEach(([key, value]) => {
      const charStyle = value as { [key: string]: unknown } & {
        fontSize: number
      }

      if (!charStyle?.fontSize) return

      object.setSelectionStyles(
        {
          ...charStyle,
          fontSize: charStyle.fontSize * scaleFactor,
        },
        Number(key),
        Number(key) + 1,
      )
    })
  }
}

const adjustGroupSize = (
  object: fabric.Group | fabric.Path,
  scaleX: number,
  scaleY: number,
) => {
  if (!object.scaleX || !object.scaleY) return

  object.scaleX = object.scaleX * scaleX
  object.scaleY = object.scaleY * scaleY
}

/**
 * This function preserves the original size of the background image of a given
 * fabric canvas, and adjusts the canvas and its objects to fit this size.
 *
 * @param canvas - The Fabric.js canvas object.
 * @returns A function that can be called to restore the canvas to
 *  its original size and scale.
 *
 * @remarks
 * Main **use case** of this is **saving the original quality** of the image
 * thas is being edited before saving it
 */
export function preserveOriginalSize(canvas: fabric.Canvas) {
  if (!canvas?.width || !canvas.height) return

  const currentWidth = canvas.width
  const currentHeight = canvas.height

  const backgroundImage = canvas.backgroundImage as fabric.Image
  const currentScale = backgroundImage.scaleX

  if (!backgroundImage.width || !backgroundImage.height) return

  backgroundImage.scale(1)

  canvas.setDimensions({
    width: backgroundImage.width,
    height: backgroundImage.height,
  })

  adjustObjectsSize(canvas, currentWidth, currentHeight)

  const restoreSize = () => {
    if (!currentScale) return

    backgroundImage.scale(currentScale)

    canvas.setDimensions({
      width: currentWidth,
      height: currentHeight,
    })

    adjustObjectsSize(canvas, backgroundImage.width!, backgroundImage.height!)
  }

  return restoreSize
}

/**
 * Animates the appearance of a fabric.Object on a fabric.Canvas.
 * (scale up animation)
 *
 * @param canvas - The canvas on which to animate the object.
 * @param object - The object to animate.
 * @param duration - The duration of the animation in milliseconds.
 * (default = 400 ms)
 */
export function animateObjectAppearence(
  canvas: fabric.Canvas,
  object: fabric.Object,
  duration = 400,
) {
  canvas.add(object)

  object.scale(0.1)
  object.set({
    opacity: 0,
  })

  fabric.util.animate({
    startValue: 0.1,
    endValue: 1,
    duration,
    easing: fabric.util.ease.easeInOutCubic,
    onChange: (value: number) => {
      object.scale(value)
      object.set({
        opacity: value,
      })
      canvas.renderAll()
    },
  })
}

/**
 * Triggers 'object:modified' event on specified object
 *
 * @param canvas - The Fabric.js canvas object.
 * @param object - The Fabric.js object.
 *
 * @remarks
 * Not all modification of the objects trigger this event, and in some cases
 * you need to manually trigger event if you want your changes to be tracked by
 * canvas.on('object:modified') listeners
 */
export function triggerObjectModifiedEvent(
  canvas: fabric.Canvas,
  object: fabric.Object,
) {
  if (!canvas || !object) return

  canvas.fire('object:modified', {
    target: object,
  })
}
