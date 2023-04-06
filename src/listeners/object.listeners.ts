import type { fabric } from 'fabric'
import type { Ref } from 'vue'
import { useGuideLines } from '@/composables'

/**
 * Sets up listeners for canvas selection events and updates the value of the
 * provided activeObject ref accordingly.
 *
 * @param canvas
 * - The fabric.js canvas object to listen for selection events on.
 * @param activeObject
 * - A ref object that will hold the currently selected object on the canvas.
 */

export function setSelectionListeners(
  canvas: fabric.Canvas,
  activeObject: Ref<fabric.Object | null>,
) {
  canvas.on('selection:created', event => {
    if (!event.selected || event.selected.length > 1) return

    activeObject.value = event.selected[0]
  })

  canvas.on('selection:updated', event => {
    if (!event.selected || event.selected.length > 1) return

    activeObject.value = event.selected[0]
  })

  canvas.on('selection:cleared', () => {
    activeObject.value = null
  })
}

/**
 * Sets up a listener on the canvas to capture when a new object is added.
 * When an object is added to the canvas, it becomes the active object and
 * is assigned to the `activeObject` ref.
 *
 * @param  canvas - The canvas to set the listener on.
 * @param activeObject - The ref to assign the active object to.
 */
export function setCreationListener(
  canvas: fabric.Canvas,
  activeObject: Ref<fabric.Object | null>,
) {
  canvas.on('object:added', event => {
    if (!event.target || !event.target.visible) return

    canvas.setActiveObject(event.target)
    activeObject.value = event.target
  })
}

/**
 * Sets up listener for intersection with guide lines and snapping
 * objects to them
 * @param canvas - The canvas to set the listener on.
 */

export function setGuideLineIntersectionListener(canvas: fabric.Canvas) {
  const {
    createBoundingGuideLines,
    createCenterGuidelines,
    hideLines,
    getIntersectingLines,
    snapObjectToGuideLines,
  } = useGuideLines(canvas)

  const guideLines = [
    ...createCenterGuidelines(),
    ...createBoundingGuideLines(),
  ]

  canvas.on('object:moving', event => {
    if (!event.target) return

    const activeObject = event.target
    hideLines(guideLines)

    const intersectingLines = getIntersectingLines(activeObject, guideLines)

    if (!intersectingLines.length) return

    snapObjectToGuideLines(activeObject, intersectingLines)

    activeObject.setCoords()
  })

  // triggers when object stops moving
  canvas.on('object:modified', () => {
    hideLines(guideLines)
  })
}
