<template>
  <div class="DocEditor">
    <DocEditorTabBar @activeWrite="activeWrite" @activePreview="activePreview" />
    <div class="DocEditor_InputContainer">
      <DocEditorMarkdown
        v-show="isActiveWrite"
        :markdown="editingMarkdown"
        @updateMarkdown="onUpdateMarkdown"
        @uploadImage="onUploadImage"
      />
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
import ActionButton from '../../../Common/Buttons/ActionButton.vue'
import DocEditorTabBar from './DocEditorTabBar.vue'
import DocEditorMarkdown from './DocEditorMarkdown.vue'
import DocEditorPreview from './DocEditorPreview.vue'
export default {
  name: 'DocEditor',
  components: {
    ActionButton,
    DocEditorTabBar,
    DocEditorMarkdown,
    DocEditorPreview,
  },
  props: {
    markdown: {
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
      editingMarkdown: '',
    }
  },
  watch: {
    markdown: function(newVal, oldVal) {
      // markdownの値は非同期で取得するためmounted時のpropsの値がnullになってしまうので、非同期後に取得できるようにwatchしている
      this.editingMarkdown = newVal
    },
  },
  methods: {
    activeWrite() {
      this.isActiveWrite = true
    },
    activePreview() {
      this.$emit('fetchConvertedHtml', { markdown: this.editingMarkdown })
      this.isActiveWrite = false
    },
    onUpdateMarkdown(changedMarkdown) {
      this.editingMarkdown = changedMarkdown
    },
    onUploadImage({ imageFile, imagePath, done }) {
      this.$emit('uploadImage', { imageFile, imagePath, done })
    },
    onWriteMarkdown() {
      this.$emit('writeMarkdown', { markdown: this.editingMarkdown })
      this.$emit('closeEditor')
    },
    cancelEditMarkdown() {
      this.editingMarkdown = this.markdown
      this.$emit('closeEditor')
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
}
</style>
