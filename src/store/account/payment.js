
const state_default = {
  payment_data: {},
  virtual_account_result_data: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getPaymentData(state){
    return state.payment_data
  },
  getVirtualAccountResultData(state){
    return state.virtual_account_result_data
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setPaymentData(state, payment_data){ 
    state.payment_data = payment_data
  },
  setVirtualAccountResultData(state, virtual_account_result_data){ 
    state.virtual_account_result_data = virtual_account_result_data
  }
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