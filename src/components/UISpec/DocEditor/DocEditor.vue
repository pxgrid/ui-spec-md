<template>
  <div class="DocEditor">
    <DocEditorTabBar @activeWrite="activeWrite" @activePreview="activePreview" />
    <div class="DocEditor_InputContainer">
      <div v-show="isActiveWrite" class="DocEditor_Toolbar">
        <ul class="DocEditor_ToolbarList">
          <li class="DocEditor_ToolbarListItem">
            <button class="DocEditor_ToolbarIconButton" @click="onOpenTreeDialog">
              <FontAwesomeIcon icon="link" size="1x" />
            </button>
          </li>
        </ul>
      </div>
      <div v-show="isActiveWrite" class="DocEditor_Markdown">
        <textarea ref="textarea" :value="markdown" class="DocEditor_MarkdownTextArea"></textarea>
      </div>
      <DocEditorPreview
        v-show="!isActiveWrite"
        class="DocEditor_Preview"
        :previewedHtml="previewedHtml"
      />
    </div>
    <div class="DocEditor_ActionBar">
      <ActionButton :sub="true">
        <span @click="cancelEditMarkdown()">Cancel</span>
      </ActionButton>
      <ActionButton>
        <span @click="onWriteMarkdown()">Save</span>
      </ActionButton>
    </div>

    <Portal to="uploadDocumentImageDialog">
      <OverlayScreen v-show="isShowImageUploadDialog" @close="closeImageUploadDialog">
        <UploadImagePathDialog @apply="uploadImage" @close="closeImageUploadDialog" />
      </OverlayScreen>
    </Portal>
  </div>
</template>

<script>
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/addon/display/autorefresh.js'
import FontAwesomeIcon from '../../Common/FontAwesomeIcon.vue'

import OverlayScreen from '../../../components/Common/OverlayScreen.vue'
import ActionButton from '../../Button/ActionButton.vue'
import DocEditorTabBar from './DocEditorTabBar.vue'
import DocEditorPreview from './DocEditorPreview.vue'
import UploadImagePathDialog from '../Dialog/UploadImagePathDialog.vue'

