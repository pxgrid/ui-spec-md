import '../assets/style.scss'

import Vue from 'vue'
import store from '../store'
import PortalVue from 'portal-vue'
Vue.use(PortalVue)

import ScreenSpec from '../components/Pages/ScreenSpec.vue'
import types from '../store/types'
import editableTypes from '../store/modules/editable/types'

const storeInstance = store()
Vue.config.productionTip = false

storeInstance.commit(types.SET_TREE_DATA, { treeData: SCREEN_SPEC_MD_TREE_DATA })
storeInstance.commit(`editable/${editableTypes.INIT_PAGE}`)
new Vue({
  el: '#app',
  store: storeInstance,
  render: h => h(ScreenSpec),
})
