<template>
  <div class="Tree">
    <div>
      <input class="Tree_FilterInput" type="text" @keyup="onKeyUpFilter" />
    </div>
    <ul class="Tree_List">
      <TreeItem
        class="Tree_Item"
        :opened="true"
        :filterWord="filterWord"
        :treeData="treeData"
        :toRoot="toRoot"
        :currentPathFromRoot="currentPathFromRoot"
        :callback="callback"
        @closeTreeDialog="onCloseTreeDialog"
      />
    </ul>
  </div>
</template>

<script>
import TreeItem from './TreeItem.vue'
export default {
  name: 'Tree',
  components: {
    TreeItem,
  },
  props: {
    treeData: {
      type: Object,
      required: true,
    },
    toRoot: {
      type: String,
      required: true,
    },
    currentPathFromRoot: {
      type: String,
      required: true,
    },
    callback: {
      type: Function,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      filterWord: '',
    }
  },
  methods: {
    onKeyUpFilter(e) {
      this.filterWord = e.target.value
    },
    onCloseTreeDialog() {
      this.$emit('closeTreeDialog')
    },
  },
}
</script>

<style lang="scss" scoped>
.Tree {
  &_FilterInput {
    padding: 5px;
    width: 300px;
    height: 35px;
    box-sizing: border-box;
    outline: 0;
  }
  &_List {
    overflow: scroll;
    height: 80vh;
    width: 600px;
    padding-left: 0;
    list-style: none;
  }
}
</style>
