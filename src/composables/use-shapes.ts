import { fabric } from 'fabric'

import type { UseShapes } from '@/types'
import { animateObjectAppearence } from '@/helpers'

export function useShapes(canvas: fabric.Canvas): UseShapes {
  const defaultShapePosition: fabric.IObjectOptions = {
    top: 100,
    left: 100,
  }

  const defaultShapeSizes: fabric.IObjectOptions = {
    width: 50,
    height: 50,
  }

  const defaultShapeColors: fabric.IObjectOptions = {
    fill: '#77f',
  }

  const addRectangle = (options?: fabric.IRectOptions) => {
    const rect = new fabric.Rect({
      ...defaultShapePosition,
      ...defaultShapeColors,
      ...defaultShapeSizes,
      ...(!options ? {} : options),
    })

    animateObjectAppearence(canvas, rect)
  }

  const addTriangle = (options?: fabric.ITriangleOptions) => {
    const triangle = new fabric.Triangle({
      ...defaultShapePosition,
      ...defaultShapeColors,
      ...defaultShapeSizes,
      ...(!options ? {} : options),
    })

    animateObjectAppearence(canvas, triangle)
  }

  const addCircle = (options?: fabric.ICircleOptions) => {
    const circle = new fabric.Circle({
      ...defaultShapeColors,
      ...defaultShapePosition,
      radius: 50,
      ...(!options ? {} : options),
    })

    animateObjectAppearence(canvas, circle)
  }

  return {
    addRectangle,
    addTriangle,
    addCircle,
  }
}
