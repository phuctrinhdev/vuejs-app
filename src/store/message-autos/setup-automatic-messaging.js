const state_default = {
  setup_automatic_messaging_info: {
    tab: null,
    type: null,
    // id: null
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getSetupAutomaticMessagingInfo(state){
    return state.setup_automatic_messaging_info
  },
}

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, state_default)
  },
  setSetupAutomaticMessagingInfo(state, setup_automatic_messaging_info){
    state.setup_automatic_messaging_info = setup_automatic_messaging_info
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