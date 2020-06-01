<template>
  <BaseDialog
    class="UploadImagePathDialog"
    :overflowScroll="false"
    @close="closeUploadImagePathDialog"
  >
    <div slot="main">
      <div class="UploadImagePathDialog_Container">
        <div class="UploadImagePathDialog_PathContainer">
          <label class="UploadImagePathDialog_PathLabel" for="image-path-to-upload">
            Path to upload:
          </label>
          <input
            id="image-path-to-upload"
            v-model="imagePath"
            type="text"
            class="UploadImagePathDialog_Path"
            @input="debounceInputUploadPath"
          />
        </div>
        <div v-if="isAvailableWidth" class="UploadImagePathDialog_PathContainer">
          <label class="UploadImagePathDialog_WidthLabel" for="image-width">
            width:
          </label>
          <input
            id="image-width"
            v-model="imageWidth"
            type="number"
            class="UploadImagePathDialog_Width"
          />px
        </div>
      </div>
      <div v-if="isAvailableSerial" class="UploadImagePathDialog_Container">
        <div class="UploadImagePathDialog_PathContainer">
          <button @click="inputSerialFileName">画面名+連番を取得</button>
        </div>
      </div>
      <ul v-show="isShowMessages">
        <li v-show="warnMessage">{{ warnMessage }}</li>
        <li v-show="errorMessage">{{ errorMessage }}</li>
      </ul>
    </div>
    <div slot="footer" class="UploadImagePathDialog_Footer">
      <ActionButton :sub="true">
        <span @click="closeUploadImagePathDialog">Cancel</span>
      </ActionButton>
      <ActionButton :disabled="isDisabledOK">
        <span @click="applyImagePath">OK</span>
      </ActionButton>
    </div>
  </BaseDialog>
</template>

<script>
import ActionButton from '../../Button/ActionButton.vue'
import BaseDialog from '../../Dialog/BaseDialog.vue'
import { debounce } from 'lodash'
import { mapActions } from 'vuex'
import editableTypes from '../../../store/modules/editable/types'

const isValidImagePath = imagePath => {
  return /.+\.(png|jpg|jpeg|svg|gif|webp)$/.test(imagePath)
}

export default {
  name: 'UploadImagePathDialog',
  components: {
    ActionButton,
    BaseDialog,
  },
  props: {
    defaultDirectoryPath: {
      type: String,
      default: './img/',
    },
    defaultImageFileName: {
      type: String,
      default: '',
    },
    isAvailableWidth: {
      type: Boolean,
      default: false,
    },
    isAvailableSerial: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imagePath: `${this.defaultDirectoryPath}${this.defaultImageFileName}`,
      imageWidth: '',
      debounceInputUploadPath: () => {},
      warnMessage: '',
      errorMessage: '',
    }
  },
  computed: {
    isShowMessages() {
      return this.warnMessage !== '' || this.errorMessage !== ''
    },
    isDisabledOK() {
      return this.errorMessage !== ''
    },
  },
  watch: {
    defaultImageFileName(newVal) {
      this.imagePath = `${this.defaultDirectoryPath}${newVal}`
      this.validateInputUploadPath(this.imagePath)
    },
  },
  mounted() {
    this.debounceInputUploadPath = debounce(this.inputUploadPath, 500)
    this.validateInputUploadPath(this.imagePath)
  },
  methods: {
    ...mapActions('editable', {
      validateUploadPath: editableTypes.VALIDATE_UPLOAD_PATH,
      fetchSerialFileName: editableTypes.FETCH_SERIAL_FILE_NAME,
    }),
    inputUploadPath(e) {
      const uploadPath = e.target.value
      this.validateInputUploadPath(uploadPath)
    },
    async validateInputUploadPath(uploadPath) {
      this.warnMessage = ''
      this.errorMessage = ''
      if (!isValidImagePath(uploadPath)) {
        this.errorMessage = '画像ファイルのパスを指定してください'
        return
      }
      const locationPathName = location.pathname
      const result = await this.validateUploadPath({ uploadPath, locationPathName })
      const { invalid, exists } = result.data
      this.warnMessage = exists ? 'ファイルは既に存在するため上書きされます' : ''
      this.errorMessage = invalid ? '不正なパスです' : ''
    },
    async inputSerialFileName() {
      const locationPathName = location.pathname
      const result = await this.fetchSerialFileName({
        uploadDir: this.defaultDirectoryPath,
        locationPathName,
      })
      this.imagePath = result.data
      await this.validateInputUploadPath(this.imagePath)
    },
    closeUploadImagePathDialog() {
      this.$emit('close')
    },
    applyImagePath() {
      this.$emit('apply', { imagePath: this.imagePath, imageWidth: this.imageWidth })
    },
  },
}
</script>

<style lang="scss" scoped>
.UploadImagePathDialog {
  &_Container {
    margin-top: 10px;
  }
  &_PathContainer {
    display: inline-block;
  }
}
</style>
