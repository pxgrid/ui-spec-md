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
        @openTreeDialog="onOpenTreeDialog"
      />
    </div>
    <OverlayScreen v-show="isShowTreeDialog" @close="onCloseTreeDialog">
      <BaseDialog :overflowScroll="true" @close="onCloseTreeDialog">
        <div slot="main">
          <Tree
            :treeData="treeData"
            :toRoot="toRoot"
            :currentPathFromRoot="currentPathFromRoot"
            :callback="callback"
            @closeTreeDialog="onCloseTreeDialog"
          />
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
import editableTypes from '../store/modules/editable/types'
import TheHeader from './Common/TheHeader.vue'
import OverlayScreen from './Common/OverlayScreen.vue'
import BaseDialog from './Dialog/BaseDialog.vue'
import Tree from './Tree/Tree.vue'
import Screen from './UISpec/Screen.vue'
import Separator from './UISpec/Separator.vue'
import Doc from './UISpec/Doc.vue'
import ActionButton from './Button/ActionButton.vue'
import ScreenEditor from './ScreenEditor/ScreenEditor.vue'

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
      callback: null,
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
    currentPathFromRoot() {
      return location.pathname
    },
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
    onOpenTreeDialog(callback) {
      this.callback = callback
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
    async onCreateNewFile(newFilePath) {
      const { request } = await this.createNewFile({ newFilePath })
      if (request && request.responseURL) {
        location.href = request.responseURL
      }
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
      } else {
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
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/variable.scss';
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
