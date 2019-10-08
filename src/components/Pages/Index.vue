<template>
  <div>
    <TheHeader @openTreeDialog="onOpenTreeDialog" />
    <div class="Index">目次</div>
    <OverlayScreen v-show="isShowTreeDialog" @close="onCloseTreeDialog">
      <BaseDialog :overflowScroll="true" @close="onCloseTreeDialog">
        <div slot="main">
          <Tree :treeData="treeData" />
        </div>
      </BaseDialog>
    </OverlayScreen>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TheHeader from '../TheHeader.vue'
import OverlayScreen from '../Common/OverlayScreen.vue'
import BaseDialog from '../Common/BaseDialog.vue'
import Tree from '../Common/Tree.vue'

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
@import '../../assets/variable.scss';
.Index {
  display: flex;
  max-height: calc(100vh - #{$theHeaderHeight});
  width: 100%;
}
</style>
