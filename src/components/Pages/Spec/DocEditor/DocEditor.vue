<template>
  <div class="DocEditor">
    <DocEditorTabBar @activeWrite="activeWrite" @activePreview="activePreview" />
    <div class="DocEditor_InputContainer">
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
  </div>
</template>

<script>
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/addon/display/autorefresh.js'

import singleDTHandler from '../../../../modules/singleDataTransferHandler'

import ActionButton from '../../../Common/Buttons/ActionButton.vue'
import DocEditorTabBar from './DocEditorTabBar.vue'
import DocEditorPreview from './DocEditorPreview.vue'
export default {
  name: 'DocEditor',
  components: {
    ActionButton,
    DocEditorTabBar,
    DocEditorPreview,
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
  },
  data() {
    return {
      isActiveWrite: true,
      editor: null,
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
    this.editor.on('drop', (codeMirror, e) => {
      this._insertImage(e.dataTransfer, codeMirror)
    })
    this.editor.on('paste', (codeMirror, e) => {
      this._insertImage(e.clipboardData, codeMirror)
    })
  },
  methods: {
    activeWrite() {
      this.isActiveWrite = true
    },
    activePreview() {
      this.$emit('fetchConvertedHtml', { markdown: this.editor.getValue() })
      this.isActiveWrite = false
    },
    uploadImage({ imageFile, imagePath, done }) {
      this.$emit('uploadImage', { imageFile, imagePath, done })
    },
    onWriteMarkdown() {
      this.$emit('writeMarkdown', { markdown: this.editor.getValue() })
      this.$emit('closeEditor')
    },
    cancelEditMarkdown() {
      this.editor.setValue(this.markdown)
      this.$emit('closeEditor')
    },

    _insertImage(dataTransfer, codeMirror) {
      if (!singleDTHandler.isSingleImageFile(dataTransfer)) return false
      const imageFile = singleDTHandler.getAsSingleFile(dataTransfer)
      const imagePath = prompt(
        'Please enter the image file path. If the width is specified, specify as \'! [./img/foo.png] (./img/foo.png "=100x")\'.',
        './img/undefined.png',
      )
      if (imagePath === null) return false
      this.uploadImage({
        imageFile,
        imagePath,
        done: () => {
          const cursorPosition = codeMirror.getCursor()
          codeMirror.replaceRange(`![${imagePath}](${imagePath})`, cursorPosition)
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../../../assets/variable.scss';
.DocEditor {
  display: grid;
  grid-template-rows: 40px auto 50px;
  grid-template-columns: auto;
  &_InputContainer {
    height: 100%;
    border: 1px solid #e5e5e5;
    border-top-style: none;
  }
  &_Preview {
    box-sizing: border-box;
    padding: 20px;
    height: calc(100vh - #{$documentEditorTabBarHeight} - #{$theHeaderHeight} - #{$navBarsHeight});
    overflow: scroll;
  }
  &_ActionBar {
    padding: 10px;
  }
  &_Markdown {
    position: relative;
    box-sizing: border-box;
    padding: 8px;
    height: 100%;
    /deep/ .CodeMirror {
      height: 100%;
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
    height: 100%;
    resize: none;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
  }
}
</style>
