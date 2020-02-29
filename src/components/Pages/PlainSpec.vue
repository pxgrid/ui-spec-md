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
      />
    </div>
    <OverlayScreen v-show="isShowTreeDialog" @close="onCloseTreeDialog">
      <BaseDialog :overflowScroll="true" @close="onCloseTreeDialog">
        <div slot="main">
          <Tree :treeData="treeData" :toRoot="toRoot" />
        </div>
      </BaseDialog>
    </OverlayScreen>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import TheHeader from '../TheHeader.vue'
import OverlayScreen from '../Common/OverlayScreen.vue'
import BaseDialog from '../Common/BaseDialog.vue'
import Tree from '../Common/Tree.vue'
import Doc from './Spec/Doc.vue'
import editableTypes from '../../store/modules/editable/types'

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
      createNewFile: editableTypes.CREATE_NEW_FILE,
    }),
    onOpenTreeDialog() {
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
@import '../../assets/variable.scss';
.PlainSpec {
  display: flex;
  max-height: calc(100vh - #{$theHeaderHeight});
  width: 50%;
  margin: 0 auto;
}
</style>
