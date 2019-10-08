/**
 * 各ディレクトリ階層で目次となるページ
 * TODO: {directory}/index.mdがない場合に自動生成
 */
import '../assets/common.scss'

import Vue from 'vue'
import store from '../store'
import types from '../store/types'
import Index from '../components/Pages/Index.vue'

const storeInstance = store()
Vue.config.productionTip = false

storeInstance.dispatch(types.FETCH_TREE_DATA).then(() => {
  new Vue({
    el: '#app',
    store: storeInstance,
    render: h => h(Index),
  })
})
