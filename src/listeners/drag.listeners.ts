import type { fabric } from 'fabric'
import { keepObjectInBoundaries } from '@/helpers'

type RestrictionRule = () => boolean

/**
 * Sets up a drag listener for a Fabric.js canvas that allows the user to
 * navigate the canvas by dragging while holding the alt key.
 *
 * @param canvas
 * - The Fabric.js canvas object to listen to for drag events.
 * @param restriction
 * - Optional function that determines whether drag should be restricted.
 */

// TODO: work with touch devices
export function setDragListener(
  canvas: fabric.Canvas,
  restriction?: RestrictionRule,
) {
  let isDragging = false
  const coords = {
    x: 0,
    y: 0,
  }

  canvas.on('mouse:down', event => {
    if (!event.e.altKey || (restriction && restriction())) return

    isDragging = true
    canvas.selection = false
    coords.x = event.e.clientX
    coords.y = event.e.clientY
    canvas.discardActiveObject()
  })

  canvas.on('mouse:move', event => {
    if (!isDragging) return

    const viewport = canvas.viewportTransform

    const backgroundImage = canvas.backgroundImage as fabric.Image

    if (!viewport) return

    viewport[4] += event.e.clientX - coords.x
    viewport[5] += event.e.clientY - coords.y
    canvas.renderAll()

    coords.x = event.e.clientX
    coords.y = event.e.clientY

    keepObjectInBoundaries(canvas, backgroundImage)
  })

  canvas.on('mouse:up', () => {
    if (!canvas.viewportTransform) return

    canvas.setViewportTransform(canvas.viewportTransform)
    isDragging = false
    canvas.selection = true
  })
}
