import calcCoordinate from '../modules/calcCoordinate'
import getParamsValue from '../modules/getParamsValue'
import loadImage from '../modules/loadImage'

export default class ScreenEditorManager {
  constructor() {
    this.reset()
  }

  // setter
  set setImage({ width, height, src, filename }) {
    Object.assign(this._editScreen, { width, height, src, filename })
  }
  set setFileToUpload(fileToUpload) {
    this._fileToUpload = fileToUpload
  }
  set initCoordinates({ coordinateArrayList }) {
    this._coordinates = coordinateArrayList
  }
  set setCoordinates({ order, coordinateArray }) {
    const currentCoordinate = this._coordinates[order]
    const { x, y, w, h } = calcCoordinate(currentCoordinate, coordinateArray, {
      imageWidth: this._editScreen.width,
      imageHeight: this._editScreen.height,
    })
    this._coordinates[order] = [x, y, w, h]
    this._coordinates = [...this._coordinates] //変更を検知させるため
  }
  set addHighlight({ x, y }) {
    const coordinate = [x, y, 100, 100]
    this._editScreen.selectedItem = this._coordinates.length
    this._coordinates.push(coordinate)
  }
  set selectHighlight(selectedItem) {
    this._editScreen.selectedItem = selectedItem
  }
  set zoom(inputZoom) {
    this._editScreen.zoom = inputZoom
  }
  set changeSelectedItemLabel({ relativeValue }) {
    const editScreen = this._editScreen
    const selectedIndex = editScreen.selectedItem

    const changedIndex = selectedIndex + relativeValue
    if (changedIndex < 0 || changedIndex >= this._coordinates.length) {
      console.warn("Invalid CHANGE_SELECTED_ITEM_LABEL's relativeValue.")
      return
    }
    const selectedCoordinate = this._coordinates.splice(selectedIndex, 1)[0]
    this._coordinates.splice(changedIndex, 0, selectedCoordinate)
    this._editScreen.selectedItem = changedIndex
  }

  // getter
  get editScreen() {
    return this._editScreen
  }
  get coordinates() {
    return this._coordinates
  }
  get selectedItemLabel() {
    return this._editScreen.selectedItem + 1
  }
  get zoomedWidth() {
    return this._editScreen.width * this._editScreen.zoom
  }
  get zoomedHeight() {
    return this._editScreen.height * this._editScreen.zoom
  }
  get viewbox() {
    const w = this._editScreen.width
    const h = this._editScreen.height
    return `0 0 ${w} ${h}`
  }
  get filenameWithCoordinates() {
    const filename = this._editScreen.filename
    const coordinates = this._coordinates
    if (!filename || filename.length === 0) {
      return ''
    }
    return `${filename}?highlight=${JSON.stringify(coordinates)}`
  }
  get fileToUpload() {
    return this._fileToUpload
  }

  // methods
  async initialize({ screen }) {
    return new Promise((resolve, reject) => {
      // ex. /path/to/index.html?src=index.png&highlight=[[1,2,3,4]] => /path/to/index.html
      const screenPath = screen.replace(/\?.+/, '')
      const highlight = getParamsValue(screen, 'highlight')
      this.selectHighlight = 0
      if (screenPath === '') {
        this.reset()
        resolve()
      }
      try {
        const coordinateArrayList = highlight ? JSON.parse(highlight) : []
        this.initCoordinates = { coordinateArrayList }
        loadImage(screenPath).then(({ width, height }) => {
          this.setImage = { width, height, src: screenPath, filename: screenPath }
          resolve()
        })
      } catch (e) {
        // If screen is undefined or invalid
        this.reset()
        reject()
      }
    })
  }
  reset() {
    this._editScreen = {
      width: 300,
      height: 150,
      src: '',
      srcBase64: '',
      filename: '',
      selectedItem: -1, // zero start, -1 is indicates that item is not selected
      zoom: 1.0,
    }
    this._coordinates = [] // [[x, y, w, h], [x, y, w, h],...]
    this._fileToUpload = null
  }
  shiftHighlight() {
    const index = this._editScreen.selectedItem
    if (index <= 0) {
      return
    }
    ;[this._editScreen.selectedItem[index], this._editScreen.selectedItem[index - 1]] = [
      this._editScreen.selectedItem[index - 1],
      this._editScreen.selectedItem[index],
    ]
    this._editScreen.selectedItem--
  }
  unshiftHighlight() {
    if (this._editScreen.selectedItem < 0) {
      return
    }
    if (this._editScreen.selectedItem >= this._coordinates.length) {
      return
    }
    const index = this._editScreen.selectedItem + 1
    ;[this._editScreen.selectedItem[index], this._editScreen.selectedItem[index - 1]] = [
      this._editScreen.selectedItem[index - 1],
      this._editScreen.selectedItem[index],
    ]
    this._editScreen.selectedItem = index
  }
  removeHighlight() {
    const selectedItemIndex = this._editScreen.selectedItem
    if (selectedItemIndex < 0) {
      return
    }
    this._coordinates.splice(selectedItemIndex, 1)
    if (this._coordinates.length <= selectedItemIndex) {
      this._editScreen.selectedItem--
    }
  }
}
