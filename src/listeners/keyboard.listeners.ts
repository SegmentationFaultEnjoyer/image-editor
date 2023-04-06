import type { fabric } from 'fabric'
import { useCanvasOperations } from '@/composables'

enum ARROW_KEYS {
  left = 'ArrowLeft',
  up = 'ArrowUp',
  right = 'ArrowRight',
  down = 'ArrowDown',
}

enum KEYBOARD_KEYS {
  c = 'c',
  v = 'v',
  z = 'z',
}

/**
 * Adds a listener to the document for the 'Delete' keydown event.
 * If the active object on the given canvas exist,
 * it is removed from the canvas.
 *
 * @param canvas
 * The Fabric.js canvas object to add listner to.
 *
 * @returns
 * Function, that removes this listener from the Document
 */

export function setDeleteObjectListener(canvas: fabric.Canvas) {
  const { deleteObjects } = useCanvasOperations(canvas)

  const listener = (event: KeyboardEvent) => {
    if (event.key !== 'Delete') return

    deleteObjects()
  }

  document.addEventListener('keyup', listener)

  const removeListener = () => {
    document.removeEventListener('keyup', listener)
  }

  return removeListener
}

/**
 * Sets a listener for moving objects using keyboard arrow keys.
 * @param canvas - The Fabric.js canvas object to add listner to.
 * @param moveStep- The amount of pixels to move the object by on each
 * arrow key press (default=1)
 * @returns
 * Function, that removes this listener from the Document
 */

export function setMoveObjectsListener(canvas: fabric.Canvas, moveStep = 1) {
  const listener = (event: KeyboardEvent) => {
    if (!Object.values(ARROW_KEYS).includes(event.key as unknown as ARROW_KEYS))
      return

    event.preventDefault()

    const activeObjects = canvas.getActiveObjects()
    if (!activeObjects.length) return

    activeObjects.forEach(object => {
      if (!object.top || !object.left) return

      switch (event.key) {
        case ARROW_KEYS.up:
          object.set({
            top: object.top - moveStep,
          })
          break
        case ARROW_KEYS.down:
          object.set({
            top: object.top + moveStep,
          })
          break
        case ARROW_KEYS.left:
          object.set({
            left: object.left - moveStep,
          })
          break
        case ARROW_KEYS.right:
          object.set({
            left: object.left + moveStep,
          })
          break
        default:
          break
      }
      canvas.renderAll()
    })
  }

  document.addEventListener('keydown', listener)

  const removeListener = () => {
    document.removeEventListener('keydown', listener)
  }

  return removeListener
}

/**
 * Sets up copy and paste event listeners for a Fabric.js canvas.
 *
 * (CTRL + C / CTRL + V)
 * @param canvas - The Fabric.js canvas instance to attach the listeners to.
 * @returns
 * Function, that removes listeners from the Document
 */

export function setCopyPasteListeners(copy: () => void, paste: () => void) {
  const copyListener = (event: KeyboardEvent) => {
    if (event.key !== KEYBOARD_KEYS.c || (!event.metaKey && !event.ctrlKey))
      return

    copy()
  }

  const pasteListener = (event: KeyboardEvent) => {
    if (event.key !== KEYBOARD_KEYS.v || (!event.metaKey && !event.ctrlKey))
      return

    paste()
  }

  document.addEventListener('keydown', copyListener)
  document.addEventListener('keydown', pasteListener)

  const removeListeners = () => {
    document.removeEventListener('keydown', copyListener)
    document.removeEventListener('keydown', pasteListener)
  }

  return removeListeners
}

/**
 * Sets up a listener for keyboard events that enables undo/redo functionality
 * using the History class.
 *
 * (CTRL + Z / CTRL + SHIFT + Z)
 * @param canvas - The canvas object to attach the listener to.
 * @returns
 * Function, that removes this listener from the Document
 */
export function setHistoryNavigationListener(
  undo: () => void,
  redo: () => void,
) {
  const listener = (event: KeyboardEvent) => {
    if (
      event.key.toLowerCase() !== KEYBOARD_KEYS.z ||
      (!event.metaKey && !event.ctrlKey)
    )
      return

    if (!event.shiftKey) {
      undo()
      return
    }

    redo()
  }

  document.addEventListener('keydown', listener)

  const removeListener = () => {
    document.removeEventListener('keydown', listener)
  }

  return removeListener
}
