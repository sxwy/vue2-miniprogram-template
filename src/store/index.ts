import Vue from 'vue'
import Vuex from 'vuex'
import { StoreState } from './type'
import { user } from './modules'

Vue.use(Vuex)

const store = new Vuex.Store<StoreState>({
  modules: {
    user
  }
})

export default store
