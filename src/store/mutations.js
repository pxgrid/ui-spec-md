import types from './types'

export default {
  [types.SET_TREE_DATA](state, { treeData }) {
    state.treeData = treeData
  },
}
