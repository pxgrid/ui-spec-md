/**
 * 各ディレクトリ階層で目次となるページ
 * TODO: {directory}/index.mdがない場合に自動生成
 */
import Vue from 'vue'
import store from '../store'
import types from '../store/types'
import Index from '../components/Index.vue'

const storeInstance = store()
Vue.config.devtools = true

storeInstance.commit(types.SET_TREE_DATA, { treeData: SCREEN_SPEC_MD_TREE_DATA })
new Vue({
  el: '#app',
  store: storeInstance,
  render: h => h(Index),
})
