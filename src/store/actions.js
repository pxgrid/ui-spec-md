import axios from 'axios'
import types from './types'

export default {
  async [types.FETCH_TREE_DATA]({ commit }) {
    const res = await axios.get('/tree.json')
    const treeData = res.data
    return commit(types.SET_TREE_DATA, { treeData })
  },
}
