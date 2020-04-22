<template>
  <div class="Toolbar">
    <div>
      <label class="Toolbar_Label">
        src
      </label>
    </div>
    <div>
      <ItemSrcControl :filenameWithCoordinates="filenameWithCoordinates" />
    </div>

    <div>
      <label class="Toolbar_Label">
        label
      </label>
    </div>
    <div class="Toolbar_HighlightControllers">
      <ItemOrderControl
        :selectedItemLabel="selectedItemLabel"
        @changeSelectedItemLabel="onChangeSelectedItemLabel"
      />
      <ItemCoordinateControl
        :coordinateKey="'x'"
        :editScreen="editScreen"
        :coordinates="coordinates"
      />
      <ItemCoordinateControl
        :coordinateKey="'y'"
        :editScreen="editScreen"
        :coordinates="coordinates"
      />
      <ItemCoordinateControl
        :coordinateKey="'w'"
        :editScreen="editScreen"
        :coordinates="coordinates"
      />
      <ItemCoordinateControl
        :coordinateKey="'h'"
        :editScreen="editScreen"
        :coordinates="coordinates"
      />
      <ItemZoomControl @zoom="onZoom" />
      <div>
        <button @click="onRemoveScreenMetadata">Delete Image</button>
      </div>
    </div>
  </div>
</template>

<script>
import ItemSrcControl from './Toolbar/ItemSrcControl.vue'
import ItemCoordinateControl from './Toolbar/ItemCoordinateControl.vue'
import ItemZoomControl from './Toolbar/ItemZoomControl.vue'
import ItemOrderControl from './Toolbar/ItemOrderControl.vue'
export default {
  name: 'Toolbar',
  components: {
    ItemSrcControl,
    ItemCoordinateControl,
    ItemZoomControl,
    ItemOrderControl,
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
    selectedItemLabel: {
      type: Number,
      required: true,
    },
    filenameWithCoordinates: {
      type: String,
      required: true,
    },
  },
  methods: {
    onChangeSelectedItemLabel({ relativeValue }) {
      this.$emit('changeSelectedItemLabel', { relativeValue })
    },
    onZoom(zoomValue) {
      this.$emit('zoom', zoomValue)
    },
    onRemoveScreenMetadata() {
      this.$emit('removeScreenMetadata')
    },
  },
}
</script>

<style lang="scss" scoped>
.Toolbar {
  font-size: 12px;
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-template-rows: 20px 20px;
  column-gap: 5px;
  row-gap: 5px;
  padding: 5px;
  color: #eeeeee;
  background-color: #666666;
  &_Label {
    color: #dddddd;
  }
  &_FieldLabel {
  }
  &_HighlightControllers {
    display: grid;
    grid-template-columns: 100px 100px 100px 100px 100px 220px 100px;
  }
}
</style>
