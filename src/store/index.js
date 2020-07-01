import Vue from 'vue'
import Vuex from 'vuex'

import main from './module/main'
import edit from './module/edit'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    main,
    edit
  }
})
