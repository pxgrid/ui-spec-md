<template>
  <div
    contenteditable="true"
    class="EditorDrop"
    @keydown="onKeyDown"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent="onDragOver"
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
    @paste.prevent="onPaste"
  >
    <div class="EditorDrop_Target">
      <svg class="EditorDrop_Icon" width="50" height="43" viewBox="0 0 50 43">
        <path
          d="M48.4 26.5c-.9 0-1.7.7-1.7 1.7v11.6h-43.3v-11.6c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v13.2c0 .9.7 1.7 1.7 1.7h46.7c.9 0 1.7-.7 1.7-1.7v-13.2c0-1-.7-1.7-1.7-1.7zm-24.5 6.1c.3.3.8.5 1.2.5.4 0 .9-.2 1.2-.5l10-11.6c.7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0l-7.1 8.3v-25.3c0-.9-.7-1.7-1.7-1.7s-1.7.7-1.7 1.7v25.3l-7.1-8.3c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4l10 11.6z"
        />
      </svg>
      Drag an image or paste clipboard image here.
    </div>

    <Portal to="uploadScreenImageDialog">
      <OverlayScreen v-show="isShowImageUploadDialog" @close="closeImageUploadDialog">
        <BaseDialog
          class="ImageUploadDialog"
          :overflowScroll="false"
          @close="closeImageUploadDialog"
        >
          <div slot="main">
            <label class="ImageUploadDialog_PathLabel" for="image-path-to-upload">
              Path to upload:
            </label>
            <input
              id="image-path-to-upload"
              v-model="imagePath"
              type="text"
              class="ImageUploadDialog_Path"
            />
          </div>
          <div slot="footer" class="ImageUploadDialog_Footer">
            <ActionButton :sub="true">
              <span @click="closeImageUploadDialog">Cancel</span>
            </ActionButton>
            <ActionButton>
              <span @click="uploadImage">OK</span>
            </ActionButton>
          </div>
        </BaseDialog>
      </OverlayScreen>
    </Portal>
  </div>
</template>

<script>
import OverlayScreen from '../../../../components/Common/OverlayScreen.vue'
import BaseDialog from '../../../../components/Dialog/BaseDialog.vue'
import ActionButton from '../../../../components/Button/ActionButton.vue'
import loadImage from '../../../../modules/loadImage'
import singleDTHandler from '../../../../modules/singleDataTransferHandler'
export default {
  name: 'EditorDrop',
  components: {
    OverlayScreen,
    BaseDialog,
    ActionButton,
  },
  data() {
    return {
      isShowImageUploadDialog: false,
      temporaryFileData: {
        imageFile: null,
        imageBase64: null,
        width: null,
        height: null,
      },
      imagePath: '',
    }
  },
  methods: {
    openImageUploadDialog() {
      this.isShowImageUploadDialog = true
    },
    closeImageUploadDialog() {
      this.isShowImageUploadDialog = false
    },
    onKeyDown(e) {
      // allow only paste
      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
      return e.keyCode === 86
    },
    onDragEnter(e) {},
    onDragOver(e) {},
    onDragLeave(e) {},
    async onDrop(e) {
      if (!singleDTHandler.isSingleImageFile(e.dataTransfer)) return true
      await this._setTemporaryTransferData(e.dataTransfer)
      this.imagePath = `./img/${this._getImageFileName()}`
      this.openImageUploadDialog()
    },
    async onPaste(e) {
      if (!singleDTHandler.isSingleImageFile(e.clipboardData)) return true
      await this._setTemporaryTransferData(e.clipboardData)
      this.imagePath = `./img/${this._getImageFileName()}`
      this.openImageUploadDialog()
    },
    async uploadImage() {
      this.$emit(
        'setImage',
        {
          src: this.temporaryFileData.imageBase64,
          filename: this.imagePath,
          width: this.temporaryFileData.width,
          height: this.temporaryFileData.height,
        },
        {
          fileToUpload: this.temporaryFileData.imageFile,
        },
      )
      this.closeImageUploadDialog()
    },
    async _setTemporaryTransferData(imageDataToUpload) {
      const imageFile = singleDTHandler.getAsSingleFile(imageDataToUpload)
      const imageBase64 = await singleDTHandler.readBase64(imageDataToUpload)
      const { width, height } = await loadImage(imageBase64)
      this.temporaryFileData = {
        imageFile,
        imageBase64,
        width,
        height,
      }
    },
    _getImageFileName() {
      const fileName = location.pathname.split('/').pop()
      if (!/\.html$/.test(fileName)) {
        return `index.png`
      }
      return fileName.replace(/\.html$/, '.png')
    },
  },
}
</script>

<style lang="scss" scoped>
.EditorDrop {
  cursor: default;
  color: #0f3c4b;
  font-size: 18px;
  position: absolute;
  top: 20px;
  right: 20px;
  bottom: 20px;
  left: 20px;
  display: table;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  border-spacing: 10px;
  border-collapse: separate;
  background: #c8dadf;
  transition: all 0.1s;
  &_Target {
    cursor: default;
    user-select: none;
    pointer-events: none;
    vertical-align: middle;
    display: table-cell;
    box-sizing: border-box;
    height: 100%;
    padding: 10px;
    border: 2px dashed #92b0b3;
  }
  &_Icon {
    width: 75px;
    height: 65px;
    display: block;
    margin: 0 auto 20px;
    fill: #92b0b3;
  }
}
.ImageUploadDialog {
  min-width: 500px;
  &_PathLabel {
    display: block;
  }
  &_Path {
    width: 100%;
  }
  &_Footer {
    margin-top: 10px;
  }
}
</style>