import singleDTHandler from '../../../modules/singleDataTransferHandler'
import splitMarkdownByHeadlineIndex from '../../../modules/splitMarkdownByHeadlineIndex'
import loadImage from '../../../modules/loadImage'
export default {
  name: 'DocEditor',
  components: {
    FontAwesomeIcon,
    OverlayScreen,
    ActionButton,
    DocEditorTabBar,
    DocEditorPreview,
    UploadImagePathDialog,
  },
  props: {
    markdown: {
      type: String,
      default: '',
    },
    screen: {
      type: String,
      default: '',
    },
    previewedHtml: {
      type: String,
      default: '',
    },
    headlineIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      isActiveWrite: true,
      editor: null,
      aboveMarkdown: '',
      belowMarkdown: '',
      isShowImageUploadDialog: false,
      temporaryFileData: {
        imageFile: null,
        imageBase64: null,
        width: null,
        height: null,
      },
    }
  },
  watch: {
    markdown: function(newVal, oldVal) {
      // markdownの値は非同期で取得するためmounted時のpropsの値がnullになってしまうので、非同期後に取得できるようにwatchしている
      this.editor.setValue(newVal)
    },
    screen: function(newVal, oldVal) {
      const markdown = this.editor.getValue()
      const replacedMarkdown = markdown.replace(/\nscreen\:(.+)\n/, `\nscreen: ${newVal}\n`)
      this.editor.setValue(replacedMarkdown)
    },
    headlineIndex: function(newVal, oldVal) {
      if (newVal < 0) return
      const markdown = this.editor.getValue()
      const [aboveMarkdown, targetMarkdown, belowMarkdown] = splitMarkdownByHeadlineIndex(
        markdown,
        newVal,
      )
      this.aboveMarkdown = aboveMarkdown
      this.belowMarkdown = belowMarkdown
      this.editor.setValue(targetMarkdown)
    },
  },
  mounted() {
    this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
      mode: {
        name: 'gfm',
        gitHubSpice: false,
      },
      lineNumbers: true,
      lineWrapping: true,
      autoRefresh: true,
    })
    this.editor.on('drop', async (codeMirror, e) => {
      await this._insertImage(e.dataTransfer)
    })
    this.editor.on('paste', async (codeMirror, e) => {
      await this._insertImage(e.clipboardData)
    })
  },
  methods: {
    openImageUploadDialog() {
      this.isShowImageUploadDialog = true
    },
    closeImageUploadDialog() {
      this.isShowImageUploadDialog = false
    },
    activeWrite() {
      this.isActiveWrite = true
    },
    activePreview() {
      this.$emit('fetchConvertedHtml', { markdown: this.editor.getValue() })
      this.isActiveWrite = false
    },
    uploadImage({ imagePath, imageWidth }) {
      const imageFile = this.temporaryFileData.imageFile
      const widthMarkup = imageWidth ? ` "=${imageWidth}x"` : ''
      const done = () => {
        const cursorPosition = this.editor.getCursor()
        this.editor.replaceRange(`![${imagePath}](${imagePath}${widthMarkup})`, cursorPosition)
        this.closeImageUploadDialog()
      }
      this.$emit('uploadImage', { imageFile, imagePath, done })
    },
    onOpenTreeDialog() {
      this.$emit('openTreeDialog', (pageTitle, path) => {
        const cursorPosition = this.editor.getCursor()
        const link = `[${pageTitle}](${path})`
        this.editor.replaceRange(link, cursorPosition)
        this.editor.focus()
        this.editor.setCursor({ line: cursorPosition.line, ch: link.length })
      })
    },
    onWriteMarkdown() {
      const markdown =
        this.headlineIndex !== -1
          ? `${this.aboveMarkdown}\n${this.editor.getValue()}\n${this.belowMarkdown}`
          : this.editor.getValue()
      this.$emit('writeMarkdown', { markdown })
      this.$emit('closeEditor')
    },
    cancelEditMarkdown() {
      this.editor.setValue(this.markdown)
      this.$emit('closeEditor')
    },

    async _insertImage(dataTransfer) {
      if (!singleDTHandler.isSingleImageFile(dataTransfer)) return false
      await this._setTemporaryTransferData(dataTransfer)
      this.openImageUploadDialog()
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
  },
}
</script>

<style lang="scss" scoped>
@import '../../../assets/variable.scss';
$editorToolbarHeight: 30px;
$actionBarHeight: 54px;

.DocEditor {
  &_InputContainer {
    border: 1px solid #e5e5e5;
    border-top-style: none;
  }
  &_Preview {
    box-sizing: border-box;
    padding: 20px;
    height: calc(100vh - #{$theHeaderHeight} - #{$navBarsHeight} - #{$documentEditorTabBarHeight});
    overflow: scroll;
  }
  &_Toolbar {
    height: $editorToolbarHeight;
    background-color: #eeeeee;
    padding-left: 30px;
    border-bottom: 1px solid #cccccc;
  }
  &_ToolbarList {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
  }
  &_ToolbarListItem {
  }
  &_ToolbarIconButton {
    font-size: 12px;
    appearance: none;
    border: none;
    background: none;
  }
  &_Markdown {
    position: relative;
    box-sizing: border-box;
    padding: 8px;
    height: calc(
      100vh - #{$theHeaderHeight} - #{$navBarsHeight} - #{$documentEditorTabBarHeight} - #{$actionBarHeight} -
        #{$editorToolbarHeight}
    );
    /deep/ .CodeMirror {
      width: 100%;
      height: calc(
        100vh - #{$theHeaderHeight} - #{$navBarsHeight} - #{$documentEditorTabBarHeight} - #{$actionBarHeight} -
          #{$editorToolbarHeight}
      );
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &_MarkdownTextArea {
    box-sizing: border-box;
    font-size: 14px;
    padding: 8px;
    width: 100%;
    height: calc(
      100vh - #{$theHeaderHeight} - #{$navBarsHeight} - #{$documentEditorTabBarHeight} - #{$actionBarHeight}
    );
    resize: none;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
  }
  &_ActionBar {
    height: $actionBarHeight;
    padding: 10px;
  }
}
</style>
