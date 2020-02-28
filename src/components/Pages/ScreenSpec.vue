<template>
  <div class="ScreenSpec">
    <TheHeader
      :editable="editable"
      :toRoot="toRoot"
      @openTreeDialog="onOpenTreeDialog"
      @createNewFile="onCreateNewFile"
    />
    <div class="Spec">
      <Screen
        :editable="editable"
        :width="screenWidth"
        :screen="screen"
        :svgCanvasHtml="svgCanvasHtml"
        @openScreenEditor="onOpenScreenEditor"
      />
      <Separator @drag="onSeparatorDrag" />
      <Doc
        :editable="editable"
        :width="documentWidth"
        :convertedHtml="convertedHtml"
        :updatedDate="updatedDate"
        :updatedAuthorName="updatedAuthorName"
        :createdDate="createdDate"
        :createdAuthorName="createdAuthorName"
      />
    </div>
    <OverlayScreen v-show="isShowTreeDialog" @close="onCloseTreeDialog">
      <BaseDialog :overflowScroll="true" @close="onCloseTreeDialog">
        <div slot="main">
          <Tree :treeData="treeData" :toRoot="toRoot" />
        </div>
      </BaseDialog>
    </OverlayScreen>
    <OverlayScreen v-if="isShowScreenEditor" @close="onCloseScreenEditor">
      <BaseDialog
        class="Spec_ScreenEditorDialog"
        :overflowScroll="true"
        @close="onCloseScreenEditor"
      >
        <div slot="main" style="height:100%">
          <ScreenEditor
            :screen="screen"
            @updateFilenameWithCoordinates="onUpdateFilenameWithCoordinates"
            @updateFileToUpload="onUpdateFileToUpload"
          />
        </div>
        <div v-if="editable" slot="footer" class="Spec_ScreenEditorDialogActionBar">
          <ActionButton :sub="true">
            <span @click="onCloseScreenEditor">Cancel</span>
          </ActionButton>
          <ActionButton>
            <span @click="onWriteScreenMetadata">Save</span>
          </ActionButton>
        </div>
      </BaseDialog>
    </OverlayScreen>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import editableTypes from '../../store/modules/editable/types'
import TheHeader from '../TheHeader.vue'
import OverlayScreen from '../Common/OverlayScreen.vue'
import BaseDialog from '../Common/BaseDialog.vue'
import Tree from '../Common/Tree.vue'
import Screen from './Spec/Screen.vue'
import Separator from './Spec/Separator.vue'
import Doc from './Spec/Doc.vue'
import ActionButton from '../Common/Buttons/ActionButton.vue'
import ScreenEditor from '../ScreenEditor.vue'

export default {
  name: 'ScreenSpec',
  components: {
    TheHeader,
    OverlayScreen,
    BaseDialog,
    Screen,
    Separator,
    Doc,
    Tree,
    ScreenEditor,
    ActionButton,
  },
  data() {
    return {
      screen: window.SCREEN_SPEC_MD.screen,
      filenameWithCoordinates: '',
      fileToUpload: null,
      svgCanvasHtml: window.SCREEN_SPEC_MD.svgCanvasHtml,
      isShowTreeDialog: false,
      isShowScreenEditor: false,
      screenWidth: '50%',
      documentWidth: '50%',
    }
  },
  computed: {
    ...mapState({
      treeData: 'treeData',
    }),
    ...mapState('editable', {
      editable: 'editable',
      convertedHtml: 'body',
      toRoot: 'toRoot',
      updatedDate: 'updatedDate',
      updatedAuthorName: 'updatedAuthorName',
      createdDate: 'createdDate',
      createdAuthorName: 'createdAuthorName',
    }),
  },
  methods: {
    ...mapActions('editable', {
      writeScreenMetadata: editableTypes.WRITE_SCREEN_METADATA,
      removeScreenMetadata: editableTypes.REMOVE_SCREEN_METADATA,
      createNewFile: editableTypes.CREATE_NEW_FILE,
    }),
    onSeparatorDrag({ leftScreenRate }) {
      this.screenWidth = `${leftScreenRate * 100}%`
      this.documentWidth = `${(1 - leftScreenRate) * 100}%`
    },
    onOpenTreeDialog() {
      this.isShowTreeDialog = true
    },
    onCloseTreeDialog() {
      this.isShowTreeDialog = false
    },
    onOpenScreenEditor() {
      this.isShowScreenEditor = true
    },
    onCloseScreenEditor() {
      this.isShowScreenEditor = false
    },
    onCreateNewFile(newFilePath) {
      this.createNewFile({ newFilePath }).then(() => {
        setTimeout(() => {
          location.href = newFilePath.replace(/\.md$/, '.html')
        }, 500)
      })
    },
    onUpdateFilenameWithCoordinates({ filenameWithCoordinates }) {
      this.filenameWithCoordinates = filenameWithCoordinates
    },
    onUpdateFileToUpload({ fileToUpload }) {
      this.fileToUpload = fileToUpload
    },
    onWriteScreenMetadata() {
      if (this.filenameWithCoordinates === '') {
        this.removeScreenMetadata().then(() => {
          // TODO: It must change template "ScreenSpec" to "PlaneSpec".
          this.screen = ''
          this.svgCanvasHtml = ''
          this.onCloseScreenEditor()
        })
        return
      }
      this.writeScreenMetadata({
        screenMetadata: this.filenameWithCoordinates,
        fileToUpload: this.fileToUpload,
        // ex. /path/to/image.png?highlight=[[1,2,3,4]] => /path/to/index.html
        imagePath: this.filenameWithCoordinates.replace(/\?.+/, ''),
      }).then(context => {
        this.screen = context.screen
        this.svgCanvasHtml = context.svgCanvas
        this.onCloseScreenEditor()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../../assets/variable.scss';
.Spec {
  display: flex;
  max-height: calc(100vh - #{$theHeaderHeight});
  width: 100%;
  &_ScreenEditorDialog {
    width: 90vw;
    height: 95vh;
  }
  &_ScreenEditorDialogActionBar {
    padding: 10px;
  }
}
</style>
