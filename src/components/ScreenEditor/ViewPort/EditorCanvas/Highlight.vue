<template>
  <g :aria-selected="selected" class="Highlight">
    <rect :x="x" :y="y" :width="w" :height="h" class="Highlight _fill" />
    <rect :x="x - 2" :y="y - 2" :width="w + 4" :height="h + 4" class="Highlight _outline" />
    <text :x="x + 2" :y="y - 2" :dy="h - 2" class="Highlight _label">
      {{ order + 1 }}
    </text>
    <rect
      ref="c"
      :x="x"
      :y="y"
      :width="w"
      :height="h"
      class="Highlight _clickableArea"
      @mousedown="dragStart('c', $event)"
    />
    <rect
      ref="t"
      :x="x - 5 + w * 0.5"
      :y="y - 5"
      :width="10"
      :height="10"
      class="Highlight _ctrl _ctrl--t"
      @mousedown="dragStart('t', $event)"
    />
    <rect
      ref="r"
      :x="x - 5 + w"
      :y="y - 5 + h * 0.5"
      :width="10"
      :height="10"
      class="Highlight _ctrl Highlight _ctrl--r"
      @mousedown="dragStart('r', $event)"
    />
    <rect
      ref="b"
      :x="x - 5 + w * 0.5"
      :y="y - 5 + h"
      :width="10"
      :height="10"
      class="Highlight _ctrl Highlight _ctrl--b"
      @mousedown="dragStart('b', $event)"
    />
    <rect
      ref="l"
      :x="x - 5"
      :y="y - 5 + h * 0.5"
      :width="10"
      :height="10"
      class="Highlight _ctrl Highlight _ctrl--l"
      @mousedown="dragStart('l', $event)"
    />
    <circle
      ref="tl"
      :cx="x"
      :cy="y"
      :r="10"
      class="Highlight _ctrl Highlight _ctrl--tl"
      @mousedown="dragStart('tl', $event)"
    />
    <circle
      ref="tr"
      :cx="x + w"
      :cy="y"
      :r="10"
      class="Highlight _ctrl Highlight _ctrl--tr"
      @mousedown="dragStart('tr', $event)"
    />
    <circle
      ref="br"
      :cx="x + w"
      :cy="y + h"
      :r="10"
      class="Highlight _ctrl Highlight _ctrl--br"
      @mousedown="dragStart('br', $event)"
    />
    <circle
      ref="bl"
      :cx="x"
      :cy="y + h"
      :r="10"
      class="Highlight _ctrl Highlight _ctrl--bl"
      @mousedown="dragStart('bl', $event)"
    />
  </g>
</template>

