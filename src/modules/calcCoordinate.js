const calcCoordinate = (currentCoordinate, coordinateArray, { imageWidth, imageHeight }) => {
  const [currentX, currentY, currentW, currentH] = currentCoordinate
  let [x, y, w, h] = coordinateArray

  //-------------
  // 幅と高
  //-------------
  const MIN_SIZE = 20 // ハイライトの縦横の最低限保証される幅
  w = Math.max(w, MIN_SIZE)
  h = Math.max(h, MIN_SIZE)
  // x軸がマイナスなら、現在の幅を使用
  if (x < 0) {
    w = currentW
  }
  // x軸と現在のハイライトの幅の合算が画像を超えるような大きさであれば、現在の幅と新しい幅の小さい方を採用(?)
  if (x + currentW >= imageWidth) {
    w = Math.min(w, currentW)
  }
  // y軸がマイナスなら、現在の高さを使用
  if (y < 0) {
    h = currentH
  }
  // y軸とハイライトの高さの合算が画像を超えるような大きさであれば、現在の高さと新しい高さの小さい方を採用(?)
  if (y + currentH >= imageHeight) {
    h = Math.min(h, currentH)
  }

  //-------------
  // x,y軸
  //-------------
  // 各軸が画像サイズ内に収まっていることを保証
  x = Math.min(x, imageWidth - w)
  y = Math.min(y, imageHeight - h)
  // 各軸が0以上になることを保証
  x = Math.max(x, 0)
  y = Math.max(y, 0)

  //-------------
  // まとめ
  //-------------
  x = x | 0
  y = y | 0
  w = w | 0
  h = h | 0
  return { x, y, w, h }
}

export default calcCoordinate
