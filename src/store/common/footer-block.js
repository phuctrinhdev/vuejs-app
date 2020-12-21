const state_default = {
  footer_data: {
    logo_link: '/'
  }
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getFooter: (state) => {
    return state.footer_data
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
}

// actions
const actions = {

}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
