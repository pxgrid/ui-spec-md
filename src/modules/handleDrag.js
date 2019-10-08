const handleDrag = e => {
  const { draggingEl, dragStartOffsetX, dragStartOffsetY } = this.state
  const { coord, order, coordsAction, getCoordByXY, width, height } = this.props

  let svgCoord = getCoordByXY(e)

  let _svgCoordX = svgCoord.x
  let _svgCoordY = svgCoord.y
  _svgCoordX = Math.max(_svgCoordX, 0)
  _svgCoordY = Math.max(_svgCoordY, 0)
  _svgCoordX = Math.min(_svgCoordX, width)
  _svgCoordY = Math.min(_svgCoordY, height)

  let prevBox = {
    x: coord[0],
    y: coord[1],
    w: coord[2],
    h: coord[3],
  }

  let newBox = {
    x: prevBox.x,
    y: prevBox.y,
    w: prevBox.w,
    h: prevBox.h,
  }

  if (/r/.test(draggingEl)) {
    newBox.w = Math.max(_svgCoordX - prevBox.x, MINIMUM_SIZE)
  } else if (/l/.test(draggingEl)) {
    let left = _svgCoordX
    let right = prevBox.w + prevBox.x
    let maxLeft = right - MINIMUM_SIZE

    newBox.x = Math.min(left, maxLeft)
    newBox.w = prevBox.w + (prevBox.x - newBox.x)
  }

  if (/b/.test(draggingEl)) {
    newBox.h = Math.max(_svgCoordY - prevBox.y, MINIMUM_SIZE)
  } else if (/t/.test(draggingEl)) {
    let top = _svgCoordY
    let bottom = prevBox.h + prevBox.y
    let maxTop = bottom - MINIMUM_SIZE

    newBox.y = Math.min(top, maxTop)
    newBox.h = prevBox.h + (prevBox.y - newBox.y)
  }

  if (/c/.test(draggingEl)) {
    newBox.x = _svgCoordX - dragStartOffsetX
    newBox.y = _svgCoordY - dragStartOffsetY
  }
  coordsAction(order, [newBox.x, newBox.y, newBox.w, newBox.h])
}

export default handleDrag
