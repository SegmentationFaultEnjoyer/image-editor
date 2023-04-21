import { fabric } from 'fabric'
import type { AlignType, UseText } from '@/types'
import {
  animateObjectAppearence,
  modifyTextSelection,
  triggerObjectModifiedEvent,
} from '@/helpers'
import FontFaceObserver from 'fontfaceobserver'

export function useText(canvas: fabric.Canvas): UseText {
  const addText = (value: string, options?: fabric.ITextOptions) => {
    const defaultTextSettings: fabric.ITextOptions = {
      left: 50,
      top: 50,
      fill: '#000000',
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'normal',
      editable: true,
      centeredRotation: true,
      padding: 5,
    }

    const text = new fabric.IText(value, {
      ...defaultTextSettings,
      ...(!options ? {} : options),
    })

    // removing ability to scale without maintaining aspect ratio
    text.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
    })

    animateObjectAppearence(canvas, text)
  }

  const switchBoldness = (object?: fabric.IText) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    const wholeTextStyle = (currentStyle: string | number) =>
      currentStyle !== 'bold' ? 'bold' : 'normal'

    const selectionStyle = (currentSelection: unknown[]) => {
      /* calculate amount of bold chars to decide which style should 
             be applied */
      const boldChars = (
        currentSelection as { fontWeight: string | number }[]
      ).reduce(
        (count, value) => (value.fontWeight === 'bold' ? count + 1 : count),
        0,
      )

      return boldChars === currentSelection.length ? 'normal' : 'bold'
    }

    modifyTextSelection(
      activeObject,
      'fontWeight',
      wholeTextStyle,
      selectionStyle,
    )

    triggerObjectModifiedEvent(canvas, activeObject)

    canvas.renderAll()
  }

  const switchItalic = (object?: fabric.IText) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    const wholeTextStyle = (currentStyle: string | number) =>
      currentStyle === 'italic' ? 'normal' : 'italic'

    const selectionStyle = (currentSelection: unknown[]) => {
      /* calculate amount of italic chars to decide which style should 
               be applied */
      const italicChars = (currentSelection as { fontStyle: string }[]).reduce(
        (count, value) => (value.fontStyle === 'italic' ? count + 1 : count),
        0,
      )

      return italicChars === currentSelection.length ? 'normal' : 'italic'
    }

    modifyTextSelection(
      activeObject,
      'fontStyle',
      wholeTextStyle,
      selectionStyle,
    )

    triggerObjectModifiedEvent(canvas, activeObject)

    canvas.renderAll()
  }

  const changeFont = (font: string, object?: fabric.IText) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    const fontFace = new FontFaceObserver(font)

    // using async await is causing visual bugs for some reasons
    // eslint-disable-next-line
    fontFace.load().then(() => {
      modifyTextSelection(activeObject, 'fontFamily', font, font)

      triggerObjectModifiedEvent(canvas, activeObject)

      canvas.renderAll()
    })
  }

  const changeFontSize = (size: number, object?: fabric.IText) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    modifyTextSelection(activeObject, 'fontSize', size, size)

    canvas.renderAll()
  }

  const changeTextAlign = (alignType: AlignType, object?: fabric.IText) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    activeObject.set('textAlign', alignType)

    canvas.renderAll()
  }

  const isText = (object: fabric.Object) => {
    return object instanceof fabric.IText
  }

  // cant be edited after adding
  const addFrame = (
    color: string,
    width: number,
    padding: number,
    object?: fabric.IText,
  ) => {
    const activeObject = object ?? canvas.getActiveObject()

    if (!activeObject || !(activeObject instanceof fabric.IText)) return

    const boundingBox = activeObject.getBoundingRect()

    const frame = new fabric.Rect({
      left: boundingBox.left - padding,
      top: boundingBox.top - padding,
      width: boundingBox.width + padding * 2,
      height: boundingBox.height + padding * 2,
      fill: 'transparent',
      stroke: color,
      strokeWidth: width,
      selectable: false,
    })

    const group = new fabric.Group([frame, activeObject], {
      selectable: true,
    })

    canvas.add(group)
    canvas.discardActiveObject()

    activeObject.lockMovementX = true
    activeObject.lockMovementY = true
    activeObject.lockRotation = true
    activeObject.lockScalingX = true
    activeObject.lockScalingY = true
  }

  return {
    changeFont,
    changeFontSize,
    switchBoldness,
    switchItalic,
    addText,
    changeTextAlign,
    addFrame,
    isText,
  }
}
