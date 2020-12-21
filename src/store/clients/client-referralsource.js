import ClientReferralSourceApi from '../../api/clients/client-referralsource-api'

const state_default = {
  client_referralsources: {},
  client_referralsource_action: {
    action: 0,
    data: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getClientReferralSource(state){ 
    return state.client_referralsources
  },
  getClientReferralSourceAction(state) {
    return state.client_referralsource_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setClientReferralSource(state, client_referralsources){  
    state.client_referralsources = client_referralsources
  },
  updateClientReferralSource(state, client_referralsource_edit){ 
    for(let key in state.client_referralsources.data.items){
      if(state.client_referralsources.data.items[key].id == client_referralsource_edit.id){
        state.client_referralsources.data.items[key] = Object.assign(state.client_referralsources.data.items[key], client_referralsource_edit)
      }
    }
  },
  setClientReferralSourceAction(state, client_referralsource_action){
    state.client_referralsource_action = client_referralsource_action
  },
}

// actions
const actions = {
  async getClientReferralSourceDataAsync({commit}, filter){    
    try {
      let _api = new ClientReferralSourceApi()      
      let result = await _api.getClientReferralSourceAsync(filter)
      commit('setClientReferralSource', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  updateClientReferralSourceData({commit}, client_referralsource){
    commit('updateClientReferralSource', client_referralsource)
  },
  setClientReferralSourceActionData({commit}, client_referralsource_action){
    commit('setClientReferralSourceAction', client_referralsource_action)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
