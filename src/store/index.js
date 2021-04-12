import { createStore } from 'vuex'
import state from './state.js'
import mutations from './mutations.js'

export default createStore({
  state,
  mutations
})
