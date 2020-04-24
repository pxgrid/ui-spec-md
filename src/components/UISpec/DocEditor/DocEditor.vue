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
  </div>
</template>

<script>
import CodeMirror from 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'
import 'codemirror/addon/display/autorefresh.js'
import FontAwesomeIcon from '../../Common/FontAwesomeIcon.vue'

import singleDTHandler from '../../../modules/singleDataTransferHandler'

import ActionButton from '../../Button/ActionButton.vue'
import DocEditorTabBar from './DocEditorTabBar.vue'
import DocEditorPreview from './DocEditorPreview.vue'
import splitMarkdownByHeadlineIndex from '../../../modules/splitMarkdownByHeadlineIndex'
export default {
  name: 'DocEditor',
  components: {
    ActionButton,
    DocEditorTabBar,
    DocEditorPreview,
    FontAwesomeIcon,
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
