<template>
  <BaseDialog
    class="UploadImagePathDialog"
    :overflowScroll="false"
    @close="closeUploadImagePathDialog"
  >
    <div slot="main">
      <div>
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
export default {
  name: 'UploadImagePathDialog',
  components: {
    ActionButton,
    BaseDialog,
  },
  data() {
    return {
      imagePath: './img/undefined.png',
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
  mounted() {
    this.debounceInputUploadPath = debounce(this.inputUploadPath, 500)
  },
  methods: {
    ...mapActions('editable', {
      validateUploadPath: editableTypes.VALIDATE_UPLOAD_PATH,
    }),
    async inputUploadPath(e) {
      const uploadPath = e.target.value
      const locationPathName = location.pathname
      const result = await this.validateUploadPath({ uploadPath, locationPathName })
      const { invalid, exists } = result.data
      this.warnMessage = exists ? 'ファイルは既に存在するため上書きされます' : ''
      this.errorMessage = invalid ? '不正なパスです' : ''
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
