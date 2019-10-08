import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import state from './state'
import modules from './modules'

Vue.use(Vuex)

const store = () => {
  return new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    modules,
  })
}

export default store
