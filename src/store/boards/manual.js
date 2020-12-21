import ManualManagementApi from '../../api/boards/manual-management-api'

const state_default = {
  manual_managements: {},
  manual_management_action: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getManualManagements(state){
    return state.manual_managements
  },
  getManualManagementAction(state) {
    return state.manual_management_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setManualManagements(state, manual_managements){  
    state.manual_managements = manual_managements
  },
  setManualManagementAction(state, manual_management_action){
    state.manual_management_action = manual_management_action
  }
}

// actions
const actions = {
  async getManualManagementsDataAsync({commit}, filter){
    try {
      let manual_management_api = new ManualManagementApi()
      let result = await manual_management_api.getManualManagementsAsync(filter)
      commit('setManualManagements', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async setMenualManagementActionDataAsync({commit}, manual_management_action){
    try{
      let manual_management_api = new ManualManagementApi()
      let result = await manual_management_api.getManualManagementAsync(manual_management_action)
      commit('setManualManagementAction', result)
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