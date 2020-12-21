import CidReceivingHistory from '../../api/cid/cid-receiving-history-api'

const state_default = {
  cid_receiving_histories: {},
  cid_receiving_history_action: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getCidReceivingHistories(state){
    return state.cid_receiving_histories
  },
  getCidReceivingHistoryAction(state) {
    return state.cid_receiving_history_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setCidReceivingHistories(state, cid_receiving_histories){  
    state.cid_receiving_histories = cid_receiving_histories
  },
  updateCidReceivingHistoryType(state, cid_receiving_history_edit){ 
    for(let key in state.cid_receiving_histories.data.items){
      if(state.cid_receiving_histories.data.items[key].cid_receiving_history_id == cid_receiving_history_edit.cid_receiving_history_id){
        state.cid_receiving_histories.data.items[key] = Object.assign(state.cid_receiving_histories.data.items[key], cid_receiving_history_edit)
      }
    }
  },
  setCidReceivingHistoryAction(state, cid_receiving_history_action){
    state.cid_receiving_history_action = cid_receiving_history_action
  }
}

// actions
const actions = {
  async getCidReceivingHistoriesDataAsync({commit}, filter){
    try {
      let cid_receiving_history_api = new CidReceivingHistory()
      let result = await cid_receiving_history_api.getCIDReceivingHistoriesAsync(filter)
      commit('setCidReceivingHistories', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async setCidReceivingHistoryActionDataAsync({commit}, cid_receiving_history_action){
    try{
      commit('setCidReceivingHistoryAction', cid_receiving_history_action)
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