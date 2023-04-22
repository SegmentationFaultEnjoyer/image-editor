import { fabric } from 'fabric'
import { ref } from 'vue'

import type { UseCanvasOperations, ZoomType } from '@/types'
import {
  preserveOriginalSize,
  keepObjectInBoundaries,
  History,
  dataUriToBlobViaFetch,
} from '@/helpers'

const DEFAULT_VIEWPORT = [1, 0, 0, 1, 0, 0]
const DEFAULT_ZOOM = 1

const CLONED_OBJECT_OFFSET = 10

export function useCanvasOperations(
  canvas: fabric.Canvas,
): UseCanvasOperations {
  const currentZoom = ref(DEFAULT_ZOOM)
  let clipboard: fabric.Object | null = null

  let history: History | null = null

  const download = (fileName: string, options?: fabric.IDataURLOptions) => {
    if (!canvas) return

    resetZoom()

    // scaling up image and all objects to initial sizes and to get max quality
    const restoreSize = preserveOriginalSize(canvas)

    if (!restoreSize) return

    const dataURL = canvas.toDataURL(options)

    const downloadLink = document.createElement('a')
    downloadLink.setAttribute('download', `${fileName}.png`)

    downloadLink.setAttribute('href', dataURL)

    downloadLink.click()

    restoreSize()
  }

  const canvasToFormData = async (
    fileName: string,
    options?: fabric.IDataURLOptions,
  ) => {
    if (!canvas) return null

    resetZoom()
    // scaling up image and all objects to initial sizes and to get max quality
    const restoreSize = preserveOriginalSize(canvas)

    if (!restoreSize) return null

    const base64 = canvas.toDataURL(options)
    restoreSize()

    const blob = await dataUriToBlobViaFetch(base64)

    const formData = new FormData()
    formData.append(fileName, blob)

    return formData
  }

  const resetZoom = () => {
    canvas.setZoom(DEFAULT_ZOOM)
    canvas.viewportTransform = DEFAULT_VIEWPORT
    currentZoom.value = canvas.getZoom()
  }

  const zoom = (zoomType: ZoomType, scaleFactor?: number) => {
    switch (zoomType) {
      case 'zoom':
        if (!scaleFactor) return

        canvas.setZoom(scaleFactor)
        currentZoom.value = canvas.getZoom()

        keepObjectInBoundaries(canvas, canvas.backgroundImage as fabric.Image)
        break
      case 'reset':
      default:
        resetZoom()
    }
  }

  const copyObjectToClipboard = (object?: fabric.Object) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    activeObject.clone((cloned: fabric.Object) => {
      clipboard = cloned
    })
  }

  const pasteObjectFromClipboard = () => {
    if (!clipboard) return

    canvas.discardActiveObject()

    clipboard.clone((cloned: fabric.Object) => {
      if (!cloned.left || !cloned.top) return

      const isXOutOfBoundary =
        cloned.left + CLONED_OBJECT_OFFSET > canvas.getWidth() - cloned.width!

      const isYOutOfBoundary =
        cloned.top + CLONED_OBJECT_OFFSET > canvas.getHeight() - cloned.height!

      cloned.set({
        left: !isXOutOfBoundary
          ? cloned.left + CLONED_OBJECT_OFFSET
          : canvas.getWidth() / 2,
        top: !isYOutOfBoundary
          ? cloned.top + CLONED_OBJECT_OFFSET
          : canvas.getHeight() / 2,
        evented: true,
      })

      if (cloned instanceof fabric.Group) {
        // active selection needs a reference to the canvas.
        cloned.canvas = canvas
        cloned.forEachObject(object => {
          canvas.add(object)
        })
        // this should solve the unselectability
        cloned.setCoords()
      } else {
        canvas.add(cloned)
      }

      // to prevent objects from stacking on top of each other
      clipboard?.set({
        top: clipboard.top! + CLONED_OBJECT_OFFSET,
        left: clipboard.left! + CLONED_OBJECT_OFFSET,
      })

      canvas.setActiveObject(cloned)
      canvas.renderAll()
    })
  }

  const discardActiveObject = () => {
    canvas.discardActiveObject()
    canvas.renderAll()
  }

  const deleteObjects = (deleteAll = false, objects?: fabric.Object[]) => {
    // prevent from deleting guidelines
    const nonDeletableObjectsCount = 6

    let activeObjects = objects?.length ? objects : canvas.getActiveObjects()

    if (deleteAll)
      activeObjects = canvas.getObjects().slice(nonDeletableObjectsCount)

    if (!activeObjects.length) return

    discardActiveObject()

    activeObjects.forEach(object => {
      canvas.remove(object)
    })
  }

  const undo = () => {
    if (!history) return

    history.undo()
  }

  const redo = () => {
    if (!history) return

    history.redo()
  }

  const initHistory = () => {
    history = new History(canvas)
  }

  return {
    zoom,
    currentZoom,
    download,
    canvasToFormData,

    copyObjectToClipboard,
    pasteObjectFromClipboard,
    deleteObjects,
    discardActiveObject,

    initHistory,
    undo,
    redo,
  }
}
