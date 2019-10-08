<template>
  <div class="DocEditorMarkdown">
    <textarea
      :value="markdown"
      class="DocEditorMarkdown_TextArea"
      @change="changeMarkdown"
      @paste="onPaste"
      @dragenter.prevent="onDragEnter"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onDrop"
    ></textarea>
  </div>
</template>

<script>
import singleDTHandler from '../../../../modules/singleDataTransferHandler'

export default {
  name: 'DocEditorMarkdown',
  props: {
    markdown: {
      type: String,
      default: '',
    },
  },
  methods: {
    changeMarkdown(e) {
      this._updateMarkdown(e.target.value)
    },
    onDragEnter(e) {},
    onDragOver(e) {},
    onDragLeave(e) {},
    onPaste(e) {
      this._insertImage(e.clipboardData, e.target)
    },
    onDrop(e) {
      this._insertImage(e.dataTransfer, e.target)
    },
    _insertImage(dataTransfer, target) {
      if (!singleDTHandler.isSingleImageFile(dataTransfer)) return false
      const imagePath = prompt(
        'Please enter the image file path. If the width is specified, specify as \'! [./img/foo.png] (./img/foo.png "=100x")\'.',
        './img/undefined.png',
      )
      if (imagePath === null) return false
      const imageFile = singleDTHandler.getAsSingleFile(dataTransfer)
      this.$emit('uploadImage', {
        imageFile,
        imagePath,
        done: () => {
          const textBefore = target.value.substring(0, target.selectionStart)
          const textAfter = target.value.substring(target.selectionEnd, target.value.length)
          const markdown = textBefore + `![${imagePath}](${imagePath})` + textAfter
          this._updateMarkdown(markdown)
        },
      })
    },
    _updateMarkdown(markdown) {
      this.$emit('updateMarkdown', markdown)
    },
    _isSingleFileType(clipboardData) {
      if (!clipboardData) return false
      if (!clipboardData.types) return false
      if (clipboardData.types.length !== 1) return false
      return clipboardData.types[0] === 'Files'
    },
  },
}
</script>

<style lang="scss" scoped>
.DocEditorMarkdown {
  box-sizing: border-box;
  padding: 8px;
  height: 100%;
  &_TextArea {
    box-sizing: border-box;
    font-size: 14px;
    padding: 8px;
    width: 100%;
    height: 100%;
    resize: none;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
  }
}
</style>
