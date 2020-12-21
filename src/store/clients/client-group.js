import ClientGroupApi from '../../api/clients/client-group-api'

const state_default = {
  client_groups: {},
  client_group_action: {
    action: 0,
    data: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getClientGroup(state){ 
    return state.client_groups
  },
  getClientGroupAction(state) {
    return state.client_group_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setClientGroup(state, client_groups){  
    state.client_groups = client_groups
  },
  updateClientGroup(state, client_group_edit){ 
    for(let key in state.client_groups.data.items){
      if(state.client_groups.data.items[key].id == client_group_edit.id){
        state.client_groups.data.items[key] = Object.assign(state.client_groups.data.items[key], client_group_edit)
      }
    }
  },
  setClientGroupAction(state, client_group_action){
    state.client_group_action = client_group_action
  },
}

// actions
const actions = {
  async getClientGroupDataAsync({commit}, filter){    
    try {
      let client_group_api = new ClientGroupApi()      
      let result = await client_group_api.getClientGroupAsync(filter)
      commit('setClientGroup', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  updateClientGroupData({commit}, client_group){
    commit('updateClientGroup', client_group)
  },
  setClientGroupActionData({commit}, client_group_action){
    commit('setClientGroupAction', client_group_action)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
