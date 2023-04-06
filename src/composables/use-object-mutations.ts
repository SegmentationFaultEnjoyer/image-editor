import { fabric } from 'fabric'

import type { UseObjectMutations, FabricColor } from '@/types'
import {
  modifyTextSelection,
  modifyGroup,
  triggerObjectModifiedEvent,
} from '@/helpers'

export function useObjectMutations(canvas: fabric.Canvas): UseObjectMutations {
  const setColor = (color: FabricColor, object?: fabric.Object) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    canvas.freeDrawingBrush.color = color as string

    if (activeObject instanceof fabric.IText) {
      modifyTextSelection(activeObject, 'fill', color, color)
      triggerObjectModifiedEvent(canvas, activeObject)
      canvas.renderAll()
      return
    }

    if (activeObject instanceof fabric.Group) {
      modifyGroup(
        activeObject,
        {
          default: 'fill',
          text: 'fill',
        },
        color,
      )
      triggerObjectModifiedEvent(canvas, activeObject)
      canvas.renderAll()
      return
    }

    if (activeObject instanceof fabric.Path) {
      activeObject.set('stroke', color as string)
      canvas.renderAll()
      return
    }

    activeObject.set('fill', color as string)
    triggerObjectModifiedEvent(canvas, activeObject)
    canvas.renderAll()
  }

  const setBackgroundColor = (color: string, object?: fabric.Object) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    if (activeObject instanceof fabric.IText) {
      modifyTextSelection(activeObject, 'textBackgroundColor', color, color)
      triggerObjectModifiedEvent(canvas, activeObject)
      canvas.renderAll()
      return
    }

    if (activeObject instanceof fabric.Group) {
      modifyGroup(
        activeObject,
        {
          default: 'fill',
          text: 'textBackgroundColor',
        },
        color,
      )
      triggerObjectModifiedEvent(canvas, activeObject)
      canvas.renderAll()
      return
    }

    activeObject.set('fill', color)
    triggerObjectModifiedEvent(canvas, activeObject)
    canvas.renderAll()
  }

  const setStroke = (
    strokeOptions: Partial<
      Pick<fabric.IObjectOptions, 'stroke' | 'strokeWidth'>
    >,
    object?: fabric.Object,
  ) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    if (activeObject instanceof fabric.IText) {
      Object.entries(strokeOptions).forEach(([key, value]) => {
        modifyTextSelection(
          activeObject,
          key as keyof fabric.IText,
          value,
          value,
        )
      })
      triggerObjectModifiedEvent(canvas, activeObject)
      canvas.renderAll()
      return
    }

    if (activeObject instanceof fabric.Group) {
      Object.entries(strokeOptions).forEach(([key, value]) => {
        modifyGroup(
          activeObject,
          {
            default: key as keyof fabric.Object,
          },
          value,
        )
      })
      triggerObjectModifiedEvent(canvas, activeObject)
      canvas.renderAll()
      return
    }

    activeObject.set({
      stroke: strokeOptions.stroke ?? activeObject.stroke,
      strokeWidth: strokeOptions.strokeWidth ?? activeObject.strokeWidth,
    })
    triggerObjectModifiedEvent(canvas, activeObject)
    canvas.renderAll()
  }

  const bringToFront = (object?: fabric.Object) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    activeObject.bringToFront()
    canvas.discardActiveObject()
  }

  const sendToBack = (object?: fabric.Object) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject) return

    activeObject.sendToBack()
    canvas.discardActiveObject()
  }

  return { setBackgroundColor, setColor, setStroke, bringToFront, sendToBack }
}
