<template>
  <div class="ItemOrderControl">
    <div class="ItemOrderControl_Item">
      <a @click="onChangeSelectedItemLabel(-1)">
        &lt;
      </a>
    </div>
    <div>
      <input class="ItemOrderControl_Input" :value="selectedItemLabel" type="text" />
    </div>
    <div class="ItemOrderControl_Item">
      <a @click="onChangeSelectedItemLabel(1)">
        &gt;
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemOrderControl',
  props: {
    selectedItemLabel: {
      type: Number,
      required: true,
    },
  },
  methods: {
    onChangeSelectedItemLabel(relativeValue) {
      this.$emit('changeSelectedItemLabel', { relativeValue })
    },
  },
}
</script>

<style lang="scss" scoped>
.ItemOrderControl {
  display: grid;
  grid-template-columns: 20px 50px 20px;
  &_Item {
    text-align: center;
  }
  &_Input {
    height: 14px;
    width: 40px;
  }
}
</style>
