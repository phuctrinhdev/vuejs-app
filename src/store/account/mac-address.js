const state_default = {
  mac_addresses: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getMacAddresses(state){
    return state.mac_addresses
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setMacAddresses(state, mac_addresses){  
    state.mac_addresses = mac_addresses
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}