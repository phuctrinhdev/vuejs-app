const state_default = {
  locale: ''
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getLocale: (state) => {
    return state.locale
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setLocale(state, locale){
    state.locale = locale
  }
}

// actions
const actions = {
  setLocaleData({commit}, locale){
    commit('setLocale', locale)
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
