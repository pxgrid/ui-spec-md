<template>
  <li class="TreeItem">
    <div class="TreeItem_Toggle" @click="toggle">
      <span v-if="isDir" class="TreeItem_DirIcon">
        <FontAwesomeIcon v-show="!open" icon="plus-square" size="1x" />
        <FontAwesomeIcon v-show="open" icon="minus-square" size="1x" />
      </span>
      <span v-else class="TreeItem_NodeIcon">└</span>
      <a
        v-if="!callback"
        class="TreeItem_Title"
        :class="{ _match: !matchFilter, _current: isCurrentPage(treeData.rootPath) }"
        :href="toRelative(treeData.rootPath)"
      >
        {{ treeData.title }}
      </a>
      <span
        v-if="callback"
        class="TreeItem_Title"
        :class="{ _match: !matchFilter, _current: isCurrentPage(treeData.rootPath) }"
        @click="onClickTreeItem(treeData.title, treeData.rootPath)"
      >
        {{ treeData.title }}
      </span>
    </div>
    <ul v-if="isDir" v-show="open" class="TreeItem_List">
      <TreeItem
        v-for="(treeDataChild, index) in treeDataChildren"
        :key="index"
        class="item"
        :filterWord="filterWord"
        :treeData="treeDataChild"
        :toRoot="toRoot"
        :currentPathFromRoot="currentPathFromRoot"
        :callback="callback"
        @expand="onExpand"
        @closeTreeDialog="onCloseTreeDialog"
      >
      </TreeItem>
    </ul>
  </li>
</template>

<script>
import FontAwesomeIcon from '../FontAwesomeIcon.vue'
export default {
  name: 'TreeItem',
  components: {
    FontAwesomeIcon,
  },
  props: {
    opened: {
      type: Boolean,
      default: false,
    },
    filterWord: {
      type: String,
      default: '',
    },
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
      open: false,
    }
  },
  computed: {
    isDir() {
      return this.treeData.children && this.treeData.children.length
    },
    treeDataChildren() {
      return this.treeData.children
    },
    matchFilter() {
      const title = this.treeData.title
      const regExp = new RegExp(this.filterWord)
      if (this.filterWord === '' || !title) return true
      return regExp.test(title)
    },
  },
  watch: {
    filterWord(newWord) {
      if (this.matchFilter && newWord !== '') {
        this.$emit('expand')
      }
    },
  },
  mounted() {
    if (this.opened) {
      this.open = true
    }
    if (this.currentPathFromRoot === this.treeData.rootPath) {
      this.$emit('expand')
    }
  },
  methods: {
    toggle() {
      if (this.isDir) {
        this.open = !this.open
      }
    },
    toRelative(rootPath) {
      return this.toRoot + rootPath.replace(/^\//, '')
    },
    isCurrentPage(rootPath) {
      return this.currentPathFromRoot === rootPath
    },
    onExpand() {
      this.open = true
      this.$emit('expand')
    },
    onClickTreeItem(title, rootPath) {
      this.callback(title, this.toRelative(rootPath))
      this.$emit('closeTreeDialog')
    },
    onCloseTreeDialog() {
      this.$emit('closeTreeDialog')
    },
  },
}
</script>

<style lang="scss" scoped>
.TreeItem {
  &_Toggle {
    cursor: pointer;
  }
  &_DirIcon {
    color: #666666;
  }
  &_NodeIcon {
    color: #999999;
  }
  &_Title {
    &:hover {
      color: #555555;
    }
    &._match {
      color: #bbbbbb;
    }
    &._current {
      font-weight: bold;
    }
  }
  &_List {
    list-style: none;
    padding-left: 20px;
  }
}
</style>
