<template>
  <div class="ItemCoordinateControl">
    <div class="ItemCoordinateControl_Label">
      <a> {{ coordinateKey }}: </a>
    </div>
    <div>
      <input
        :value="coordinateValue"
        class="ItemCoordinateControl_Input"
        type="number"
        min="0"
        max="10000"
        readonly="readonly"
      />
    </div>
  </div>
</template>

<script>
const LOOKUP = { x: 0, y: 1, w: 2, h: 3 }
export default {
  name: 'ItemCoordinateControl',
  props: {
    editScreen: {
      type: Object,
      required: true,
    },
    coordinates: {
      type: Array,
      required: true,
    },
    coordinateKey: {
      // 'x' or 'y' or 'w' or 'h'
      type: String,
      required: true,
    },
  },
  computed: {
    coordinateValue() {
      const selectedItem = this.editScreen.selectedItem
      const isValid = this.coordinates.length && typeof selectedItem === 'number'
      if (!isValid) {
        return ''
      }
      const coordinateIndex = LOOKUP[this.coordinateKey]
      return this.coordinates[selectedItem][coordinateIndex]
    },
  },
}
</script>

<style lang="scss" scoped>
.ItemCoordinateControl {
  display: grid;
  grid-template-columns: 20px 1fr;
  &_Label {
    text-align: center;
  }
  &_Input {
    height: 14px;
  }
}
</style>
