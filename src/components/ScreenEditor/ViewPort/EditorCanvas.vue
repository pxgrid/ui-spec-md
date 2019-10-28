<template>
  <svg
    ref="svg"
    :width="zoomedWidth"
    :height="zoomedHeight"
    :viewBox="viewbox"
    class="EditorCanvas"
    @click="onClickSVG"
  >
    <image
      v-bind="{ 'xlink:href': imageSrc }"
      :width="editScreen.width"
      :height="editScreen.height"
      class="EditorCanvas_Image"
    />
    <Highlight
      v-for="(coordinate, index) in coordinates"
      :key="index"
      :order="index"
      :coordinate="coordinate"
      :selected="index === coordinate.selectedItem"
      :width="editScreen.width"
      :height="editScreen.height"
      :getCoordinateByXY="getCoordinateByXY"
      @selectHighlight="onSelectHighlight"
      @setCoordinates="onSetCoordinates"
    />
  </svg>
</template>

<script>
import Highlight from './EditorCanvas/Highlight.vue'
export default {
  name: 'EditorCanvas',
  components: {
    Highlight,
  },
  props: {
    editScreen: {
      type: Object,
      required: true,
    },
    coordinates: {
      type: Array,
      required: true,
    },
    zoomedWidth: {
      type: Number,
      required: true,
    },
    zoomedHeight: {
      type: Number,
      required: true,
    },
    viewbox: {
      type: String,
      required: true,
    },
  },
  computed: {
    imageSrc() {
      return this.editScreen.srcBase64 ? this.editScreen.srcBase64 : this.editScreen.src
    },
  },
  created() {
    this._handleKeyDown = this._handleKeyDown.bind(this)
  },
  mounted() {
    document.removeEventListener('keydown', this._handleKeyDown)
    document.addEventListener('keydown', this._handleKeyDown)
  },
  unmounted() {
    document.removeEventListener('keydown', this._handleKeyDown)
  },
  methods: {
    onSelectHighlight(order) {
      this.$emit('selectHighlight', order)
    },
    onSetCoordinates({ order, coordinateArray }) {
      this.$emit('setCoordinates', { order, coordinateArray })
    },
    removeHighlight() {
      this.$emit('removeHighlight')
    },
    _handleKeyDown(e) {
      if (e.keyCode === 8) {
        e.preventDefault()
        this.removeHighlight()
      }
    },
    onClickSVG(e) {
      e.preventDefault
      e.stopPropagation()
      if (!e.target.classList.contains('EditorCanvas_Image')) {
        return
      }
      const { x, y } = this.getCoordinateByXY(e)
      this.addHighlight({ x, y })
    },
    getCoordinateByXY({ x, y }) {
      let svg = this.$refs.svg
      let p = svg.createSVGPoint()
      p.x = x | 0
      p.y = y | 0
      const transformed = p.matrixTransform(svg.getScreenCTM().inverse())
      return {
        x: Math.round(transformed.x),
        y: Math.round(transformed.y),
      }
    },
    addHighlight({ x, y }) {
      this.$emit('addHighlight', { x, y })
    },
  },
}
</script>

<style lang="scss" scoped>
.EditorCanvas {
  transition: all 0.3s;
  cursor: crosshair;
  &_Image {
  }
}
</style>
