const state_default = {

}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  
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
