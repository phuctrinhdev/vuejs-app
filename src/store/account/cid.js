const state_default = {  
  cid_status: false
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {  
  getCidStatus(state){
    return state.cid_status
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  // shop info
  setCidStatus(state, cid_status){
    state.cid_status = cid_status
  }
}

// actions
const actions = {
  async setCidStatusAsync({commit}, cid_status){
    try{
      commit('setCidStatus', cid_status)
    }catch(e){
      return this.http.loadError(e)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
