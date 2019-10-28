<template>
  <div class="ScreenEditor">
    <Toolbar
      :editScreen="editScreen"
      :coordinates="coordinates"
      :selectedItemLabel="selectedItemLabel"
      :filenameWithCoordinates="filenameWithCoordinates"
      @changeSelectedItemLabel="onChangeSelectedItemLabel"
      @removeScreenMetadata="onRemoveScreenMetadata"
      @zoom="onZoom"
    />
    <div v-show="isInitializing">Loading...</div>
    <div v-show="!isInitializing" class="ScreenEditor_Container">
      <ViewPort
        :editScreen="editScreen"
        :coordinates="coordinates"
        :zoomedWidth="zoomedWidth"
        :zoomedHeight="zoomedHeight"
        :viewbox="viewbox"
        @addHighlight="onAddHighlight"
        @setImage="onSetImage"
        @selectHighlight="onSelectHighlight"
        @setCoordinates="onSetCoordinates"
        @removeHighlight="onRemoveHighlight"
      />
    </div>
  </div>
</template>

<script>
import Toolbar from './ScreenEditor/Toolbar.vue'
import ViewPort from './ScreenEditor/ViewPort.vue'
import ScreenEditorManager from '../class/ScreenEditorManager'
export default {
  name: 'ScreenEditor',
  components: {
    Toolbar,
    ViewPort,
  },
  props: {
    screen: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isInitializing: true,
      manager: new ScreenEditorManager(),
    }
  },
  computed: {
    editScreen() {
      return this.manager.editScreen
    },
    coordinates() {
      return this.manager.coordinates
    },
    zoomedWidth() {
      return this.manager.zoomedWidth
    },
    zoomedHeight() {
      return this.manager.zoomedHeight
    },
    viewbox() {
      return this.manager.viewbox
    },
    selectedItemLabel() {
      return this.manager.selectedItemLabel
    },
    filenameWithCoordinates() {
      return this.manager.filenameWithCoordinates
    },
  },
  async mounted() {
    await this.manager.initialize({ screen: this.screen })
    this.onInitialized()
  },
  methods: {
    onSelectHighlight(order) {
      this.manager.selectHighlight = order
    },
    onZoom(zoomValue) {
      this.manager.zoom = zoomValue
    },
    onUpdateFilenameWithCoordinates() {
      this.$emit('updateFilenameWithCoordinates', {
        filenameWithCoordinates: this.manager.filenameWithCoordinates,
      })
    },
    onUpdateFileToUpload() {
      this.$emit('updateFileToUpload', {
        fileToUpload: this.manager.fileToUpload,
      })
    },

    // need trigger onUpdateFilenameWithCoordinates
    onInitialized() {
      this.isInitializing = false
      this.onUpdateFilenameWithCoordinates()
    },
    onAddHighlight({ x, y }) {
      this.manager.addHighlight = { x, y }
      this.onUpdateFilenameWithCoordinates()
    },
    onChangeSelectedItemLabel({ relativeValue }) {
      this.manager.changeSelectedItemLabel = { relativeValue }
      this.onUpdateFilenameWithCoordinates()
    },
    onSetImage({ src, filename, width, height }, { fileToUpload = null }) {
      this.manager.setImage = { src, filename, width, height }
      this.manager.setFileToUpload = fileToUpload
      this.onUpdateFilenameWithCoordinates()
      this.onUpdateFileToUpload()
    },
    onSetCoordinates({ order, coordinateArray }) {
      this.manager.setCoordinates = { order, coordinateArray }
      this.onUpdateFilenameWithCoordinates()
    },
    onRemoveHighlight() {
      this.manager.removeHighlight()
      this.onUpdateFilenameWithCoordinates()
    },
    onRemoveScreenMetadata() {
      this.manager.reset()
      this.onUpdateFilenameWithCoordinates()
    },
  },
}
</script>

<style lang="scss" scoped>
.ScreenEditor {
  table-layout: fixed;
  display: table;
  width: 100%;
  height: 100%;
  &_Container {
    height: 100%;
    display: table-row;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAF0lEQVR4AWP4DwVvoWCgBGAMmMQACQAAuK72AWHjK4wAAAAASUVORK5CYII=);
  }
}
</style>
