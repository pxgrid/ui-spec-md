<template>
  <div>
    <TheHeader :toRoot="toRoot" @openTreeDialog="onOpenTreeDialog" />
    <div class="Index">目次</div>
    <OverlayScreen v-show="isShowTreeDialog" @close="onCloseTreeDialog">
      <BaseDialog :overflowScroll="true" @close="onCloseTreeDialog">
        <div slot="main">
          <Tree :treeData="treeData" :currentPathFromRoot="currentPathFromRoot" />
        </div>
      </BaseDialog>
    </OverlayScreen>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TheHeader from './Common/TheHeader.vue'
import OverlayScreen from './Common/OverlayScreen.vue'
import BaseDialog from './Dialog/BaseDialog.vue'
import Tree from './Tree/Tree.vue'

export default {
  name: 'Index',
  components: {
    TheHeader,
    OverlayScreen,
    BaseDialog,
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
      toRoot: 'toRoot',
    }),
    currentPathFromRoot() {
      return location.pathname
    },
  },
  methods: {
    onOpenTreeDialog() {
      this.isShowTreeDialog = true
    },
    onCloseTreeDialog() {
      this.isShowTreeDialog = false
    },
  },
}
</script>

<style lang="scss" scoped>
@import '../assets/variable.scss';
.Index {
  display: flex;
  max-height: calc(100vh - #{$theHeaderHeight});
  width: 100%;
}
</style>
