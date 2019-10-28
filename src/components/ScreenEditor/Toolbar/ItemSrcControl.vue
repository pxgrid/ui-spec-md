<template>
  <div class="ItemSrcControl">
    <div>
      <input
        ref="filename"
        :value="filenameWithCoordinates"
        class="ItemSrcControl_Url"
        type="text"
        readonly="readonly"
        @click="onClickFilename()"
      />
    </div>
    <div>
      <button class="ItemSrcControl_Button" @click="onClickCopy">
        copy
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemSrcControl',
  props: {
    filenameWithCoordinates: {
      type: String,
      required: true,
    },
  },
  methods: {
    onClickFilename() {
      this.$refs.filename.focus()
      this.$refs.filename.select()
    },
    onClickCopy() {
      this.onClickFilename()
      document.execCommand('copy')
    },
  },
}
</script>

<style lang="scss" scoped>
.ItemSrcControl {
  display: grid;
  grid-template-columns: 1fr 70px;
  &_Url {
    height: 14px;
    width: 100%;
  }
  &_Button {
    color: inherit;
    text-align: center;
    min-width: 20px;
    min-height: 20px;
    padding: 0 15px;
    border: none;
    background: none;
    margin-right: 0;
  }
}
</style>