<script>
export default {
  name: 'Highlight',
  props: {
    order: {
      type: Number,
      default: 0,
    },
    coordinate: {
      type: Array,
      default: () => {
        return []
      },
    },
    selected: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    getCoordinateByXY: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      draggingElement: {
        refCode: null,
        startOffsetX: 0,
        startOffsetY: 0,
      },
    }
  },
  computed: {
    x() {
      return this.coordinate[0]
    },
    y() {
      return this.coordinate[1]
    },
    w() {
      return this.coordinate[2]
    },
    h() {
      return this.coordinate[3]
    },
  },
  created() {
    this._handleDrag = this._handleDrag.bind(this)
    this._dragEnd = this._dragEnd.bind(this)
  },
  mounted() {
    document.addEventListener('mouseup', this._dragEnd)
  },
  unmounted() {
    document.addEventListener('mouseup', this._dragEnd)
  },
  methods: {
    dragStart(refCode, e) {
      e.stopPropagation()
      const svgCoordinate = this.getCoordinateByXY(e)
      this.setDraggingElement({
        refCode: refCode,
        startOffsetX: svgCoordinate.x - this.x,
        startOffsetY: svgCoordinate.y - this.y,
      })
      document.body.classList.add('--dragging')
      document.removeEventListener('mousemove', this._handleDrag)
      document.addEventListener('mousemove', this._handleDrag)

      this.selectHighlight(this.order)
    },
    setDraggingElement({ refCode, startOffsetX, startOffsetY }) {
      this.draggingElement = { refCode, startOffsetX, startOffsetY }
    },
    selectHighlight(order) {
      this.$emit('selectHighlight', order)
    },
    setCoordinates({ order, coordinateArray }) {
      this.$emit('setCoordinates', { order, coordinateArray })
    },
    _dragEnd() {
      this.setDraggingElement({
        refCode: null,
        startOffsetX: null,
        startOffsetY: null,
      })
      document.body.classList.remove('--dragging')
      document.removeEventListener('mousemove', this._handleDrag)
    },
    _handleDrag(e) {
      const MIN_SIZE = 20
      const { refCode, startOffsetX, startOffsetY } = this.draggingElement
      const svgCoordinate = this.getCoordinateByXY(e)

      let _svgCoordinateX = svgCoordinate.x
      let _svgCoordinateY = svgCoordinate.y
      _svgCoordinateX = Math.max(_svgCoordinateX, 0)
      _svgCoordinateY = Math.max(_svgCoordinateY, 0)
      _svgCoordinateX = Math.min(_svgCoordinateX, this.width)
      _svgCoordinateY = Math.min(_svgCoordinateY, this.height)

      let prevBox = {
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h,
      }
      let newBox = {
        x: prevBox.x,
        y: prevBox.y,
        w: prevBox.w,
        h: prevBox.h,
      }

      if (/r/.test(refCode)) {
        newBox.w = Math.max(_svgCoordinateX - prevBox.x, MIN_SIZE)
      } else if (/l/.test(refCode)) {
        const left = _svgCoordinateX
        const right = prevBox.w + prevBox.x
        const maxLeft = right - MIN_SIZE
        newBox.x = Math.min(left, maxLeft)
        newBox.w = prevBox.w + (prevBox.x - newBox.x)
      }

      if (/b/.test(refCode)) {
        newBox.h = Math.max(_svgCoordinateY - prevBox.y, MIN_SIZE)
      } else if (/t/.test(refCode)) {
        const top = _svgCoordinateY
        const bottom = prevBox.h + prevBox.y
        const maxTop = bottom - MIN_SIZE
        newBox.y = Math.min(top, maxTop)
        newBox.h = prevBox.h + (prevBox.y - newBox.y)
      }

      if (/c/.test(refCode)) {
        newBox.x = _svgCoordinateX - startOffsetX
        newBox.y = _svgCoordinateY - startOffsetY
      }
      this.setCoordinates({
        order: this.order,
        coordinateArray: [newBox.x, newBox.y, newBox.w, newBox.h],
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.Highlight {
  &._fill {
    stroke: red;
    stroke-width: 2;
    stroke-opacity: 0.5;
    fill: red;
    fill-opacity: 0.25;
    cursor: move;
  }
  &._outline {
    stroke: red;
    stroke-width: 2;
    stroke-opacity: 0.5;
    fill: red;
    fill-opacity: 0.25;
    cursor: move;
  }
  &._label {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-family: 'ヒラギノ角ゴ Pro W3', 'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, sans-serif;
    font-weight: bold;
    font-size: 30px;
    stroke: #fff;
    stroke-width: 1;
    fill: red;
  }
  &._clickableArea {
    cursor: move;
    fill: transparent;
  }
  &._ctrl {
    fill: #66f;
    fill-opacity: 0.6;
    stroke: #66f;
    stroke-width: 1.5;
    cursor: pointer;
  }
  &._ctrl--t {
    cursor: ns-resize;
  }
  &._ctrl--r {
    cursor: ew-resize;
  }
  &._ctrl--b {
    cursor: ns-resize;
  }
  &._ctrl--l {
    cursor: ew-resize;
  }
  &._ctrl--tl {
    cursor: nwse-resize;
  }
  &._ctrl--tr {
    cursor: nesw-resize;
  }
  &._ctrl--br {
    cursor: nwse-resize;
  }
  &._ctrl--bl {
    cursor: nesw-resize;
  }
}
</style>
