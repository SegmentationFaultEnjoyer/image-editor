import type { fabric } from 'fabric'

const NON_DEFAULT_PROPS = ['padding']
const MAX_HISTORY_CAPACITY = 25

class Memento {
  private readonly state: string

  constructor(canvas: fabric.Canvas) {
    this.state = JSON.stringify(canvas.toJSON(NON_DEFAULT_PROPS))
  }

  public getState(): string {
    return this.state
  }
}

class CanvasState {
  private readonly canvas: fabric.Canvas
  // object's listeners sholdn't be triggered by actions of History class
  public triggerLock = false

  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas
  }

  public restoreState(state: string): void {
    this.triggerLock = true

    this.canvas.clear()
    this.canvas.loadFromJSON(state, () => {
      this.canvas.renderAll()
      this.triggerLock = false
    })
  }

  public saveState(): Memento {
    return new Memento(this.canvas)
  }
}

/**
 * A class that maintains a history of canvas states and enables
 * undo/redo functionality.
 *
 * @class
 * @property canvasState
 * - The state of the canvas at a given point in time.
 * @property history
 * - An array of mementos representing the history of canvas states.
 * @property currentIdx
 * - The current index in the history array.
 */
export class History {
  private readonly canvasState: CanvasState
  private history: Memento[] = []
  private currentIdx = -1

  constructor(canvas: fabric.Canvas) {
    this.canvasState = new CanvasState(canvas)

    canvas.on('object:added', event => {
      if (!event.target || this.canvasState.triggerLock) return

      this.addState()
    })

    canvas.on('object:modified', event => {
      if (!event.target || this.canvasState.triggerLock) return

      this.addState()
    })

    canvas.on('object:removed', event => {
      if (!event.target || this.canvasState.triggerLock) return

      this.addState()
    })

    this.addState()
  }

  private addState(): void {
    const memento = this.canvasState.saveState()

    // cutting off redo history branch after user manually applies changes
    if (this.currentIdx !== -1)
      this.history = this.history.slice(0, this.currentIdx + 1)

    if (this.history.length > MAX_HISTORY_CAPACITY)
      this.history = [this.history.at(-1)!]

    this.history.push(memento)
    this.currentIdx = this.history.length - 1
  }

  public undo(): void {
    if (!this.currentIdx) return

    this.currentIdx--

    const memento = this.history[this.currentIdx]

    this.canvasState.restoreState(memento.getState())
  }

  public redo(): void {
    if (this.currentIdx >= this.history.length - 1) return

    this.currentIdx++

    const memento = this.history[this.currentIdx]

    this.canvasState.restoreState(memento.getState())
  }
}
