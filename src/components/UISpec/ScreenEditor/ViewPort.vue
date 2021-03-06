<template>
  <div class="Viewport">
    <div class="Viewport_Inner">
      <EditorCanvas
        v-if="isShowImage"
        :editScreen="editScreen"
        :coordinates="coordinates"
        :zoomedWidth="zoomedWidth"
        :zoomedHeight="zoomedHeight"
        :viewbox="viewbox"
        @loadImage="onLoadImage"
        @errorImage="onErrorImage"
        @addHighlight="onAddHighlight"
        @selectHighlight="onSelectHighlight"
        @setCoordinates="onSetCoordinates"
        @removeHighlight="onRemoveHighlight"
      />
      <EditorDrop v-else @setImage="onSetImage" />
    </div>
  </div>
</template>

<script>
import EditorCanvas from './ViewPort/EditorCanvas.vue'
import EditorDrop from './ViewPort/EditorDrop.vue'
export default {
  name: 'Viewport',
  components: {
    EditorCanvas,
    EditorDrop,
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
  data() {
    return {
      isImageLoaded: true,
    }
  },
  computed: {
    isShowImage() {
      return (!!this.editScreen.src || !!this.editScreen.srcBase64) && this.isImageLoaded
    },
  },
  methods: {
    onLoadImage() {
      this.isImageLoaded = true
    },
    onErrorImage() {
      this.isImageLoaded = false
    },
    onAddHighlight(svgCoordinate) {
      this.$emit('addHighlight', svgCoordinate)
    },
    onSetImage({ src, filename, width, height }, { fileToUpload }) {
      this.isImageLoaded = true
      this.$emit('setImage', { src, filename, width, height }, { fileToUpload })
    },
    onSelectHighlight(order) {
      this.$emit('selectHighlight', order)
    },
    onSetCoordinates({ order, coordinateArray }) {
      this.$emit('setCoordinates', { order, coordinateArray })
    },
    onRemoveHighlight() {
      this.$emit('removeHighlight')
    },
  },
}
</script>

<style lang="scss" scoped>
.Viewport {
  position: relative;
  display: table-cell;
  &_Inner {
    box-sizing: border-box;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 20px;
    text-align: center;
    overflow: auto;
  }
}
</style>
