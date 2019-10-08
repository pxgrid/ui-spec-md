<template>
  <div class="DocEditorTabBar">
    <nav class="DocEditorTabBar_Tabs">
      <button
        class="DocEditorTabBar_WriteTab"
        :class="{ _active: isActiveWrite }"
        @click="onClickWriteTab"
      >
        Write
      </button>
      <button
        class="DocEditorTabBar_PreviewTab"
        :class="{ _active: !isActiveWrite }"
        @click="onClickPreviewTab"
      >
        Preview
      </button>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'DocEditorTabBar',
  data() {
    return {
      isActiveWrite: true,
    }
  },
  methods: {
    onClickWriteTab() {
      this.isActiveWrite = true
      this.$emit('activeWrite')
    },
    onClickPreviewTab() {
      this.isActiveWrite = false
      this.$emit('activePreview')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../../assets/variable.scss';
.DocEditorTabBar {
  height: $documentEditorTabBarHeight;
  background-color: #dfdfdf;
  &_Tabs {
    margin-bottom: -1px;
    padding: 8px 8px 0 8px;
  }
  &_WriteTab,
  &_PreviewTab {
    display: inline-block;
    height: 32px;
    width: 80px;
    text-align: center;
    padding-top: 6px;
    font-size: 12px;
    background-color: transparent;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    border-bottom: 0;
    &._active {
      background-color: #ffffff;
    }
  }
}
</style>
