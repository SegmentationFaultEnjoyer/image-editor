import { fabric } from 'fabric'
import { type UseDrawing, BRUSHES } from '@/types'

export function useDrawing(canvas: fabric.Canvas): UseDrawing {
  const startDraw = (brush: BRUSHES, options?: Partial<fabric.BaseBrush>) => {
    canvas.isDrawingMode = true
    /* Due to bug with types in fabric library this constructors require 
        canvas object, but types declaration says that it doesn't.

        TODO: remove ignore when bug is fixed */
    switch (brush) {
      case BRUSHES.spray:
        // eslint-disable-next-line
        // @ts-ignore
        canvas.freeDrawingBrush = new fabric.SprayBrush(canvas)
        break
      case BRUSHES.circle:
        // eslint-disable-next-line
        // @ts-ignore
        canvas.freeDrawingBrush = new fabric.CircleBrush(canvas)
        break
      case BRUSHES.pencil:
      default:
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas)
        break
    }

    if (options) Object.assign(canvas.freeDrawingBrush, options)
  }

  const modifyBrush = (options: Partial<fabric.BaseBrush>) => {
    if (!canvas || !canvas.isDrawingMode) return

    Object.assign(canvas.freeDrawingBrush, options)
  }

  const stopDraw = () => {
    if (!canvas) return

    canvas.isDrawingMode = false
  }

  return {
    startDraw,
    modifyBrush,
    stopDraw,
  }
}
