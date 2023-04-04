enum CIRCLE_QUARTERS {
  first = 0,
  second = 1,
  third = 2,
  fourth = 3,
}

/**
 * Calculates the scale factor needed to fit an image within a container while
 * preserving aspect ratio.
 * @param imageWidth - Width of the image.
 * @param imageHeight - Height of the image.
 * @param containerWidth - Width of the container.
 * @param containerHeight - Height of the container.
 *
 * @returns - The scale factor needed to fit the image within
 * the container.
 */

export function getImageScaleFactor(
  imageWidth: number,
  imageHeight: number,
  containerWidth: number,
  containerHeight: number,
) {
  const widthRatio = containerWidth / imageWidth
  const heightRatio = containerHeight / imageHeight

  return widthRatio < heightRatio ? widthRatio : heightRatio
}

/**
 * Calculates the offset of a fabric.Object based on its angle and dimensions
 * to correctly position it within a canvas guidelines
 * Takes into account the object's angle, width, height, and scaling factors.
 *
 * @param object - The fabric.Object to calculate the offset for.
 * @property  objectLeftX - The calculated left (X) offset of the object.
 * @property  objectTopY - The calculated top (Y) offset of the object.
 * @returns  An object containing the calculated offset values for the left (X)
 * and top (Y) positions.
 */
export function calcRotatedObjectOffset(object: fabric.Object) {
  const { width: objectWidth, height: objectHeight } = object.getBoundingRect()

  let objectLeftX = 0
  let objectTopY = 0

  switch (Math.floor(object.angle! / 90)) {
    case CIRCLE_QUARTERS.first:
      objectLeftX =
        -objectWidth / 2 +
        Math.sin((object.angle! * Math.PI) / 180) * object.getScaledHeight()
      objectTopY = objectHeight / 2
      break
    case CIRCLE_QUARTERS.second:
      objectLeftX = objectWidth / 2
      objectTopY =
        -objectHeight / 2 +
        Math.sin((object.angle! * Math.PI) / 180) * object.getScaledWidth()
      break
    case CIRCLE_QUARTERS.third:
      objectLeftX =
        objectWidth / 2 +
        Math.sin((object.angle! * Math.PI) / 180) * object.getScaledHeight()
      objectTopY = -objectHeight / 2
      break
    case CIRCLE_QUARTERS.fourth:
      objectLeftX = -objectWidth / 2
      objectTopY =
        objectHeight / 2 +
        Math.sin((object.angle! * Math.PI) / 180) * object.getScaledWidth()
      break
    default:
      break
  }

  return {
    objectLeftX,
    objectTopY,
  }
}
