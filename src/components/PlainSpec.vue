<template>
  <div>
    <TheHeader
      :editable="editable"
      :toRoot="toRoot"
      @openTreeDialog="onOpenTreeDialog"
      @createNewFile="onCreateNewFile"
    />
    <div class="PlainSpec">
      <Doc
        :editable="editable"
        :width="'100%'"
        :convertedHtml="convertedHtml"
        :updatedDate="updatedDate"
        :createdDate="createdDate"
        :createdAuthorName="createdAuthorName"
        :callback="callback"
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
    <PortalTarget name="uploadDocumentImageDialog"></PortalTarget>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TheHeader from './Common/TheHeader.vue'
import OverlayScreen from './Common/OverlayScreen.vue'
import BaseDialog from './Dialog/BaseDialog.vue'
import Tree from './Tree/Tree.vue'
import Doc from './UISpec/Doc.vue'
import editableTypes from '../store/modules/editable/types'

export default {
  name: 'PlainSpec',
  components: {
    TheHeader,
    OverlayScreen,
    BaseDialog,
    Doc,
    Tree,
  },
  data() {
    return {
      isShowTreeDialog: false,
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
      createNewFile: editableTypes.CREATE_NEW_FILE,
    }),
    onOpenTreeDialog(callback) {
      this.callback = callback
      this.isShowTreeDialog = true
    },
    onCloseTreeDialog() {
      this.isShowTreeDialog = false
    },
    async onCreateNewFile(newFilePath) {
      const { request } = await this.createNewFile({ newFilePath })
      if (request && request.responseURL) {
        location.href = request.responseURL
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/variable.scss';
.PlainSpec {
  display: flex;
  max-height: calc(100vh - #{$theHeaderHeight});
  width: 50%;
  margin: 0 auto;
}
</style>
