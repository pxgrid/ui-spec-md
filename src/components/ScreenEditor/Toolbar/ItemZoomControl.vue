<template>
  <div class="ItemZoomControl">
    <div class="ItemZoomControl_Label">
      zoom
    </div>
    <div class="ItemZoomControl_Item">
      <input
        class="ItemZoomControl_Range"
        type="range"
        step="0.25"
        min="0.5"
        max="1.5"
        value="1"
        @input="onInput"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemZoomControl',
  methods: {
    onInput(e) {
      //changeイベントでは、リアルタイムに変更が反映されない
      this.$emit('zoom', e.target.value)
    },
  },
}
</script>

<style lang="scss" scoped>
.ItemZoomControl {
  display: grid;
  grid-template-columns: 50px 1fr;
  &_Label {
    text-align: right;
  }
  &_Item {
    padding: 0 10px;
  }
  &_Range {
    height: 20px;
  }
}
</style>
