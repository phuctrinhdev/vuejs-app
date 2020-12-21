const state_default = {
  deposit_action: {
    action: 0,
    data: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getBookingDepositAction(state){
    return state.deposit_action
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBookingDepositAction(state, deposit_action){
    state.deposit_action = deposit_action
  },
}

// actions
const actions = {
  setBookingDepositActionData({commit}, deposit_action){
    commit('setBookingDepositAction', deposit_action)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
