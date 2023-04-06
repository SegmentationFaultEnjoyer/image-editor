import type { fabric } from 'fabric'
import type { Ref } from 'vue'

export type ZoomType = 'zoom' | 'reset'
export type AlignType = 'center' | 'left' | 'right'
export type FabricColor = string | fabric.Pattern | fabric.Gradient
export type FabricStyle = FabricColor | number

export enum BRUSHES {
  pencil = 'pencil',
  spray = 'spray',
  circle = 'circle',
}

export interface UseImageEditor
  extends UseText,
    UseShapes,
    UseObjectMutations,
    UseCanvasOperations,
    UseDrawing {
  canvas: fabric.Canvas | null
  activeObject: Ref<fabric.Object | null>
  contextMenuState: Ref<{
    isShown: boolean
    target?: fabric.Object
  }>
  init: (
    imageUrl: string,
    customOptions?: fabric.IImageOptions,
  ) => Promise<void>
  unmountCleanUp: Ref<(() => void) | null>
}

export interface UseText {
  addText: (value: string, options?: fabric.ITextOptions) => void
  switchBoldness: (object?: fabric.IText) => void
  switchItalic: (object?: fabric.IText) => void
  changeFont: (font: string, object?: fabric.IText) => void
  changeFontSize: (size: number, object?: fabric.IText) => void
  changeTextAlign: (alignType: AlignType, object?: fabric.IText) => void
  isText: (object: fabric.Object) => boolean
  addFrame: (
    color: string,
    width: number,
    padding: number,
    object?: fabric.IText,
  ) => void
}

export interface UseShapes {
  addRectangle: (options?: fabric.IRectOptions) => void
  addTriangle: (options?: fabric.ITriangleOptions) => void
  addCircle: (options?: fabric.ICircleOptions) => void
  isShape: (object: fabric.Object) => boolean
  isDrawingObject: (object: fabric.Object) => boolean
}

export interface UseCanvasOperations {
  copyObjectToClipboard: (object?: fabric.Object) => void
  pasteObjectFromClipboard: () => void
  deleteObjects: (deleteAll?: boolean, objects?: fabric.Object[]) => void
  discardActiveObject: () => void
  download: (options?: fabric.IDataURLOptions) => void
  canvasToFormData: (options?: fabric.IDataURLOptions) => FormData | null
  zoom: (zoomType: ZoomType, scaleFactor?: number) => void
  undo: () => void
  redo: () => void
  currentZoom: Ref<number>
}

export interface UseDrawing {
  startDraw: (brush: BRUSHES, options?: Partial<fabric.BaseBrush>) => void
  modifyBrush: (options: Partial<fabric.BaseBrush>) => void
  stopDraw: () => void
}

export interface UseObjectMutations {
  setColor: (color: FabricColor, object?: fabric.Object) => void
  setBackgroundColor: (color: string, object?: fabric.Object) => void
  setStroke: (
    strokeOptions: Partial<
      Pick<fabric.IObjectOptions, 'stroke' | 'strokeWidth'>
    >,
    object?: fabric.Object,
  ) => void
  bringToFront: (object?: fabric.Object) => void
  sendToBack: (object?: fabric.Object) => void
}
