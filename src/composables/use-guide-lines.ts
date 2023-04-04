import { fabric } from 'fabric'
import { calcRotatedObjectOffset } from '@/helpers'

enum LINE_TYPES {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

type LineWrapper = {
  type: LINE_TYPES
  value: fabric.Line
  isCentered?: boolean
}

const LINE_COLOR = '#4cbecf'
const LINE_WIDTH = 2

export function useGuideLines(canvas: fabric.Canvas) {
  const createGuideLine = (
    pointsCoords: Array<number>,
    type: LINE_TYPES,
    isCentered = true,
    options?: fabric.ILineOptions,
  ): LineWrapper => {
    const lineOptions: fabric.ILineOptions = {
      stroke: LINE_COLOR,
      strokeWidth: LINE_WIDTH,
      selectable: false,
      visible: false,
      evented: false,
      ...(!options ? {} : options),
    }

    return {
      value: new fabric.Line(pointsCoords, lineOptions),
      type,
      isCentered,
    }
  }

  const createCenterGuidelines = (): Array<LineWrapper> => {
    if (!canvas.width || !canvas.height) return []

    const verticalGuideline = createGuideLine(
      [canvas.width / 2, 0, canvas.width / 2, canvas.height],
      LINE_TYPES.vertical,
    )

    const horizontalGuideline = createGuideLine(
      [0, canvas.height / 2, canvas.width, canvas.height / 2],
      LINE_TYPES.horizontal,
    )

    canvas.add(verticalGuideline.value, horizontalGuideline.value)

    return [verticalGuideline, horizontalGuideline]
  }

  const createBoundingGuideLines = (): Array<LineWrapper> => {
    if (!canvas.width || !canvas.height) return []

    const topLine = createGuideLine(
      [0, 0, canvas.width, 0],
      LINE_TYPES.horizontal,
      false,
    )
    const bottomLine = createGuideLine(
      [0, canvas.height, canvas.width, canvas.height],
      LINE_TYPES.horizontal,
      false,
    )
    const leftLine = createGuideLine(
      [0, 0, 0, canvas.height],
      LINE_TYPES.vertical,
      false,
    )
    const rightLine = createGuideLine(
      [canvas.width, 0, canvas.width, canvas.height],
      LINE_TYPES.vertical,
      false,
    )

    canvas.add(topLine.value, bottomLine.value, leftLine.value, rightLine.value)

    return [topLine, bottomLine, leftLine, rightLine]
  }

  const getIntersectingLines = (
    object: fabric.Object,
    lines: Array<LineWrapper>,
  ) => {
    const intersectingLines: Array<LineWrapper> = []

    lines.forEach(line => {
      if (!object.intersectsWithObject(line.value)) return

      line.value.visible = true

      intersectingLines.push(line)
    })

    return intersectingLines
  }

  const hideLines = (lines: Array<LineWrapper>) => {
    lines.forEach(line => {
      line.value.visible = false
    })
  }

  const snapObjectToGuideLines = (
    object: fabric.Object,
    lines: Array<LineWrapper>,
    thersholdFactor = 0.1,
  ) => {
    /* means that if 10% or more of object intersects guide-line 
     - it will snap */

    const { x: objectCenterX, y: objectCenterY } = object.getCenterPoint()

    const { width: objectWidth, height: objectHeight } =
      object.getBoundingRect()

    const threshold = ((objectWidth + objectHeight) / 2) * thersholdFactor

    lines.forEach(line => {
      if (!line.value.oCoords || !object.oCoords) return

      const { x: lineX, y: lineY } = line.value.oCoords.tl

      const { objectLeftX, objectTopY } = calcRotatedObjectOffset(object)

      switch (line.type) {
        case LINE_TYPES.vertical:
          if (line.isCentered) {
            if (Math.abs(lineX - objectCenterX) <= threshold) {
              object.set({
                left: lineX + objectLeftX,
              })
            }
            return
          }

          // left side of the object
          if (Math.abs(lineX + objectCenterX - objectWidth / 2) <= threshold) {
            object.set({
              left: lineX + objectWidth / 2 + objectLeftX,
            })
            // right side of the object
          } else if (
            Math.abs(lineX - objectCenterX - objectWidth / 2) <= threshold
          ) {
            object.set({
              left: lineX - objectWidth / 2 + objectLeftX,
            })
          }

          break
        case LINE_TYPES.horizontal:
          if (line.isCentered) {
            if (Math.abs(lineY - objectCenterY) <= threshold) {
              object.set({
                top: lineY - objectTopY,
              })
            }
            return
          }

          // top side of the object
          if (Math.abs(lineY + objectCenterY - objectHeight / 2) <= threshold) {
            object.set({
              top: lineY - objectTopY + objectHeight / 2,
            })
            // bottom side of the object
          } else if (
            Math.abs(lineY - objectCenterY - objectHeight / 2) <= threshold
          ) {
            object.set({
              top: lineY - objectTopY - objectHeight / 2,
            })
          }
          break
        default:
          break
      }
    })
  }

  return {
    hideLines,
    createGuideLine,
    createBoundingGuideLines,
    createCenterGuidelines,
    snapObjectToGuideLines,
    getIntersectingLines,
  }
}
